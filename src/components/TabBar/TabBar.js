import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from "react";
import './TabBar.css'
import { useDispatch } from 'react-redux';
import { changeStatusPage, changeSelectedStore, storeSelectedMenu, storeSelectedStore, changeSelectedMenu, changeSelectedCategory, storeStatusPage } from '../Redux/Store';
import { useSelector } from 'react-redux';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ArticleIcon from '@mui/icons-material/Article';
import StarIcon from '@mui/icons-material/Star';
const TabBar = () => {
    const updateMenu = (number) => {
        dispatch(changeSelectedMenu(number))
    }
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    const calcMargin = () => {
        let margin = (vw - 40) ;
        return margin.toString() + "px"
    }



    const dispatch = useDispatch();
    const selectedMenuRedux = useSelector(storeSelectedMenu);
    return (
        <div className='tabBarWrapper' >
            <div className='tabBar'style={{width: calcMargin(), marginLeft: "20px"}}>
                <div className='iconsWrapper'>
                    <div onClick={() => updateMenu(0)} >
                        < StorefrontIcon style={selectedMenuRedux === 0 ? {color: "#ff9580"} : null}/>
                    </div>
                    <div onClick={() => updateMenu(1)} >
                        <ArticleIcon style={selectedMenuRedux === 1 ? {color: "#ff9580"} : null}/>
                    </div>
                    <div onClick={() => updateMenu(2)} >
                        < AccountBoxIcon style={selectedMenuRedux === 2 ? {color: "#ff9580"} : null}/>
                    </div>
                    <div onClick={() => updateMenu(3)} >
                        < StarIcon style={selectedMenuRedux === 3 ? {color: "#ff9580"} : null}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabBar
