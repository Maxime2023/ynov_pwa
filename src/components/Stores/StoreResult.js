import React, { useState, useRef } from 'react'
import { useEffect } from "react";
import {Input,Button,Select, Carousel} from "antd";
import Store from "./Store";
import './StoreResult.css';
import axios from "axios";
import Categories from './Categories/Categories';
import Products from './Products/Products';
import ProductsInfos from './ProductsInfos/ProductsInfos';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { changeStatusPage, storeSelectedMenu, storeSelectedStore, changeSelectedMenu, changeSelectedCategory } from '../Redux/Store';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
const StoreResult = (props) => {
    const [selectedMenu, setSelectedMenu] = useState("Categories")
    const {data} = props;
    const dispatch = useDispatch();
    const slider = useRef();
    const selectedStore = useSelector(storeSelectedStore);
    const selectedMenuRedux = useSelector(storeSelectedMenu);

    useEffect(() => {
        slider.current.goTo(selectedMenuRedux);
        console.log("sqtoores")
      },[selectedMenuRedux]);


    const updateMenu = (number) => {
        dispatch(changeSelectedMenu(number))
    }

    const handleBackBtn = () => {
        dispatch(changeSelectedCategory(""))
        dispatch(changeSelectedMenu(0))
        dispatch(changeStatusPage("Home"))
    }
    return (
        <div className='storeResultWrapper'>
            <div className='storeResultWrapperHeader'>
            <div className='backBtn' onClick={() => handleBackBtn()}>
            &#8592;
            </div>
                <div className='storeName'>
                    {selectedStore.name}
                </div>
            </div>
           
            {/* <Carousel ref={ref => {slider.current = ref;}} dots={false}>
                <div>
                    <Categories data={data.categories}/>
                </div>
                <div>
                    <Products data={data.products}/>
                </div>
                <div>
                    <ProductsInfos data={data.products}/>
                </div>
            </Carousel> */}
                <div className='CarouselBtn'>
                    <div onClick={() => updateMenu(0)} style={selectedMenuRedux === 0? {backgroundColor: "#a7c7e7"} : {backgroundColor: "white"}}>
                        {AccessibilityIcon}
                    </div>
                    {/* <div onClick={() => updateMenu(1)} style={selectedMenuRedux === 1 ? {backgroundColor: "#a7c7e7"} : {backgroundColor: "white"}}>
                        <img style={{height: "50px", marginTop: "5px"}}  src={"https://cdn-icons-png.flaticon.com/512/3313/3313509.png"}/>
                    </div>
                    <div onClick={() => updateMenu(2)} style={selectedMenuRedux === 2 ? {backgroundColor: "#a7c7e7"} : {backgroundColor: "white"}}>
                        <img style={{height: "50px", marginTop: "5px"}}  src={"https://cdn-icons-png.flaticon.com/512/114/114968.png"}/>
                    </div> */}
                </div>
        </div>
    );
}

export default StoreResult