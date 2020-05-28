import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from "./navbar";
import {stringify} from "query-string";

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

const PadLeft100 = styled.div`
    padding-left: 100px;
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

function HackAnimation(){
    const [numberNodes, setNumberNodes] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [removeValue, setRemoveValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [tree, setTree] = useState([...Array(2049)].map((x, index) => {
        const parentId = index > 0 ? Math.floor((index-1)/2) : null;
        const level = Math.floor(Math.log2(index));
        return {data: null, id: index, level: level, parent: parentId, left: index * 2 + 1, right: index * 2 + 2 }
    }));

    const updateTreeIndexInsert = (index, value) =>{
        setTree(tree.map(node => node.id === index ? {...node, data: value} : node));
    };

    const insertRecurse = (root, value) => {
        try {
            if (parseInt(value) < parseInt(tree[root].data)) {
                // Base case: insert new value as leaf node
                if (tree[tree[root].left].data === null) updateTreeIndexInsert(tree[root].left, value);
                else insertRecurse(tree[root].left, value);
            } else {
                // Base case: insert new value as leaf node
                if (tree[tree[root].right].data === null) updateTreeIndexInsert(tree[root].right, value);
                else insertRecurse(tree[root].right, value);
            }
        } finally {
            console.log(tree);
        }
    };

    const insertNode = () => {
        if (tree[0].data === null) {
            updateTreeIndexInsert(0, inputValue);
        } else insertRecurse(0, inputValue);
    };

    const handleInputChange = event => setInputValue(event.target.value);

    const onInsertDown = event => {
        event.preventDefault();
        if (inputValue === '') return;
        insertNode();
        setInputValue('');
        setNumberNodes(numberNodes => numberNodes + 1);
    };

    const handleRemoveChange = event => setRemoveValue(event.target.value);

    const onRemoveDown = event => {
        event.preventDefault();
        setRemoveValue('');
        removeNode();
    };

    const shiftLeftRecurse = (root) => {

    };

    const shiftRightRecurse = (root) => {

    };

    const updateTreeIndexRemove = (root) => {
        setErrorMessage('Removing...');
        const left = tree[root].left;
        const right = tree[root].right;
        if (tree[left].data === null && tree[right].data === null){
            setTree(tree.map(node => node.id === root ? {...node, data: null} : node));
        } else if (tree[left].data === null){

        } else if (tree[right].data === null) {

        } else {

        }
        setNumberNodes(numberNodes => numberNodes - 1);
    };

    const removeRecurse = (root, value) => {
        if (tree[root].data === null) {
            setErrorMessage('Element does not exist in the tree.');
        } else if (value < tree[root].data) {
            removeRecurse(tree[root].left, value);
        } else if (value > tree[root].data){
            removeRecurse(tree[root].right, value);
        }
        else {
            // Even if current element matches value to remove, we have to check if that value exists
            // as right child element since we allow for duplicates.
            if (tree[tree[root].right].data != value) updateTreeIndexRemove(root);
            else removeRecurse(tree[root].right, value);
        }
    };

    const removeNode = () => {
        if (tree[0].data === null) {
            setErrorMessage('The tree is empty!');
            return;
        }
        else removeRecurse(0, removeValue);
    };


    return (
        <div>
            <Navbar/>
            <TestSandbox>
                <ListWrapper>
                    <Margin20>
                        {JSON.stringify(tree)}
                    </Margin20>
                </ListWrapper>
                <PadLeft100>
                    <form onSubmit={onInsertDown}>
                        <label>
                            <input type='text' value={inputValue} onChange={handleInputChange}></input> Input
                        </label>
                    </form>
                    <form onSubmit={onRemoveDown}>
                        <label>
                            <input type='text' value={removeValue} onChange={handleRemoveChange}></input> Remove
                        </label>
                    </form>
                    <p>Number of Nodes: {numberNodes}</p>
                    <p>{errorMessage}</p>
                </PadLeft100>
            </TestSandbox>
        </div>
    );
}

export default HackAnimation;