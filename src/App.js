import React from 'react';
import './App.css';
import Home from './components/home/home'
import About from './components/about'
import Catalog from './components/catalog'
import Premium from './components/premium'
import { BrowserRouter as Switch, Route, useLocation } from 'react-router-dom';
import {AnimatePresence} from "framer-motion";
import Reftree from './components/reftest';
import BST from './components/bst';

const PageVariants = {
    pageIn : {
        opacity: 1,
        y: 0,
        x: 0,
    },
    pageInit : {
        opacity: 0,
        y: 50,
        scale: 1,
    },
    pageOut : {
        opacity: 0,
        y: -50,
    }
};

const PageTransition = {
    type: "tween",
    ease: "anticipate",
};

function App() {
    let location = useLocation();
    return (
          <AnimatePresence exitBeforeEnter>
              <Switch location={location} key={location.pathname}>
                  <Route path='/' exact render={(props) => <Home {...props} transition={PageTransition} variants={PageVariants}/>} />
                  <Route path='/test' exact render={(props) => <Reftree {...props} transition={PageTransition} variants={PageVariants}/>} />
                  <Route path='/Binary Search Tree' exact render={(props) => <BST {...props} transition={PageTransition} variants={PageVariants}/> } />
                  <Route path='/about' render={(props) => <About {...props} transition={PageTransition} variants={PageVariants}/>}/>
                  <Route path='/catalog' exact render={(props) => <Catalog {...props} transition={PageTransition} variants={PageVariants}/>}/>
                  <Route path='/premium' exact render={(props) => <Premium {...props} transition={PageTransition} variants={PageVariants}/>}/>
              </Switch>
          </AnimatePresence>
  );
}

export default App;
