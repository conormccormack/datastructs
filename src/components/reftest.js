import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import '../css/bst.css';
import styled from 'styled-components';
import RefNode from './refnode';
import { TransitionGroup } from 'react-transition-group';

const TreeContainer = styled.div`
    margin-left: 60px;
    display: flex;
    justify-content: center;
`

const PageContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    background: #EFE7E2;
`

const ControlContainer = styled.div`   
`

class Node {
    constructor (value, level, id){
        this.value = value;
        this.left = null;
        this.right = null;
        this.level = level;
        this.parent = null;
        this.id = id;
        this.line = null;
        this.isNew = true;
        this.show = false;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }
    updateLevels(root, level){
        root.level = level;
        if (root.right !== null) this.updateLevels(root.right, level + 1);
        if (root.left !== null) this.updateLevels(root.left, level + 1 );
    }
    getTreeHeight(node, total){ 
        const left = node.left !== null ? this.getTreeHeight(node.left, total) + 1 : 0;
        const right = node.right !== null ? this.getTreeHeight(node.right, total) + 1 : 0;
        return total + Math.max(left, right);
    }
    
    getInOrderArray(node, array){
        if (!node) return [];
        if (node.left !== null) this.getInOrderArray (node.left, array);
        array.push(node);
        if (node.right !== null) this.getInOrderArray (node.right, array);
        return array;
    }

    subTreeSize(node){
        if (node === null) return 0;     
        const left = node.left ? this.subTreeSize(node.left) : 0;
        const right = node.right ? this.subTreeSize(node.right) : 0;
        return left + right + 1;
    }

    insert(value, count) {
        var newNode = new Node (value, 0, count);
        if (this.root === null) {
            this.root = newNode;
        }
        else { 
            newNode.level += 1;
            this.insertNode(this.root, newNode);
        }
        newNode.show = true;
        return newNode;
    }

    insertNode(root, newNode){  
        if (newNode.value < root.value){
            if (root.left !== null) {
                newNode.level = newNode.level + 1;
                this.insertNode(root.left, newNode);
            } else { 
                root.left = newNode; 
                newNode.parent = root;
            }
        } else if (newNode.value >= root.value){
            if (root.right !== null) {
                newNode.level = newNode.level + 1;
                this.insertNode(root.right, newNode);
            } else { 
                root.right = newNode; 
                newNode.parent = root;
            }
        }
    }

    removeRecurse(root, value){
        if (root === null) {
            return false;
        } else if (value < root.value) {
            return this.removeRecurse(root.left, value);
        } else if (value > root.value) {
            return this.removeRecurse(root.right, value);
        } else {
            this.deleteNode(root);
            return true;
        }  
    }

    deleteNode(node){
        console.log(`Deleting node of key ${node.value}`)
        let child_of_type = (node.parent !== null) ? (node.parent.right === node) ? 'right' : 'left' : 'root';
        let replacement = (node.left === null && node.right === null) ? null : (node.left === null) ? node.right : node.left;
        if (node.left !== null && node.right !== null){
            const swap = this.findLeftmost(node.right);
            this.deleteNode(swap);
        } else {
            if (child_of_type !== 'root') {}
            else if (replacement) {}

            if (child_of_type === 'right') node.parent.right = replacement;
            else if (child_of_type === 'left') node.parent.left = replacement;
            else this.root = replacement;
            if (replacement) replacement.parent = node.parent;
        }

        if (this.root) this.updateLevels(this.root, 0);
    }

    findLeftmost(root){
        return root.left === null ? root : this.findLeftmost(root.left);
    }
}

/* 
** It's important to separate animations that insert/delete from tree since
** we need to first animate removing nodes before they are allowed to leave the DOM.

** First, we handle actually inserting/removing the data from the data structure.
** Then, insert/removeCount are changed, calling the corresponding useEffect hook.
*/

const Reftree = React.memo(() => {
    const nodeRef = useRef([]);
    const bst = useRef(new BinarySearchTree());
    const [ nodeData, setNodeData ] = useState([]);
    
    const [ removeCount, setRemoveCount ] = useState(0);
    const [ insertCount, setInsertCount ] = useState(0);
    const [ count, setCount ] = useState(0);
    
    const [ height, setHeight ] = useState(-1);

    const [ inputValue, setInputValue ] = useState('');
    const [ removeValue, setRemoveValue ] = useState('');
    const [ message, setMessage ] = useState('');

    const HORIZONTAL_SPACING = 50;
    const VERTICAL_SPACING = 80;
    //const NODE_RADIUS = 30;

    // useEffect(() => {        
    //     console.log('Insert count useEffect()...')
    //     if (bst.current.root === null) return;
    //     setHeight(bst.current.getTreeHeight(bst.current.root, 0));
    //     console.log(nodeData, nodeRef);
        // for (let i = 0; i < nodeData.length; i++){
        //     gsap.to(
        //         nodeRef.current[i],
        //         .5,
        //         { delay: nodeData[i].isNew ? .4 : 0, y: (nodeData[i].level) * VERTICAL_SPACING , x: HORIZONTAL_SPACING * i - (bst.current.subTreeSize(bst.current.root.left) * HORIZONTAL_SPACING)},
        //     );
        //     if (nodeData[i].isNew){
        //         gsap.from(
        //             nodeRef.current[i],
        //             .4,
        //             { scale: 0, ease: 'back.out(2)'},
        //         )
        //         nodeData[i].isNew = false;  
        //     }
        // }

    // }, [ insertCount, nodeData ])

    const handleInputSubmit = (e) => {
        e.preventDefault();
        if (inputValue !== '' && !isNaN(inputValue)) {
            bst.current.insert(parseFloat(inputValue), insertCount);
            setNodeData(bst.current.getInOrderArray(bst.current.root, []));
            setInsertCount(insertCount + 1);
            setCount(count + 1);
            setMessage(`${inputValue} inserted into the tree.`);
        } else {
            setMessage('Please enter a number (e.g. 32, 2.7).')
        }
        setInputValue('');
    }

    useEffect(() => {
        setNodeData(nodeData => bst.current.getInOrderArray(bst.current.root, []));
    }, [removeCount] )

    // useEffect(() => {
    //     console.log(bst.current);
    //     console.log({nodeData});
    //     console.log({nodeRef});
    //     for (let i = 0; i < nodeData.length; i++){
    //         gsap.to(
    //             nodeRef.current[i],
    //             .5,
    //             { delay: nodeData[i].isNew ? .4 : 0, y: (nodeData[i].level) * VERTICAL_SPACING , x: HORIZONTAL_SPACING * i - (bst.current.subTreeSize(bst.current.root.left) * HORIZONTAL_SPACING)},
    //         );
    //         // if (nodeData[i].isNew){
    //         //     gsap.from(
    //         //         nodeRef.current[i],
    //         //         .4,
    //         //         { scale: 0, ease: 'back.out(2)'},
    //         //    )
    //         //     nodeData[i].isNew = false;  
    //         // }
    //     }
    // }, [ removeCount, nodeData ] )

   const handleRemoveSubmit = (e) => {
        e.preventDefault();
        if (removeValue !== '' && !isNaN(removeValue)) {
            const success = bst.current.removeRecurse(bst.current.root, parseFloat(removeValue));
            if (success){
                setMessage(`${removeValue} removed from the tree.`);
                setRemoveCount(removeCount + 1);
                setCount(count - 1);
            } else {
                bst.current.root == null ? setMessage('Tree is empty.') : setMessage(`${removeValue} not in the tree.`)
            }
        } else {
            setMessage('Please enter a number (e.g. 32, 2.7).');
        }
        setRemoveValue('');
    }

    return (
        <PageContainer>
            <TreeContainer>
                <TransitionGroup>
                    {nodeData.map( (node, i ) =>{
                        console.log({nodeData, nodeRef})
                        return(<RefNode key={node.id} node={node} ref={el => nodeRef.current.includes(el) ? nodeRef.current[nodeRef.current.indexOf(el)] = el : nodeRef.current[i] = el}/>);
})}
                </TransitionGroup>
            </TreeContainer>
            <ControlContainer>
                <form onSubmit={handleInputSubmit}>
                    <input type='text' value={inputValue} placeholder='36' onChange={e => { setInputValue(e.target.value) } }/>
                </form>
                <form onSubmit={handleRemoveSubmit}>
                    <input type='text' value={removeValue} placeholder='72' onChange={e => { setRemoveValue(e.target.value) } }/>
                </form>
                <div>Count: <strong>{count}</strong></div>
                <div>Height: <strong>{bst.current.root ? height + 1 : 0}</strong></div>
                <div>{message}</div>
            </ControlContainer>
        </PageContainer>
    );

});



export default Reftree;

