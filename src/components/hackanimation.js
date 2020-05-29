import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from './navbar';
import PageHeadline from './PageHeadline';
import {parse, stringify} from "query-string";

const TestSandbox = styled.div`
    height: 3900vh;
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
    const [treeUpdated, setTreeUpdated] = useState(true);
    const [height, setHeight] = useState(-1);
    const [displayNodes, setDisplayNodes] = useState([]);
    const [tree, setTree] = useState([...Array(2049)].map((x, index) => {
        const parentId = index > 0 ? Math.floor((index-1)/2) : null;
        const level = Math.floor(Math.log2(index + 1));
        return {data: null, id: index, level: level, parent: parentId, left: index * 2 + 1, right: index * 2 + 2 }
    }));

    const updateTreeIndexInsert = (index, value) =>{
        setTree(tree.map(node => node.id === index ? {...node, data: value} : node));
    };

    const recursiveMaxDepth = (max, root) => {
        if (tree[root].data === null) return max;
        max = tree[root].level > max ? tree[root].level : max;
        return Math.max(max, recursiveMaxDepth(max, tree[root].left), recursiveMaxDepth(max, tree[root].right));
    };

    useEffect(() => {
        const depth = recursiveMaxDepth(0, 0);
        setHeight(depth + 1);
    },[tree]);

    const insertRecurse = (root, value) => {
        if (parseInt(value) < parseInt(tree[root].data)) {
            // Base case: insert new value as leaf node
            if (tree[tree[root].left].data === null) updateTreeIndexInsert(tree[root].left, value);
            else insertRecurse(tree[root].left, value);
        } else {
            // Base case: insert new value as leaf node
            if (tree[tree[root].right].data === null) updateTreeIndexInsert(tree[root].right, value);
            else insertRecurse(tree[root].right, value);
        }
    };

    const insertNode = () => {
        setErrorMessage(`Inserting ${inputValue}`);
        if (tree[0].data === null) {
            updateTreeIndexInsert(0, inputValue);
        } else insertRecurse(0, inputValue);
        setHeight(recursiveMaxDepth(0,0) + 1);
    };

    const handleInputChange = event => setInputValue(event.target.value);

    const onInsertDown = event => {
        event.preventDefault();
        setTreeUpdated(false);
        if (inputValue.trim() === '') return;
        if (isNaN(inputValue)) {
            setErrorMessage(`Please enter a number (e.g. 27, 3.2)`);
            return;
        }
        insertNode();
        setInputValue('');
        setNumberNodes(numberNodes => numberNodes + 1);
    };

    const handleRemoveChange = event => setRemoveValue(event.target.value);

    const onRemoveDown = event => {
        event.preventDefault();
        if (removeValue.trim() === '') return;
        if (isNaN(removeValue)) {
                setErrorMessage(`Please enter a number (e.g. 27, 3.2)`);
                return;
        }
        removeNode();
        setRemoveValue('');
    };

    // For every element in subtree, shift up one level
    const shiftRecurse = (root, basis) => {
        // Base case: do not shift subtree if it does not exist.
        if (tree[root].data === null) return;
        const level = tree[root].level;
        // If not 0th level, shift.
        if (level !== 0) {
            // const newData = tree[root].data;
            // const reWrite = root - basis;
            // setTree(tree.map(node => node.id == reWrite && {...node, data: newData}));
            // setTree(tree.map(node => node.id == root ? {...node, data: null} : node ));
            tree[root - basis].data = tree[root].data;
            tree[root].data = null;
        }
        // shift children by basis * 2.
        shiftRecurse(tree[root].left, basis * 2);
        shiftRecurse(tree[root].right, basis * 2);
    };

    const updateTreeIndexRemove = (root) => {
        setErrorMessage(`Removing ${removeValue}`);
        const left = tree[root].left;
        const right = tree[root].right;
        if (tree[left].data === null && tree[right].data === null){
            setTree(tree.map(node => node.id === root ? {...node, data: null} : node));
        } else if (tree[left].data === null){
            shiftRecurse(right, tree[right].id - tree[root].id);
        } else if (tree[right].data === null) {
            shiftRecurse(left, tree[left].id - tree[root].id);
        } else {
            const successor = findMin(right);
            tree[root].data = tree[successor].data;
            if (tree[tree[successor].right].data !== null){
                shiftRecurse(tree[successor].right, tree[tree[successor].right].id - successor);
            } else tree[successor].data = null;
        }
        setNumberNodes(numberNodes => numberNodes - 1);
    };

    const findMin = (root) => {
        if (tree[tree[root].left].data !== null) return findMin(tree[root].left);
        else return root;
    };

    const removeRecurse = (root, value) => {
        if (tree[root].data === null) {
            setErrorMessage('Element does not exist in the tree.');
        } else if (parseInt(value) < parseInt(tree[root].data)) {
            removeRecurse(tree[root].left, value);
        } else if (parseInt(value) > parseInt(tree[root].data)){
            removeRecurse(tree[root].right, value);
        }
        else {
            // Even if current element matches value to remove, we have to check if that value exists
            // as right child element since we allow for duplicates.
            if (tree[tree[root].right].data !== value) updateTreeIndexRemove(root);
            else removeRecurse(tree[root].right, value);
        }
    };

    const removeNode = () => {
        if (tree[0].data === null) setErrorMessage('The tree is empty!');
        else removeRecurse(0, removeValue);
        setHeight(recursiveMaxDepth(0,0) + 1);
    };


    return (
        <div>
            <Navbar/>
            <PageHeadline text={'Binary Search Trees'} />
            <TestSandbox>
                <ListWrapper>
                    {JSON.stringify(tree)}
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
                    { numberNodes > 0 && <p>Tree Height: {height}</p>}
                    <p>{errorMessage}</p>
                </PadLeft100>
            </TestSandbox>
        </div>
    );
}

export default HackAnimation;