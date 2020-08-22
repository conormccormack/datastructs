import React from 'react';
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

function AVL (props){
    return (
        <Wrapper className='landing'>
            <Navbar/>
            <Headline>AVL Tree</Headline>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                Work in Progress
            </motion.div>
        </Wrapper>
        
    );
}

export default AVL;