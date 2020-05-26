import React, { useState } from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from "./navbar";


const TestSandbox = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
    grid-template-columns: 1fr 1fr;
    display: grid;
`

const ListWrapper = styled.div`
    height: 200px; 
    width: 100px;
    margin-left: 100px;
    margin-right: 100px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

const Node = styled.div`
    background-color: #D8BBFF; 
    border-radius: 50%;
    margin: 20px;
    height: 100px; 
    width: 100px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`

const NodeContent = styled.div`
    text-align: center;
    vertical-align: middle;
    font-size: 30px;
    font-family: open-sans;
    
`

const Margin20 = styled.div`
    margin: 20px;
`

function TestAnimation(){
    const [nodeList, setNodeList] = useState([]);
    const [inputValue, setInputValue ] = useState([]);

    const onInsertDown = event => {
        event.preventDefault();
        setNodeList(nodeList.concat(<Margin20>
            <motion.div initial={{ scale: 0 }} animate={{ scale : 1}} whileHover={{ scale: 1.5 }} >
                <Node>
                    <NodeContent>{inputValue}</NodeContent>
                </Node>
            </motion.div>
        </Margin20>));
    };

    const handleChange = event => setInputValue(event.target.value);

    return (
        <div>
            <Navbar/>
            <TestSandbox>
                <form style={{paddingLeft:'100px'}} onSubmit={onInsertDown}>
                    <input type='text' value={inputValue} onChange={handleChange}></input>
                    Insert
                </form>

                <ListWrapper>
                    {nodeList}
                </ListWrapper>
            </TestSandbox>
        </div>
    )

}

export default TestAnimation;