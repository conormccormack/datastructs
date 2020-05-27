import React, {useEffect, useState} from "react";
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
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

const DisplayNode = styled.div`
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
    font-family: Helvetica;
    color: #FFF;
`

const Margin20 = styled.div`
    margin: 20px;
`


// class Node {
//     constructor(data, left = null, right = null) {
//         this.data = data;
//         this.leftChild = left;
//         this.rightChild = right;
//     }
// }

// const TemplateTree = [
//     {
//         data: 10,
//         left: {
//             data: 2,
//             left: null,
//             right: null,
//         },
//         right: {
//             data: 12,
//             left: null,
//             right: null,
//         },
//     }
// ];


function TestAnimation(){
    const [numberNodes, setNumberNodes] = useState(0);
    const [inputValue, setInputValue ] = useState([]);
    const [tree, setTree] = useState([]);

    const onInsertDown = event => {
        event.preventDefault();
        if (numberNodes === 0){
            setTree([
                {
                    data: inputValue,
                    left: null,
                    right: null,
                }
            ])
        }
        setNumberNodes(numberNodes => numberNodes + 1);
        const treenum = {tree, numberNodes};
        console.log(treenum)
    };

    const handleChange = event => setInputValue(event.target.value);

    return (
        <div>
            <Navbar/>
            <TestSandbox>
                <ListWrapper>
                    <Margin20>
                        { BinaryTree({tree})}
                    </Margin20>
                </ListWrapper>
                <form style={{paddingLeft:'100px'}} onSubmit={onInsertDown}>
                    <label>
                        <input type='text' value={inputValue} onChange={handleChange}></input> Input
                    </label>
                </form>
            </TestSandbox>
        </div>
    )
}

// Recursion
function BinaryTree ( tree ) {
    return(
        <div>
            { tree.map(node => (
                <ul>
                    <Margin20>
                        <motion.div initial={{scale: 0}} animate={{scale: 1}} whileHover={{scale: 1.5}}>
                            <DisplayNode>
                                <NodeContent>{node[0].data}</NodeContent>
                            </DisplayNode>
                        </motion.div>
                    </Margin20>
                </ul>
                )
            )

            }
        </div>
    )

}

export default TestAnimation;