import React from 'react';
import RefactoredBST from './refactoredbst';
import Navbar from './navigation/navbar';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled.div`
    height: 100vh;
`   

const Headline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
    padding-left: 100px;
`

function BST (props){
    return (
        <Wrapper className='landing'>
            <Navbar/>
            <Headline>Binary Search Tree</Headline>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                <RefactoredBST/>
            </motion.div>
        </Wrapper>
        
    );
}

export default BST;