import React from 'react';
import './App.css';
import Home from './components/home/home'
import About from './components/about'
import Catalog from './components/catalog'
import Premium from './components/premium'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TestAnimation from "./components/testanimation";
import HackAnimation from "./components/hackanimation";

function App() {
  return (
      <Router>
          <Switch>
              <Route path='/' exact component={Home}/>
              <Route path='/test' exact component={HackAnimation}/>
              <Route path='/about' component={About}/>
              <Route path='/catalog' exact component={Catalog}/>
              <Route path='/premium' exact component={Premium}/>
          </Switch>
      </Router>
  );
}

export default App;
