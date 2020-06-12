/* Summary:
*  The following is a React component that will never update after it has mounted.
*  This allows for the use of vanilla JavaScript to directly manipulate the DOM.
*  The binary tree is initialized as part of the component state so that the component
*  can readily access the tree data. The tree is maintained with vanilla JavaScript, however,
*  and is animated using Anime.js.
*
*  The animation is implemented as an Anime timeline, which is built with an
*  in-order traversal of the nodes of the tree followed by its edges. The X position
*  of each node and its edges is based on size of the container and the immediate 
*  successors of each node. There is a fixed distance between each node and its pecessor,
*  defined by HORIZONTAL_SPACING. Somewhat similarly, each level of the tree is seperated
*  by the VERTICAL_SPACING constant. 
*/

import React, { Component } from 'react';
import anime, { random } from 'animejs';
import '../css/bst.css';
import styled from 'styled-components';
import { getByDisplayValue } from '@testing-library/react';

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
let shift_x;
let resizeTimer;
let traverseCount = 0;
let traverseOn = true;
let allowDuplicate = false; 

let formatTimeline = anime.timeline({
    autoplay: false,
    complete: toggleFormDisable,
});

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

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.heights = new Map();
        this.numActiveNodes = 0;
        /* Map which stores the next x position of each node. Used to calculate
        ** where points of edges should move before the animation is executed */
        this.x_distances = new Map();
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
    getTreeHeight(){ return Math.max(...this.heights.values()) }

    // Insert node into tree and update heights map.
    insert(value, count) {
        var newNode = new Node (value, 0, count);
        if (this.root === null) {
            this.root = newNode;
            addMessageToLog(`Tree empty: inserting ${value} as root.`, 'end');
        }
        else { 
            newNode.level += 1;
            this.insertNode(this.root, newNode);
        }
        this.updateHeights(newNode);
        return newNode;
    }

    insertNode(root, newNode){  
        if (traverseOn) addTraverseStep(root, 0);
        if (newNode.value < root.value){
            if (root.left !== null) {
                newNode.level = newNode.level + 1;
                addMessageToLog(`${newNode.value} < ${root.value}, search left.`);
                this.insertNode(root.left, newNode);
            }
            else { 
                root.left = newNode; 
                newNode.parent = root;
                addMessageToLog(`${newNode.value} < ${root.value}, insert as left leaf.`, 'end');
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
                addMessageToLog(`${newNode.value} >= ${root.value}, insert as right leaf.`, 'end');
            }
        }
    }

    removeRecurse(root, value){
        if (root !== null && traverseOn) addTraverseStep(root, 0);
        if (root === null) {
            addMessageToLog(`${value} not found.`, 'end');
            setErrorMessage(`${value} is not in the tree!`);
            return false;
        } else if (value < root.value) {
            addMessageToLog(`${value} < ${root.value}, search left.`);
            return this.removeRecurse(root.left, value);
        } else if (value > root.value) {
            addMessageToLog(`${value} >= ${root.value}, search right.`);
            return this.removeRecurse(root.right, value);
        } else {
            this.deleteNode(root);
            addMessageToLog(`Found ${value}: removing ${value} from tree.`, 'end');
            setErrorMessage('');
            return true;
        }  
    }

    deleteNode(node){
        let child_of_type = (node.parent !== null) ? (node.parent.right === node) ? 'right' : 'left' : 'root';
        let replacement = (node.left === null && node.right === null) ? null : (node.left === null) ? node.right : node.left;

        if (node.left !== null && node.right !== null){
            const swap = this.findLeftmost(node.right);
            addTraverseStep(swap, -1);
            node.value = swap.value;
            formatTimeline.add({
                targets: document.getElementById(`frontnode${node.id}`),
                innerHTML: node.value,
                easing: 'easeOutCubic',
                round: 1,
                duration: 500,
            }, (traverseCount - 1) * TRAVERSE_DURATION)
            this.deleteNode(swap);
        } else {
            if (child_of_type !== 'root') removeElementFromDOM(`path${node.id}`);
            else if (replacement) removeElementFromDOM(`path${replacement.id}`);

            if (child_of_type === 'right') node.parent.right = replacement;
            else if (child_of_type === 'left') node.parent.left = replacement;
            else this.root = replacement;
            if (replacement) replacement.parent = node.parent;
            removeElementFromDOM(`node${node.id}`);
        }

        if (this.root) this.updateLevels(this.root, 0);
    }

    findLeftmost(root){
        return root.left === null ? root : this.findLeftmost(root.left);
    }
}

function addTraverseStep(node, shift_order){
    formatTimeline.add({
        targets: `#node${node.id}`,
        keyframes: [
            { scale: 1.05, translateX: `-=${NODE_RADIUS}`, translateY: `-=${NODE_RADIUS*.05}`},
            { scale: 1, translateX: `+=${NODE_RADIUS}`, translateY: `+=${NODE_RADIUS*.05}`},
        ],
        easing: 'easeInOutBack',
        duration: TRAVERSE_DURATION,
    }, (traverseCount + shift_order) * TRAVERSE_DURATION);
    formatTimeline.add({
        targets: `#frontnode${node.id}`,
        keyframes: [
            { background: '#3C5B6F' },
            { background: ' ' },
        ],
        easing: 'easeInOutBack',
        duration: TRAVERSE_DURATION,
    }, (traverseCount + shift_order) * TRAVERSE_DURATION);
    if (node.parent !== null && shift_order === 0) {
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
    if (id === null) return;
    formatTimeline.add({
        targets: toRemove,
        opacity: 0,
        duration: 600,
        easing: 'easeOutExpo',
        delay: id.includes('line') ? 150 : 0,
        complete: function(anim){
            toRemove.remove();
        },
    }, traverseCount * TRAVERSE_DURATION);
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
function size(root){
    if (root === null) return 0;     
    const left = root.left ? size(root.left) : 0;
    const right = root.right ? size(root.right) : 0;
    return left + right + 1;
}

function addMessageToLog(message, options){
    formatTimeline.add({
        duration: TRAVERSE_DURATION,
        begin: function (){
            let p = document.createElement('div');
            p.setAttribute('className', 'log')
            p.classList.add('log')
            if (options) {
                if (options === 'end') p.classList.add('log-border-bottom');
            }
            p.appendChild(document.createTextNode(message));
            let logs = document.getElementById('logs');
            logs.appendChild(p);
            logs.scrollTop = logs.scrollHeight;
        }
    }, traverseOn ? (traverseCount - 1) * TRAVERSE_DURATION : 0);
}

function setErrorMessage(message){
    document.getElementById('error-message').innerHTML = message;
}

function formatBinaryTree(tree){
    buildNodeTimeline(tree.root, tree);
    buildEdgeTimeline(tree.root, tree);
    formatTimeline.play();
    formatTimeline = anime.timeline({
        complete: toggleFormDisable,
    });
    traverseCount = 0;
}

function buildEdgeTimeline(root, tree){
    if (root.left !== null) buildEdgeTimeline(root.left, tree);
    if (root.parent !== null){
        const x1 = tree.x_distances.get(`node${root.parent.id}`); 
        const y1 = root.parent.level * VERTICAL_SPACING + NODE_RADIUS;
        const x2 = tree.x_distances.get(`node${root.id}`);
        const y2 = root.level * VERTICAL_SPACING + NODE_RADIUS;
        formatTimeline.add({
            targets: `#path${root.id}`,
            d: `M ${x1}, ${y1} L ${x2}, ${y2}`,
            opacity: { value: '1.0', easing: 'easeInSine', delay: 600, duration: 600 },
            stroke: { value: '#DEAAFF', delay: 800 },
            easing: 'easeInOutExpo',
        }, traverseCount * TRAVERSE_DURATION);
    }
    if (root.right !== null) buildEdgeTimeline(root.right, tree);
}

function buildNodeTimeline(root, tree){
    if (root.left !== null) buildNodeTimeline(root.left, tree);
    const node = document.getElementById(`node${root.id}`);
    const x = shift_x - NODE_RADIUS;
    const isNew = root.parent !== null && root.line === null ? true : false;
    tree.x_distances.set(`node${root.id}`, x );
    root.parent !== null && root.line === null && addPathToDom(root);
    root.line = root.line === null && `line${root.id}`;
    formatTimeline.add({
        targets: `#node${root.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { scale: isNew ? 0 : 1, duration: 0 },
            { translateX: isNew ? 0 : shift_x, translateY: root.level * VERTICAL_SPACING,  scale: 1, duration: 800 },
            { translateX: shift_x, translateY: root.level * VERTICAL_SPACING, delay: 200, duration: 800 }
        ],
        easing: 'easeInOutExpo',
    }, traverseCount * TRAVERSE_DURATION);
    
    shift_x += HORIZONTAL_SPACING;

    if (root.right !== null) buildNodeTimeline(root.right, tree);
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
    document.getElementById('input-button').disabled = !document.getElementById('input-button').disabled;
    document.getElementById('remove-button').disabled = !document.getElementById('remove-button').disabled;
}

// Box-Muller, returns number between [0, 1] w/ approx normal distribution
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

class AnimeTest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inputValue: '',
            removeValue: '',
            bst: new BinarySearchTree(),
            multiInput: '',
            count: 0,
        };
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRemoveChange = this.handleRemoveChange.bind(this);
        this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this); 
        this.toggleAllowDuplicate = this.toggleAllowDuplicate.bind(this);
        this.calculateShiftX = this.calculateShiftX.bind(this);
        this.onResize = this.onResize.bind(this);
        this.clearInputForm = this.clearInputForm.bind(this);
        this.clearRemoveForm = this.clearRemoveForm.bind(this);
        this.updateActiveNodeCount = this.updateActiveNodeCount.bind(this);
        this.handleMultiSubmit = this.handleMultiSubmit.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
    }

    clearInputForm() {
        document.getElementById('input-form').reset();
        document.getElementById('input-field').value = '';
    }

    clearRemoveForm() {
        document.getElementById('remove-form').reset();
        document.getElementById('remove-field').value = '';
    }

    updateActiveNodeCount(){
        document.getElementById('active-node-count').innerHTML = `Number of Nodes: ${this.state.bst.numActiveNodes}`;
    }

    handleInputChange(event) {
        this.setState({ inputValue: parseFloat(event.target.value) });
    }

    handleRemoveChange(event) {
        this.setState({ removeValue: parseFloat(event.target.value) });
    }
    
    handleMultiChange(event){
        this.setState({ multiInput: event.target.value});
    }

    handleInputSubmit(event) {
        event.preventDefault();
        if (this.state.inputValue === '' || isNaN(this.state.inputValue)) {
            setErrorMessage('<p>Please enter an number (e.g. 32, 2.7).<p>')
            return;
        }
        setErrorMessage('');
        this.state.bst.insert(this.state.inputValue, this.state.count);
        addNodeToDOM(this.state.inputValue, this.state.count);
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        formatBinaryTree(this.state.bst);
        this.setState({ count: this.state.count + 1, inputValue: '' });
        this.state.bst.numActiveNodes += 1;
        this.updateActiveNodeCount();
        // this.clearInputForm();
    }

    handleRemoveSubmit(event) {
        event.preventDefault();
        if (this.state.removeValue === '' || isNaN(this.state.removeValue)) {
            setErrorMessage('<p>Please enter an number (e.g. 32, 2.7).<p>');
            return;
        }
        const success = this.state.bst.removeRecurse(this.state.bst.root, this.state.removeValue);
        if (this.state.bst.root !== null) {
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
            formatBinaryTree(this.state.bst);
        };
        if (success) this.state.bst.numActiveNodes -= 1;
        this.setState({removeValue: ''});
        this.clearRemoveForm();
        this.updateActiveNodeCount();
        if (success && this.state.bst.root === null) toggleFormDisable();
        // this.clearRemoveForm();
    }

    handleMultiSubmit(event){
        event.preventDefault();
        const multiInput = this.state.multiInput
        const newNodes = this.state.multiInput.split(" ");
        console.log({ multiInput, newNodes });
        newNodes.forEach( (value, index) => {
            this.state.bst.insert(parseFloat(value), this.state.count + index);
            addNodeToDOM(value, this.state.count + index);
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
            this.state.bst.numActiveNodes += 1;
        });
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        formatBinaryTree(this.state.bst);
        this.setState({count: this.state.count + newNodes.length});
        this.setState({multiInput: ''});
    }

    // shouldComponentUpdate(){ return false; }

    calculateShiftX(nodeContainer) {
        const rightOverflow = Math.min(0, getWidthMidpoint(nodeContainer) - size(this.state.bst.root.right) * HORIZONTAL_SPACING - NODE_RADIUS);
        return Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - size(this.state.bst.root.left) * HORIZONTAL_SPACING + rightOverflow);
    }

    componentDidMount(){
        window.addEventListener('resize', this.onResize);
        shift_x = getWidthMidpoint(document.getElementById('nodecontainer'));
        this.toggleTraverseOn();
        const randomTree = [...Array(13)].map(() => Math.floor(Math.random() * 999 + 1));
        const sortedTree = Array.from(randomTree).sort();
        const median = sortedTree[Math.floor(sortedTree.length/2)];
        const medianIndex = randomTree.indexOf(median);
        randomTree[medianIndex] = randomTree[0];
        randomTree[0] = median;
        randomTree.forEach( (value, index) => {
            this.state.bst.insert(parseFloat(value), this.state.count + index);
            addNodeToDOM(value, this.state.count + index);
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
            this.state.bst.numActiveNodes += 1;
            console.log({value, index})
        });
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        formatBinaryTree(this.state.bst);
        this.setState({count: this.state.count + randomTree.length});
        this.toggleTraverseOn();
    }
    
    toggleTraverseOn(){ traverseOn = !traverseOn; }
    toggleAllowDuplicate() { allowDuplicate = !allowDuplicate; }

    handleIntervalChange(event){ TRAVERSE_DURATION = 1500 - event.target.value; }

    onResize(){
        if (this.state.bst.root === null) return;
        clearTimeout(resizeTimer);
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        resizeTimer = setTimeout(formatBinaryTree(this.state.bst), 3000 );
    }

    render(){ 
        return(
            <PageWrapper id="pagewrapper">
                <div>
                    <NodeContainer id="nodecontainer" >
                    <svg className="linecontainer" id="svg-line" />                    
                    </NodeContainer>
                </div>
                <div>
                    <Controls>
                        <form id='input-form' onSubmit={this.handleInputSubmit} className='controlForm'>
                            <label>
                                <input type="number" value={this.state.inputValue} id="input-field" onChange={this.handleInputChange}/> 
                                <button id='input-button' onClick={this.handleInputSubmit} className='inputButton'>Input</button>
                            </label>
                        </form>
                        <form id='remove-form' onSubmit={this.handleRemoveSubmit} className='controlForm'>
                            <label>
                                <input type="number" value={this.state.removeValue} id="remove-field" onChange={this.handleRemoveChange}/> 
                                <button id='remove-button' onClick={this.handleRemoveSubmit} className='removeButton'>Remove</button>
                            </label>
                        </form>
                        <label>
                            Animate traversal
                            <input type='checkbox' defaultChecked='on' id='traverse-checkbox' onChange={this.toggleTraverseOn}/>
                        </label>
                        <br/>
                        <label>
                            <input type='range' defaultValue='1000' min='0' max='1400' id='traverse-interval-slider' onChange={this.handleIntervalChange}/>
                            Traversal Speed
                        </label>
                    </Controls>
                    <form id='multi-input' onSubmit={this.handleMultiSubmit}>
                        <textarea rows='5' onChange={this.handleMultiChange}/>
                        <input value='Run' type='submit' />
                    </form>
                    <div id='logs'/>
                    <div id='active-node-count'/>
                    <div id='error-message'/>
                </div>
            </PageWrapper>
        );
    }
}

export default AnimeTest;