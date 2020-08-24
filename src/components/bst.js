import React, { useEffect } from 'react';
import RefactoredBST from './refactoredbst';
import Navbar from './navigation/navbar';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Headline = styled.div`
    font-family: Ramaraja;
    font-size: min(50px, calc(40px + 1vw));
    padding-left: min(90px, calc(12vw - 30px));
    padding-right: min(90px, calc(12vw - 30px)); 
`

function BST (props){
    useEffect(()=>{
        document.title = 'Binary Search Tree';
    }, [])
    return (
        <div>
            <Navbar/>
            <Headline>Binary Search Tree</Headline>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                <RefactoredBST/>
            </motion.div>
        </div>
        
    );
}

export default BST;