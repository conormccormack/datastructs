import React from 'react';
import AnimeTest from './animetest';
import Navbar from './navbar';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`

function BST (props){
    return (
        <Wrapper>
            <Navbar/>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                <AnimeTest/>
            </motion.div>
        </Wrapper>
        
    );
}

export default BST;