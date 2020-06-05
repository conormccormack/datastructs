import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {AnimatePresence, motion} from 'framer-motion';
import Navbar from './navbar';
import PageHeadline from './PageHeadline';
import RelatedPagesCard from "./relatedpagescard";
import BinaryTree from "./binarytree";
import BSTNode from './bstnode';
import animejs from "animejs";

const TestSandbox = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
    grid-template-columns: 1fr 1fr;
    display: grid;
`

const PadLeft6rem = styled.div`
    padding-left: 6rem;
`


const PadLeft100 = styled.div`
    padding-left: 100px;
`

function HackAnimation(){
    const [numberNodes, setNumberNodes] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [removeValue, setRemoveValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [height, setHeight] = useState(0);
    const [displayNodes, setDisplayNodes] = useState([]);
    const [count, setCount] = useState(0);
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
        setHeight(depth);
        updateDisplay();
    },[tree]);

    const insertRecurse = (root, value) => {
        if (parseInt(value, 10) < parseInt(tree[root].data, 10)) {
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
        setCount(count => count + 1);
        setErrorMessage(`Inserting ${inputValue}`);
        if (tree[0].data === null) {
            updateTreeIndexInsert(0, inputValue);
        } else insertRecurse(0, inputValue);
        setHeight(recursiveMaxDepth(0,0));
        updateDisplay();
    };

    const handleInputChange = event => setInputValue(event.target.value);

    const onInsertDown = event => {
        event.preventDefault();
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
        updateDisplay();
    };

    // For every element in subtree, shift up one level
    const shiftRecurse = (root, basis) => {
        // Base case: do not shift subtree if it does not exist.
        if (tree[root].data === null) return;
        const level = tree[root].level;
        // If not 0th level, shift.
        if (level !== 0) {
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
        } else if (parseInt(value, 10) < parseInt(tree[root].data, 10)) {
            removeRecurse(tree[root].left, value);
        } else if (parseInt(value, 10) > parseInt(tree[root].data, 10)){
            removeRecurse(tree[root].right, value);
        }
        else {
            // Even if current element matches value to remove, we have to check if that value exists
            // as right child element since we allow for duplicates.
            if (tree[tree[root].right].data !== value) updateTreeIndexRemove(root);
            else removeRecurse(tree[root].right, value);
        }
    };

    // Compute left-right zero based index of id on its level in the tree.
    const computeIndexOnLevel = (id, level) => (id + 1 - Math.pow(2,level));

    const updateDisplay = (BST) => {
        setDisplayNodes(tree.filter(node => node.data !== null).map((node, index) => {
            const indexOnLevel = computeIndexOnLevel(node.id, node.level);
            const shift = indexOnLevel % 2 === 0 ? indexOnLevel*(-20) : indexOnLevel * 20;
            return (
                <motion.div key={index} className="bstnode" style={{float: 'left'}} exit={{ scale: 0}} initial={{ scale: 0}}
                animate={{ scale: 1}} whileHover={{scale: 1.25}}>
                    {node.data}
                </motion.div>
                //<BSTNode key={count} data={node.data} shift={shift}/>
            )
        }
        ));
    };

    const removeNode = () => {
        if (tree[0].data === null) setErrorMessage('The tree is empty!');
        else removeRecurse(0, removeValue);
        setHeight(recursiveMaxDepth(0,0));
    };

    return (
        <motion.div exit={{}}>
            <Navbar/>
            <PageHeadline text={'Binary Search Trees'} />
            <TestSandbox>
                <PadLeft6rem>
                <BinaryTree BST={tree} displayNodes={displayNodes} height={height}/>
                </PadLeft6rem>
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
                    { numberNodes > 0 && <p>Tree Height: {height + 1}</p>}
                    <p>{errorMessage}</p>
                </PadLeft100>
            </TestSandbox>
        </motion.div>
    );
}

export default HackAnimation;