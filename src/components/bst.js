import React from 'react';
import AnimeTest from './animetest';
import Navbar from './navbar';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: #ece7e3;
    height: 100vh;
`   

const Headline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
    padding-left: 100px;
    background-color: #ece7e3;
`

function BST (props){
    return (
        <Wrapper>
            <Navbar/>
            <Headline>Binary Search Tree</Headline>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                <AnimeTest/>
            </motion.div>
        </Wrapper>
        
    );
}

export default BST;