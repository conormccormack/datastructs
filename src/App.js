import React from 'react';
import './App.css';
import Home from './components/home/home'
import About from './components/about'
import { Switch, Route, useLocation } from 'react-router-dom';
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
              <Switch key={location.pathname} location={location}>
                  <Route exact path='/' render={(props) => <Home {...props} transition={PageTransition} variants={PageVariants}/>} />
                  {/* <Route exact path='/'>
                    <Home {...location} transition={PageTransition} variants={PageVariants}/>
                  </Route> */}
                  <Route exact path='/bst' render={(props) => <BST {...props} transition={PageTransition} variants={PageVariants}/> } />
                  <Route exact path='/avl' render={(props) => <AVL {...props} transition={PageTransition} variants={PageVariants}/> } />
                  <Route exact path='/about' render={(props) => <About {...props} transition={PageTransition} variants={PageVariants}/>}/>
                  <Route component={FourOhFour}/>
              </Switch>
          </AnimatePresence>
  );
}

export default App;