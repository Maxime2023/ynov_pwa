import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import './LoginAndRegisterWrapper.css'
import axios from 'axios'
export function LoginAndregisterWrapper() {
  const [statusPage, setStatusPage] = useState("Login");

  const openNotification = (type) => {
    notification.open({
      message: type,
      description:
        type + ' succeed',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  const onFinish = (values, type) => {
    axios.post(`https://7uyqywoy02.execute-api.eu-central-1.amazonaws.com/Prod/` + type, {"username": values.username, "password": values.password, "formation": values.formation, "userType": "client"})
    .then(res => {
      console.log(res.data)
      openNotification(type)
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (statusPage === "Register" ) {
    return (
      <div className="loginPage">
        <Form style={{width: "100%"}} name="basic" onFinish={(e) => onFinish(e, "register")} onFinishFailed={(e) => onFinishFailed(e, "register")}autoComplete="off">
          <div style={{fontSize: "28px", color: "#2a3345", padding: "20px"}}>
            Découvrez les boutiques et bien plus!
          </div>
          <div style={{fontSize: "22px", color: "#2a3345", padding: "20px"}}>
            En créant votre compte
          </div>
          <div style={{padding: "20px"}}>
          <Form.Item  name="username" rules={[{ required: true, message: 'Il manque l\'identifiant!',},]}>
            <input placeholder='Adresse e-mail' className='inputLoginAndRegister' />
          </Form.Item>
          <Form.Item  name="password" rules={[{ required: true, message: 'Il manque le mot de passe!',},]}>
            <input type='password' placeholder='Mot de passe' className='inputLoginAndRegister' />
          </Form.Item>
          <Form.Item  name="password" rules={[{ required: true, message: 'Il manque le mot de passe!',},]}>
            <input type='password' placeholder='Confirmer le mot de passe' className='inputLoginAndRegister' />
          </Form.Item>
          <Form.Item>
            <button className='loginBtn' htmlType="submit">
              S'inscrire
            </button>
          </Form.Item>
          <div style={{cursor: "pointer", display: "flex", justifyContent: "center" }} onClick={() => setStatusPage("Login")}>Déja un compte ?&#160;<p style={{color: "#0593fc"}}> Se connecter</p> </div>
          </div>
        </Form>
      </div>
    )
  }
  if (statusPage === "Login" ) {
    return (
      <div className="loginPage">
        <Form style={{width: "100%"}} name="basic" onFinish={(e) => onFinish(e, "login")} onFinishFailed={(e) => onFinishFailed(e, "login")}autoComplete="off">
          <div style={{fontSize: "28px", color: "#2a3345", padding: "20px"}}>
            Content de vous revoir!
          </div>
          <div style={{fontSize: "22px", color: "#2a3345", padding: "20px"}}>
            Vous nous avez manqué!
          </div>
          <div style={{padding: "20px"}}>
          <Form.Item  name="username" rules={[{ required: true, message: 'Il manque l\'identifiant!',},]}>
            <input placeholder='Adresse e-mail' className='inputLoginAndRegister' />
          </Form.Item>
          <Form.Item  name="password" rules={[{ required: true, message: 'Il manque le mot de passe!',},]}>
            <input type='password' placeholder='Mot de passe' className='inputLoginAndRegister' />
          </Form.Item>
          <Form.Item>
            <button className='loginBtn' htmlType="submit">
              Se connecter
            </button>
          </Form.Item>
          <div style={{cursor: "pointer", display: "flex", justifyContent: "center" }} onClick={() => setStatusPage("Register")}>Pas encore de compte ?&#160;<p style={{color: "#0593fc"}}> S'inscrire</p> </div>
          </div>
        </Form>
    
        
      </div>
    )
  }
}
export default LoginAndregisterWrapper;