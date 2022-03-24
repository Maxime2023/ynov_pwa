import { useEffect, useRef, useState } from "react";
import './App.css';
import { Navbar, Nav } from "react-bootstrap";
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage"
import firebase from "./services/firbaseService";
import Matches from "./components/matches";
import Stores from "./components/Stores/Stores";
import LoginAndregisterWrapper from "./components/LoginAndRegister/LoginAndRegisterWrapper";
import { Carousel } from 'antd';
import { storeStatusPage } from "./components/Redux/Store";
import { useSelector } from 'react-redux';
import backMainPage from './images/backMainPage.png'
import TabBar from "./components/TabBar/TabBar";
import { useDispatch } from 'react-redux';
import Favorites from './components/Favorites/Favorites'
import News from './components/News/News';
import { changeStatusPage, storeSelectedMenu, storeSelectedStore, changeSelectedMenu, changeSelectedCategory } from './components/Redux/Store';
const App = () => {
  const slider = useRef();
  const selectedMenuRedux = useSelector(storeSelectedMenu);
  const dispatch = useDispatch();
  useEffect(() => {
    slider.current.goTo(selectedMenuRedux);
    const message = firebase.messaging();
    message.requestPermission().then(() => {
      return message.getToken()
    }).then((data) => {
      console.warn("TOKEN:", data)
    })
   
  }, [selectedMenuRedux]);

  function onChange(nbr) {
    dispatch(changeSelectedMenu(nbr))
  }


  return (
    <div className="App">
     oui test
        {/* <div className="mainPageWrapperApp">
          <div className='MainPageWrapper' style={{backgroundImage: `url(${backMainPage})`}}>
              <div className='btnDiscoverStoresWrapper'>
                  Vous allez adorer nos produits
                  <p style={{fontSize: "10px", color: "darkgrey"}}>Il y en a pour tous les gouts !</p>
                  <div className='btnDiscoverStores' onClick={() => slider.current.goTo(1)}>
                      Découvrir les boutiques
                  </div>
              </div>
          </div>
        </div> */}
      <div>
                    <Carousel ref={ref => {slider.current = ref;}} dots={false} afterChange={onChange}>
                <div>
                  <Stores/>
                </div>
                <div>
                  <News/>
                </div>
                <div>
                  <LoginAndregisterWrapper/>
                </div>
                <div>
                  <Favorites/>
                </div>
            </Carousel>
    
        <TabBar/>
      </div>



    </div>
  );
}

export default App;
