import React from 'react';
import Navbar from "../navbar";
import styled from 'styled-components';
import Mainlanding from "./mainlanding";
import {AnimatePresence, motion} from 'framer-motion';

const HomeContainer = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
`

function Home(props) {
    return (
            <HomeContainer>
                <Navbar/>
                <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
                    <Mainlanding/>
                </motion.div>
            </HomeContainer>
    );
}

export default Home;