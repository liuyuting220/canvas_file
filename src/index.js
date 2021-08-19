import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route,Switch,Redirect} from 'react-router-dom'
// import App from './App';

import Canvaspage from './components/Canvaspage';
import Home from './components/Home'

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path='/canvas' component={Canvaspage}></Route>
      <Route path='/' component={Home}></Route>
      <Redirect to="/"/>
    </Switch>
  </BrowserRouter> 
  ,
  document.getElementById('root')
);

