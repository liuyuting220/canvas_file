import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter, Route,Switch,Redirect} from 'react-router-dom'

import CanvasPage from './components/CanvasPage';
import Home from './components/Home'

ReactDOM.render(
  <BrowserRouter>
  <Switch>
    <Route path='/canvas' component={CanvasPage}></Route>
    <Route path='/' component={Home}></Route>
    <Redirect to="/"/>
  </Switch>
  </BrowserRouter> 
  ,
  document.getElementById('root')
);

