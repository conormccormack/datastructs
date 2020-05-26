import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from "./navbar";


const TestSandbox = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
    display: grid;
`

const Centered = styled.div`
    height: 200px; 
    width: 100px;
    margin: auto;
    text-align: center;
`

const Box = styled.div`
    background-color: #D8BBFF; 
    border-radius: 50%;
    margin-top: 10px;
    height: 100px; 
    width: 100px;
    margin: auto;
`

function TestAnimation(){
    return (
        <TestSandbox>
            <Navbar/>
            <Centered>
                <motion.div whileHover={{ scale: 3}} >
                       <Box/>
                </motion.div>
            </Centered>
        </TestSandbox>
    )

}

export default TestAnimation;