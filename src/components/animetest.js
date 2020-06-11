/* Summary:
*  The following is a React component that will never update after it has mounted.
*  This allows for the use of Vanilla JavaScript to directly manipulate the DOM.
*  The binary tree is initialized as part of the component state so that the component
*  can readily access the tree data. The tree is maintained by Vanilla JavaScript, however,
*  and is animated using Anime.js.
*
*  The animation is implemented as an Anime timeline, which is built with an
*  in-order traversal of the nodes of the tree followed by its edges. The X position
*  of each node and its edges is based on size of the container and the immediate 
*  successors of each node. There is a fixed distance between each node and its predecessor,
*  defined by HORIZONTAL_SPACING. Somewhat similarly, each level of the tree is seperated
*  by the VERTICAL_SPACING constant. 
*/

import React, { Component } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import styled from 'styled-components';

const PageWrapper = styled.div`
    padding-left: 6rem;
    padding-right: 6rem;
    padding-top: 2rem;
    height: 80vh;
    display: grid;
    grid-template-columns: 2fr 1fr;
`
const Controls = styled.div`
    margin-left: auto;
`
const NodeContainer = styled.div`
    height: 100%;
    width: 100%
`

const HORIZONTAL_SPACING = 40;
const NODE_RADIUS = 30;
const VERTICAL_SPACING = 70;
let TRAVERSE_DURATION = 500;
let shift_x_total;
/* Map which stores the next x position of each node. Used to calculate
** where points of edges should move before the animation is executed */
let x_distances = new Map();
let resizeTimer;
let traverseCount = 0;
let numActiveNodes = 0;
let traverseOn = false;

// Class for implemented Undo and Redo stack.
class TreeStack {
    constructor(){
        this.trees = [];
    }
    push(tree){ 
        const copy = Object.assign({}, tree);
        this.trees.push(copy);
    }
    pop(){
        return this.trees.pop();
    }
    peek(){
        return this.trees[this.trees.length - 1];
    }
    isEmpty(){
        return this.trees.length === 0;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.heights = new Map();
    }
    updateHeights(leaf) {
        const leftHeight = leaf.left !== null ? this.heights.get(leaf.left.id) : -1;
        const rightHeight = leaf.right !== null ? this.heights.get(leaf.right.id) : -1;
        this.heights.set(leaf.id, 1 + Math.max(leftHeight, rightHeight));
        if (leaf.parent !== null) this.updateHeights(leaf.parent);
    }

    updateLevels(root, level){
        root.level = level;
        if (root.right !== null) this.updateLevels(root.right, level + 1);
        if (root.left !== null) this.updateLevels(root.left, level + 1 );
    }

    copy(){
        let bstCopy = new BinarySearchTree();
        this.copyRecurse(bstCopy.root, this.root);
        return bstCopy;
    }

    copyRecurse(newRoot, ogRoot) {
        const leftNode = ogRoot.left !== null ? ogRoot.left : null;
        const rightNode = ogRoot.right !== null ? ogRoot.right : null;
        if (leftNode) newRoot.left = leftNode;
        if (rightNode) newRoot.right = rightNode;
    }

    // Insert node into tree and update heights map.
    insert(value, count) {
        var newNode = new Node (value, 0, count);
        if (this.root === null) {
            this.root = newNode;
            addMessageToLog(`Inserting ${value} as root.`, 'end');
        }
        else { 
            newNode.level += 1;
            this.insertNode(this.root, newNode);
        }
        this.updateHeights(newNode);
        return newNode;
    }

    insertNode(root, newNode){  
        if (traverseOn) addTraverseStep(root);
        addMessageToLog(`Comparing ${newNode.value} to ${root.value}...`);
        if (newNode.value < root.value){
            if (root.left !== null) {
                newNode.level = newNode.level + 1;
                addMessageToLog(`${newNode.value} < ${root.value}, search left.`);
                this.insertNode(root.left, newNode);
            }
            else { 
                root.left = newNode; 
                newNode.parent = root;
                addMessageToLog(`${newNode.value} < ${root.value}, insert as leaf.`, 'end');
            }
        } else if (newNode.value >= root.value){
            if (root.right !== null) {
                newNode.level = newNode.level + 1;
                addMessageToLog(`${newNode.value} >= ${root.value}, search right.`);
                this.insertNode(root.right, newNode);
            }
            else { 
                root.right = newNode; 
                newNode.parent = root;
                addMessageToLog(`${newNode.value} >= ${root.value}, insert as leaf.`, 'end');
            }
        }
    }

    removeRecurse(root, value){
        if (root === null) {
            setErrorMessage(`${value} is not in the tree!`);
            return false;
        }
        else if (value < root.value) this.removeRecurse(root.left, value);
        else if (value > root.value) this.removeRecurse(root.right, value);
        else {
            if (root.right !== null){
                if (root.right.value !== value) this.deleteNode(root);
                else this.removeRecurse(root.right, value);
            } else {
                this.deleteNode(root);
                setErrorMessage('');
            }
        }
        return true;
    }

    /* 3 cases:
    1. No children (leaf). Delete from tree.  
    2. One child. Left or right. Delete and fill in with child.
    3. Two children. Find and replace with successor. Delete where successor lies.
    */
    deleteNode(node){
        let removeNodeID = `node${node.id}`;
        if (node.left === null && node.right === null){
            if (node.parent !== null){
                node.parent.left = node.parent.left === node ? null : node.parent.left;
                node.parent.right = node.parent.right === node ? null: node.parent.right;
                removeElementFromDOM(`path${node.id}`);
            } else {
                this.root = null;
            }
            removeElementFromDOM(removeNodeID);
        } else if (node.left === null) {
            if (node.parent !== null){
                node.parent.left = node.parent.left === node ? node.right : node.parent.left;
                node.parent.right = node.parent.right === node ? node.right : node.parent.right;
                node.right.parent = node.parent;
                this.updateLevels(this.root, 0);
                removeElementFromDOM(`path${node.id}`);
            } else {
                this.root = node.right;
                node.right.parent = null;
                this.updateLevels(this.root, 0);
                removeElementFromDOM(`path${node.right.id}`);
            }
            removeElementFromDOM(removeNodeID);
        } else if (node.right === null){
            if (node.parent !== null){
                node.parent.left = node.parent.left === node ? node.left : node.parent.left;
                node.parent.right = node.parent.right === node ? node.left : node.parent.right;
                node.left.parent = node.parent;
                this.updateLevels(this.root, 0);
                removeElementFromDOM(`path${node.id}`);
            } else {
                this.root = node.left;
                node.left.parent = null;
                this.updateLevels(this.root, 0);
                removeElementFromDOM(`path${node.left.id}`);
            }
            removeElementFromDOM(removeNodeID);
        } else {
            const swap = this.findLeftmost(node.right);
            node.value = swap.value;
            anime({
                targets: document.getElementById(`node${node.id}`),
                innerHTML: node.value,
                easing: 'easeOutCubic',
                round: 1,
                duration: 500,
            })
            this.deleteNode(swap);
        }
    }

    findLeftmost(root){
        return root.left === null ? root : this.findLeftmost(root.left);
    }
}

class Node {
    constructor (value, level, id){
        this.value = value;
        this.left = null;
        this.right = null;
        this.level = level;
        this.parent = null;
        this.id = id;
        this.line = null;
    }
}

function addTraverseStep(node){
    formatTimeline.add({
        targets: `#node${node.id}`,
        keyframes: [
            { scale: 1.05, translateX: `-=${NODE_RADIUS}`, translateY: `-=${NODE_RADIUS*.05}`},
            { scale: 1, translateX: `+=${NODE_RADIUS}`, translateY: `+=${NODE_RADIUS*.05}`},
        ],
        easing: 'easeInOutBack',
        duration: TRAVERSE_DURATION,
    }, traverseCount * TRAVERSE_DURATION);
    formatTimeline.add({
        targets: `#frontnode${node.id}`,
        keyframes: [
            { background: '#3C5B6F' },
            { background: ' ' },
        ],
        easing: 'easeInOutBack',
        duration: TRAVERSE_DURATION,
    }, traverseCount * TRAVERSE_DURATION);
    if (node.parent !== null) {
        formatTimeline.add({
            targets: `#path${node.id}`,
            keyframes: [
                { stroke: '#3C5B6F' },
                { stroke: '#DEAAFF' },
            ],
            duration: TRAVERSE_DURATION,
            easing: 'easeInOutBack',
        }, traverseCount * TRAVERSE_DURATION - (TRAVERSE_DURATION/2));
    }
    traverseCount += 1;
}

function removeElementFromDOM(id) {    
    var toRemove = document.getElementById(id);
    console.log(id);
    if (id === null) return;
    anime({
        targets: toRemove,
        opacity: 0,
        duration: 600,
        easing: 'easeOutExpo',
        delay: id.includes('line') ? 150 : 0,
        complete: function(anim){
            toRemove.remove();
        },
    });
}

function addNodeToDOM(value, count) {
    let node = document.createElement("div");
    node.classList.add('bstnode')
    node.setAttribute('id', `node${count}`);
    node.setAttribute('style', `float: left;`);
    let frontHighlight = document.createElement('div');
    frontHighlight.classList.add('front-node');
    frontHighlight.setAttribute('id', `frontnode${count}`);
    let text = document.createTextNode(value);
    frontHighlight.appendChild(text);
    node.appendChild(frontHighlight);
    document.getElementById("nodecontainer").appendChild(node);
}

// Given an element selector, return the pixel midpoint of its width dimension.
function getWidthMidpoint(selector) {
    return (selector.getBoundingClientRect().width / 2);
}

// Returns length of in-order traversal from smallest element to root.
function inOrderToRootLength(root){
    if (root === null) return 0;     
    const left = root.left ? inOrderToRootLength(root.left) : 0;
    const right = root.right ? inOrderToRootLength(root.right) : 0;
    return left + right + 1;
}

let formatTimeline = anime.timeline({
    autoplay: false,
    complete: toggleFormDisable,
});

function addMessageToLog(message, options){
    let p = document.createElement('div');
    p.setAttribute('class', 'log')
    p.classList.add('log')
    if (options) {
        if (options === 'end') p.classList.add('log-border-bottom');
    }
    p.appendChild(document.createTextNode(message));
    let logs = document.getElementById('logs');
    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;
}

function setErrorMessage(message){
    document.getElementById('error-message').innerHTML = message;
}

function formatBinaryTree(root){
    buildNodeTimeline(root);
    buildEdgeTimeline(root);
    formatTimeline.play();
    formatTimeline = anime.timeline({
        complete: toggleFormDisable,
    });
    traverseCount = 0;
}

function buildEdgeTimeline(root){
    if (root.left !== null) buildEdgeTimeline(root.left);
    if (root.parent !== null){
        const x1 = x_distances.get(`node${root.parent.id}`); 
        const y1 = root.parent.level * VERTICAL_SPACING + NODE_RADIUS;
        const x2 = x_distances.get(`node${root.id}`);
        const y2 = root.level * VERTICAL_SPACING + NODE_RADIUS;
        formatTimeline.add({
            targets: `#path${root.id}`,
            d: `M ${x1}, ${y1} L ${x2}, ${y2}`,
            opacity: { value: '1.0', easing: 'easeInSine', delay: 600, duration: 600 },
            stroke: { value: '#DEAAFF', delay: 800 },
            easing: 'easeInOutExpo',
        }, traverseCount * TRAVERSE_DURATION);
    }
    if (root.right !== null) buildEdgeTimeline(root.right);
}

function buildNodeTimeline(root){
    if (root.left !== null) buildNodeTimeline(root.left);
    const node = document.getElementById(`node${root.id}`);
    const x = shift_x_total - NODE_RADIUS;
    const isNew = root.parent !== null && root.line === null ? true : false;
    x_distances.set(`node${root.id}`, x );
    root.parent !== null && root.line === null && addPathToDom(root);
    root.line = root.line === null && `line${root.id}`;
    formatTimeline.add({
        targets: `#node${root.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { scale: isNew ? 0 : 1, duration: 0 },
            { translateX: isNew ? 0 : shift_x_total, translateY: root.level * VERTICAL_SPACING,  scale: 1, duration: 800 },
            { translateX: shift_x_total, translateY: root.level * VERTICAL_SPACING, delay: 200, duration: 800 }
        ],
        easing: 'easeInOutExpo',
    }, traverseCount * TRAVERSE_DURATION);
    
    shift_x_total += HORIZONTAL_SPACING;

    if (root.right !== null) buildNodeTimeline(root.right);
}

// Given child node, create path from child to parent, add to DOM.
function addPathToDom(child){
    if (child.parent === null) return;
    let svg = document.getElementById('svg-line');
    const parent_selector = document.getElementById(`node${child.parent.id}`);
    const child_selector = document.getElementById(`node${child.id}`);
    const container = document.getElementById(`nodecontainer`);

    const x1 = (parent_selector.getBoundingClientRect().x + parent_selector.getBoundingClientRect().right)/2 - container.getBoundingClientRect().x;
    const y1 =  parent_selector.getBoundingClientRect().bottom - container.getBoundingClientRect().y - NODE_RADIUS;
    const x2 = (child_selector.getBoundingClientRect().x + child_selector.getBoundingClientRect().right)/2 - container.getBoundingClientRect().x;
    const y2 = child_selector.getBoundingClientRect().y - container.getBoundingClientRect().y + NODE_RADIUS;

    let path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('id', `path${child.id}`);
    path.setAttribute('d', `M ${x1}, ${y1} L ${x2}, ${y2} `);
    path.setAttribute('stroke', '#3C5B6F');
    path.setAttribute('stroke-width', '3px');
    path.setAttribute('opacity', '0.0');
    svg.appendChild(path);
}

function toggleFormDisable(){
    document.getElementById('input-field').disabled =  !document.getElementById('input-field').disabled;
    document.getElementById('remove-field').disabled = !document.getElementById('remove-field').disabled;
}

function clearInputForm() {
    document.getElementById('input-form').reset();
    document.getElementById('input-field').value = '';
}

function clearRemoveForm() {
    document.getElementById('remove-form').reset();
    document.getElementById('remove-field').value = '';
}

function updateActiveNodeCount(){
    document.getElementById('active-node-count').innerHTML = `Number of Nodes: ${numActiveNodes}`;
}

class AnimeTest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inputValue: '',
            removeValue: '',
            bst: new BinarySearchTree(),
            undoStack: [],
            redoStack: new TreeStack(),
            count: 0,
        };
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRemoveChange = this.handleRemoveChange.bind(this);
        this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this); 
        this.onResize = this.onResize.bind(this);
    }

    handleInputChange(event) {
        this.setState({ inputValue: parseFloat(event.target.value) });
    }

    handleRemoveChange(event) {
        this.setState({ removeValue: parseFloat(event.target.value) });
    }

    handleInputSubmit(event) {
        event.preventDefault();
        if (this.state.inputValue === '' || isNaN(this.state.inputValue)) {
            setErrorMessage('<p>Please enter an number (e.g. 32, 2.7).<p>')
            return;
        }
        setErrorMessage('');
        const nodeContainer = document.getElementById('nodecontainer');
        this.state.bst.insert(this.state.inputValue, this.state.count);
        addNodeToDOM(this.state.inputValue, this.state.count);
        shift_x_total = Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left) * HORIZONTAL_SPACING);
        formatBinaryTree(this.state.bst.root);
        this.setState({ count: this.state.count + 1, inputValue: '' });
        numActiveNodes += 1;
        clearInputForm();
        updateActiveNodeCount();
    }

    // TODO: Implement Remove functionality.
    handleRemoveSubmit(event) {
        event.preventDefault();
        if (this.state.removeValue === '' || isNaN(this.state.removeValue)) {
            setErrorMessage('<p>Please enter an number (e.g. 32, 2.7).<p>');
            return;
        }
        const nodeContainer = document.getElementById('nodecontainer');
        const success = this.state.bst.removeRecurse(this.state.bst.root, this.state.removeValue);
        if (success) numActiveNodes -= 1;
        if (this.state.bst.root !== null) {
            shift_x_total = Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left) * HORIZONTAL_SPACING);
            formatBinaryTree(this.state.bst.root);
        };
        clearRemoveForm();
        updateActiveNodeCount();
    }

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        window.addEventListener('resize', this.onResize);
        const nodeContainer = document.getElementById('nodecontainer');
        shift_x_total = getWidthMidpoint(nodeContainer);
    }
    
    toggleTraverseOn(){
        traverseOn = !traverseOn;
    }

    handleIntervalChange(event){
        TRAVERSE_DURATION = event.target.value;
    }

    onResize(){
        if (this.state.bst.root === null) return;
        clearTimeout(resizeTimer);
        const nodeContainer = document.getElementById('nodecontainer');
        shift_x_total = Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left, 0) * HORIZONTAL_SPACING);
        resizeTimer = setTimeout(formatBinaryTree(this.state.bst.root), 3000 );
    }

    render(){ 
        return(
            <PageWrapper id="pagewrapper">
                <div>
                    <NodeContainer id="nodecontainer" >
                    <svg class="linecontainer" id="svg-line" />                    
                    </NodeContainer>
                </div>
                <div>
                    <Controls>
                        <form id='input-form' onSubmit={this.handleInputSubmit} className='controlForm'>
                            <label>
                                <input type="number" id="input-field" onChange={this.handleInputChange}/> 
                                <button onClick={this.handleInputSubmit} className='inputButton'>Input</button>
                            </label>
                        </form>
                        <form id='remove-form' onSubmit={this.handleRemoveSubmit} className='controlForm'>
                            <label>
                                <input type="number" id="remove-field" onChange={this.handleRemoveChange}/> 
                                <button onClick={this.handleRemoveSubmit} className='removeButton'>Remove</button>
                            </label>
                        </form>
                        <label>
                            <input type='checkbox' id='traverse-checkbox' onChange={this.toggleTraverseOn}/>
                            Animate traversal
                        </label>
                        <label>
                            <input type='range' min='300' max='1200' id='traverse-interval-slider' onChange={this.handleIntervalChange}/>
                        </label>
                    </Controls>
                    <div id='logs'/>
                    <div id='active-node-count'/>
                    <div id='error-message'/>
                </div>
            </PageWrapper>
        );
    }
}

export default AnimeTest;