import React from 'react';
import './App.css';
import Home from './components/home/home'
import About from './components/about'
import { BrowserRouter as Switch, Route, useLocation } from 'react-router-dom';
import {AnimatePresence} from "framer-motion";
import BST from './components/bst';
import AVL from './components/avl';
import FourOhFour from './components/404';

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
                  <Route path='/bst' exact render={(props) => <BST {...props} transition={PageTransition} variants={PageVariants}/> } />
                  <Route path='/avl' exact render={(props) => <AVL {...props} transition={PageTransition} variants={PageVariants}/> } />
                  <Route path='/about' render={(props) => <About {...props} transition={PageTransition} variants={PageVariants}/>}/>
                  <Route render={(props) => <FourOhFour {...props} transition={PageTransition} variants={PageVariants}/>}/>
              </Switch>
          </AnimatePresence>
  );
}

export default App;
