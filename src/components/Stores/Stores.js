import React, { useState, useEffect } from 'react'
import {Input,Button,Select} from "antd";
import Store from "./Store";
import './Stores.css';
import axios from "axios";
import StoreResult from "./StoreResult";
import { useDispatch } from 'react-redux';
import {data} from "./Data.js"
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { changeStatusPage, changeSelectedStore, storeSelectedMenu, storeSelectedStore, changeSelectedMenu, changeSelectedCategory, storeStatusPage } from '../Redux/Store';
const { Option } = Select;

const Stores = () => {
    const [inputValue, setInputValue] = useState("");
    const [stores, setStores] = useState(data.stores);
    const [selectedStore, setSelectedStore] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAdress] = useState("Toutes les boutiques");
    const [loading, setLoading] = useState(false);
    const statusPage = useSelector(storeStatusPage);
    const dispatch = useDispatch();
    const selectedMenuRedux = useSelector(storeSelectedMenu);

    // useEffect(() => {
    //     console.log("laaaaStores")
    //     dispatch(changeSelectedMenu(0))
    //   },[selectedMenuRedux]);

    const handleChangeSelector = (value) => {
        setSelectedAdress(value)
    }

    const updateMenu = (number) => {
        dispatch(changeSelectedMenu(number))
    }

    const searchStores = () => {
    //    setLoading(true);
    //    axios.get("https://f2zjurxgkg.execute-api.eu-central-1.amazonaws.com/Prod/stores/"+inputValue)
    //        .then(
    //            res=>{
    //                setStores(res.data.stores);
    //                setAddresses(res.data.addresses);
    //                setLoading(false);
    //            }
    //        )
   }

   const setStoreSelected = (store) => {
        dispatch(changeSelectedStore(store))
        dispatch(changeStatusPage("Store"))
        setSelectedStore(store);
   }
   
   const mapStore = () => {
       return handleSelector().map(store=>
           <div key={store.ID} onClick={()=>setStoreSelected(store)}>
               <Store data={store}/>
           </div>
       )
   }

  
    const handleLoading = () => {
        if (loading){
            return (
                <div>
                    loading
                </div>
                // <div style={{height: "100vh", textAlign: "center", lineHeight: "100vh"}}>
                //     <div><img alt="loading" style={{height: "150px"}} src={"https://www.wakawaka.fr/wp-content/uploads/2021/09/45124d126d0f0b6d8f5c4d635d466246.gif"}/></div>
                // </div>
            );
        }
        else {
            return (
                <div className='allStores'>{mapStore()} </div>
            )
        }
    }

    const handleSelector = () => {
        let storesToReturn = [];
        if (selectedAddress === "Toutes les boutiques") {
            return stores;
        }
        else {
            for (let i = 0; i < stores.length; i++) {
                if (stores[i]['address'] === selectedAddress) {
                    storesToReturn.push(stores[i]);
                }
            }
        }
        return storesToReturn;
    }

    const handleSelect = () => {
        if (stores.length > 0) {
            return (
                <Select defaultValue="Toutes les boutiques" style={{ width: "80%" }} onChange={(e) => handleChangeSelector(e)}>
                    {addresses.map(address => <Option value={address}>{address}</Option> )}   
                </Select>
            )
        }
    }
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const calcMargin = () => {
        let margin = (vw - 40) ;
        return {"width": margin.toString() + "px", "marginLeft": "20px"}
    }

    return (
        <div>

            <div className='StoreWrapperHeader' style={calcMargin()}>
                <div className='storeSearch'>  
                    <div className='storeInput'>
                        <input className='inputStoreWrapper' placeholder="Rechercher une boutique..." onChange={(e)=>setInputValue(e.target.value)}/>
                    </div>
                    <div className='storeButtonSearch'>
                <button className='storeButtonSearchWrapper' onClick={()=>searchStores()}>
                    <SearchIcon/>
                </button>
                    </div>
                </div>
                {/* <div className='storesSelector'>
                {handleSelect()}
                </div>         */}
            </div>
         
   
        <div className='StoresWrapper'>

            {handleLoading()}

        </div>
        </div>
    )
}

export default Stores
