import json
import boto3
import base64
import uuid
from boto3.dynamodb.conditions import Key

USER_POOL_ID = 'eu-central-1_z34daIIqV'
CLIENT_ID = '1q8o1t1u53cpe6j4emkhffpidn'


def scanRecursive(tableName, **kwargs):
    dynamo = boto3.resource('dynamodb')
    dbTable = dynamo.Table(tableName)
    response = dbTable.scan(**kwargs)
    if kwargs.get('Select')=="COUNT":
        return response.get('Count')
    data = response.get('Items')
    while 'LastEvaluatedKey' in response:
        response = kwargs.get('table').scan(ExclusiveStartKey=response['LastEvaluatedKey'], **kwargs)
        data.extend(response['Items'])
    return data
 
def get_user_infos(email):
    client = boto3.client('cognito-idp')
    response = client.admin_get_user(
        UserPoolId=USER_POOL_ID,
        Username=email
    )
    return response['UserAttributes']

def login(event):
    body_parsed = json.loads(event['body'])
    username=body_parsed['username']
    password=body_parsed['password']
    client = boto3.client('cognito-idp')
    try:
        client = boto3.client('cognito-idp')
        resp = client.admin_initiate_auth(
            UserPoolId=USER_POOL_ID,
            ClientId=CLIENT_ID,
            AuthFlow='ADMIN_NO_SRP_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password,
            },
            ClientMetadata={
                'username': username,
                'password': password,
            }
        )
    except client.exceptions.NotAuthorizedException:
        return  {
            'message': 'Wrong ID or password.', 
            'error': True, 
            'success': False,
        }
    except client.exceptions.UserNotConfirmedException:
        return  {
            'message': 'Your account is not yet activated, you will be informed by email when it will..', 
            'error': True, 
            'success': False,
        }
    except Exception as e:
        print(e)
        return  {
            'message': 'This email address doesn\'t exists.', 
            'error': True, 
            'success': False,
        }
    return  {
        'message': 'success', 
        'error': False, 
        'success': True,
        'data': {
            'id_token': resp['AuthenticationResult']['IdToken'],
            'refresh_token': resp['AuthenticationResult']['RefreshToken'],
            'access_token': resp['AuthenticationResult']['AccessToken'],
            'expires_in': resp['AuthenticationResult']['ExpiresIn'],
            'token_type': resp['AuthenticationResult']['TokenType'],
            'user_infos': get_user_infos(username)
        }
    }

def handleStores(event):
    store_to_search = event['pathParameters']['store'].lower()
    data_to_return = []
    addresses = ["Toutes les boutiques"]
    stores = scanRecursive("storeDB")
    for store in stores:
        if store['store'].lower() == store_to_search or store['name'].lower() == store_to_search or store_to_search in store['name'].lower():
            data_to_return.append(store)
            addresses.append(store['address'])
    return {"stores": data_to_return, "addresses": addresses}


def register(event):
    body_parsed = json.loads(event['body'])
    username=body_parsed['username']
    password=body_parsed['password']
    user_type=body_parsed['userType']
    client = boto3.client('cognito-idp')
    try:
        client.sign_up(
            ClientId=CLIENT_ID,
            Username=username,
            Password=password, 
            UserAttributes=[
                {
                    'Name': 'custom:user-type',
                    'Value': user_type
                },
            ],
        )
        client.admin_confirm_sign_up(
            UserPoolId=USER_POOL_ID,
            Username=username,
        )
    except client.exceptions.UsernameExistsException as e:
        return {
            'error': True, 
            'success': False, 
            'message': 'You already have an account, please log in.', 
            'data': None
        }
    except client.exceptions.InvalidPasswordException as e:
        return {
            'error': True, 
            'success': False, 
            'message': 'Password should have Caps, Special characters, Numbers and at least 8 characters.', 
            'data': None
        }
    except Exception as e:
        return {
            'error': True, 
            'success': False, 
            'message': str(e), 
            'data': None
        }
    return {
        'error': False, 
        'success': True, 
        'message': 'Registration done', 
        'data': None
    }

def get_shops_from_user(event):
    shops_to_return = []
    shops = scanRecursive("storeDB")
    for shop in shops:
        if shop['user_owner'] == event['pathParameters']['user_id']:
            shops_to_return.append(shop)
    return shops_to_return

def handle_img(store):
    switcher = {
        'Boulangerie': "https://cdn-icons-png.flaticon.com/512/817/817420.png",
        'Epicerie': "https://cdn-icons-png.flaticon.com/512/817/817420.png",
    }
    return switcher.get(store, "https://cdn-icons-png.flaticon.com/512/2748/2748558.png")
    

def create_shop(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    user = event['pathParameters']['user_id']
    body_parsed = json.loads(event['body'])
    params_needed = ["name", "store", "city", "address"]
    for param in params_needed:
      if param not in body_parsed:
          return "Error: Missing parameter(s)"
    table.put_item(
    Item = {
        "ID": str(uuid.uuid1()),
        "img": handle_img(body_parsed['store']),
        "user_owner": user,
        "name": body_parsed['name'],
        "store": body_parsed['store'],
        "city": body_parsed['city'],
        "address": body_parsed['address'],
        "products": [],
        "categories": []
    })
    return get_shops_from_user(event)

def get_store(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    response = table.get_item(Key={'ID': event['pathParameters']['shop_id']})
    return response['Item']

def delete_store(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    table.delete_item(Key={'ID': event['pathParameters']['shop_id']})
    return get_shops_from_user(event)

def modify_store(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    body_parsed = json.loads(event['body'])
    store_to_modify = get_store(event)
    delete_store(event)
    store_to_modify.update(body_parsed)
    table.put_item(Item=store_to_modify)
    return get_store(event)

def get_categories(event):
    store = get_store(event)
    return store['categories']

def create_category(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    body_parsed = json.loads(event['body'])
    body_parsed['img'] = handle_img(body_parsed['img'])
    store_to_modify = get_store(event)
    store_to_modify['categories'].append(body_parsed)
    delete_store(event)
    table.put_item(Item=store_to_modify)
    return get_store(event)


def delete_category(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    store_to_modify = get_store(event)
    new_categories = []
    for category in store_to_modify['categories']:
        if category['name'] != event['pathParameters']['category']:
            new_categories.append(category)
    store_to_modify['categories'] = new_categories
    delete_store(event)
    table.put_item(Item=store_to_modify)
    return get_store(event)

def get_products(event):
    store = get_store(event)
    return store['products']

def create_product(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    body_parsed = json.loads(event['body'])
    params_needed = ["Ingredients", "Price", "Labels", "Name"]
    for param in params_needed:
      if param not in body_parsed:
          return "Error: Missing parameter " + param
    product = {
        "ID": str(uuid.uuid1()),
        "Img": handle_img(body_parsed['Name']),
        "Ingredients": body_parsed['Ingredients'],
        "Price": body_parsed['Price'],
        "Labels": body_parsed['Labels'],
        "Name": body_parsed['Name'],
        "Category": body_parsed['Category'],
    }
    store_to_modify = get_store(event)
    store_to_modify['products'].append(product)
    delete_store(event)
    table.put_item(Item=store_to_modify)
    return get_store(event)

def delete_product(event):
    client = boto3.resource('dynamodb')
    table = client.Table("storeDB")
    store_to_modify = get_store(event)
    new_products = []
    for product in store_to_modify['products']:
        if product['ID'] != event['pathParameters']['product_id']:
            new_products.append(product)
    store_to_modify['products'] = new_products
    delete_store(event)
    table.put_item(Item=store_to_modify)
    return get_store(event)
    
def handle_paths(event):
    httpMethod = event['httpMethod']
    resource = event['resource']
    path = httpMethod + resource
    switcher = {
        'GET/stores/{store}': lambda: handleStores(event),
        'POST/login': lambda: login(event),
        'POST/register': lambda: register(event),
        'GET/users/{user_id}/shops': lambda: get_shops_from_user(event),
        'POST/users/{user_id}/shops': lambda: create_shop(event),
        'GET/users/{user_id}/shops/{shop_id}': lambda: get_store(event),
        'DELETE/users/{user_id}/shops/{shop_id}': lambda: delete_store(event),
        'PATCH/users/{user_id}/shops/{shop_id}': lambda: modify_store(event),
        'GET/users/{user_id}/shops/{shop_id}/categories': lambda: get_categories(event),
        'POST/users/{user_id}/shops/{shop_id}/categories': lambda: create_category(event),
        'DELETE/users/{user_id}/shops/{shop_id}/categories/{category}': lambda: delete_category(event),
        'GET/users/{user_id}/shops/{shop_id}/products': lambda: get_products(event),
        'POST/users/{user_id}/shops/{shop_id}/products': lambda: create_product(event),
        'DELETE/users/{user_id}/shops/{shop_id}/products/{product_id}': lambda: delete_product(event),
    }
    return switcher.get(path, lambda:"Wrong path")()

def lambda_handler(event, context):
    response = handle_paths(event)
    print(event)
    return {
        "statusCode": 200,
        "headers": {
          "Access-Control-Allow-Origin" : '*',
          "Access-Control-Allow-Credentials" : True
        },
        "body": json.dumps(response),
    }

if __name__ == '__main__':
    print(handle_paths("a"))