import React from 'react';
import styled from 'styled-components';
import Navbar from "./navbar";
import {motion} from "framer-motion";

const PremiumContainer = styled.div`
    background-color: #EAE7DC;
    height: 100vh;
`
const PremiumHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 80px;
    padding-left: 100px;
`

function Premium(props){
    return(
        <PremiumContainer>
            <Navbar/>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
             <PremiumHeadline>Premium</PremiumHeadline>
            </motion.div>
        </PremiumContainer>
    )
}

export default Premium;