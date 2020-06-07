import React, { Component, useLayoutEffect } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import styled from 'styled-components';
import { parse } from 'query-string';

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
`
const HORIZONTAL_SPACING = 50;

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

    // Insert node into tree and update heights map.
    insert(value, count) {
        var newNode = new Node (value, 0, count);
        if (this.root === null) this.root = newNode;
        else { 
            newNode.level = newNode.level + 1;
            this.insertNode(this.root, newNode);
        }
        this.updateHeights(newNode);
        return newNode;
    }

    insertNode(root, newNode){  
        if (newNode.value < root.value){
            if (root.left !== null) {
                newNode.level = newNode.level + 1;
                this.insertNode(root.left, newNode);
            }
            else { 
                root.left = newNode; 
                newNode.parent = root;
            }
        } else if (newNode.value >= root.value){
            if (root.right !== null) {
                newNode.level = newNode.level + 1;
                this.insertNode(root.right, newNode);
            }
            else { 
                root.right = newNode; 
                newNode.parent = root;
            }
        }
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
    }
}

function addNodeToDOM(value, count) {
    var node = document.createElement("div");
    node.setAttribute('class', 'bstnode');
    node.setAttribute('id', `node${count}`);
    node.setAttribute('style', `float: left;`);
    var text = document.createTextNode(value);
    node.appendChild(text);
    document.getElementById("nodecontainer").appendChild(node);
}

// Given an element selector, return the pixel midpoint of its width dimension.
function getWidthMidpoint(selector) {
    return (selector.getBoundingClientRect().width / 2);
}

/* Given an element and its container, return the value for translating X s.t.
*  the element is centered within container.
*/
function get_translateX_center(container_selector, element_selector) {
    return getWidthMidpoint(container_selector) - getWidthMidpoint(element_selector);
}

function get_translateX_centerWithParentNode(container_selector, node){
    const parent = document.getElementById(`node${node.parent.id}`);
    const newElement = document.getElementById(`node${node.id}`);
    return getWidthMidpoint(container_selector) - getWidthMidpoint(newElement) - parent.getBoundingClientRect().width;
}

/* If element is root node, return 0.
* If element is left child, shift left. Else, shift right.  
*/
function get_translateX_shiftLeftRight(newNode){
    if (newNode.parent === null) return 0;
    else if (newNode.parent.left === newNode) {
        return -50;
    } else {       
        return 50;
    }
}


// Note that each node has its margin-left set to -${its width}. 
function initNodePosition(newNode) {
    var node = document.getElementById(`node${newNode.id}`);
    anime({
        targets: `#node${newNode.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { translateX: 1, translateY: 1, scale: 0, duration: 5 },
            { scale: 1, duration: 4000 },
        ],
    });
}

function clearForm() {
    const form = document.getElementById('input-form');
    form.reset();
}

let shift_x_total;

function formatBinaryTree(root) {
    adjustNode(root);
}

// Returns length of path from smallest element to root.
function inOrderToRootLength(root){
    if (root === null) return 0;     
    const left = root.left ? inOrderToRootLength(root.left) : 0;
    const right = root.right ? inOrderToRootLength(root.right) : 0;
    return left + right + 1;
}

function adjustNode(root) {
    if (root.left !== null) adjustNode(root.left);
    const node = document.getElementById(`node${root.id}`);
    anime({
        targets: `#node${root.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { translateX: shift_x_total, translateY: root.level * 80 }
        ],
    });

    shift_x_total += HORIZONTAL_SPACING;

    if (root.right !== null) adjustNode(root.right);
}

function addLineToDom(parent, child){
    if (parent === null) return;

    const parent_selector = document.getElementById(`node${parent.id}`);
    const child_selector = document.getElementById(`node${child.id}`);
    let svg = document.createElementNS('https://www.w3.org/2000/svg', 'svg');
    let line = document.createElementNS('https://www.w3.org/2000/svg', 'line');
    svg.setAttribute('width', '800px');
    svg.setAttribute('height', '100px');
    line.setAttribute('stroke-width', '1px');
    line.setAttribute('stroke', '#000000');
    line.setAttribute('x1', parent_selector.getBoundingClientRect().x);
    line.setAttribute('x2', child_selector.getBoundingClientRect().x);
    line.setAttribute('class', 'line');
    line.setAttribute('y1', parent_selector.getBoundingClientRect().y);
    line.setAttribute('y2', child_selector.getBoundingClientRect().y);
    svg.appendChild(line);
    document.getElementById('nodecontainer').appendChild(svg);
    console.log(line);
}

class AnimeTest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            inputValue: '',
            bst: new BinarySearchTree,
            count: 0,
            numActiveNodes: 0,
        };
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.adjustToResize = this.adjustToResize.bind(this);
    }

    handleInputChange(event) {
        this.setState({ inputValue: parseFloat(event.target.value) });
    }

    handleRemoveSubmit(event) {
        this.setState({ removeValue: parseFloat(event.target.value) });
    }

    handleInputSubmit(event) {
        event.preventDefault();
        if (this.state.inputValue === '') return;
        const nodeContainer = document.getElementById('nodecontainer');
        const newNode  = this.state.bst.insert(this.state.inputValue, this.state.count);
        addNodeToDOM(this.state.inputValue, this.state.count);
        //addLineToDom(newNode.parent, newNode);
        shift_x_total = getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left, 0) * HORIZONTAL_SPACING;
        formatBinaryTree(this.state.bst.root);
        console.log(`shift total: ${shift_x_total}`);
        this.setState({ count: this.state.count + 1, inputValue: '' });
        clearForm();
    }
    
    // TODO: Implement Remove functionality.
    handleRemoveSubmit(event) {
        event.preventDefault();
        if (this.state.inputValue === '') return;
    }

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        window.addEventListener('resize', this.adjustToResize);
        const nodeContainer = document.getElementById('nodecontainer');
        shift_x_total = getWidthMidpoint(nodeContainer);
    }

    adjustToResize(){
        console.log('resize');
    }

    render(){ 
        return(
            <PageWrapper id="pagewrapper">
                <NodeContainer id="nodecontainer" />
                <Controls>
                    <form id='input-form' onSubmit={this.handleInputSubmit}>
                        <label>
                            <input type="number" onChange={this.handleInputChange}/> 
                            <button onClick={this.handleInputSubmit} className='inputButton'>Input</button>
                        </label>
                    </form>
                    {/* <form id='remove-form' onSubmit={this.handleRemoveSubmit}>
                        <label>
                            <input type="number" onChange={this.handleRemoveSubmit}/> 
                            <button onClick={this.handleRemoveSubmit} className='removeButton'>Remove</button>
                        </label>
                    </form> */}
                </Controls>
            </PageWrapper>
        );
    }
}

export default AnimeTest;