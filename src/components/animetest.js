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
const HORIZONTAL_SPACING = 40;
const NODE_RADIUS = 30;
let shift_x_total;

let x_distances = new Map();

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
        this.line = null;
    }
}

function adjustToResize(){

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

// Returns length of in-order traversal from smallest element to root.
function inOrderToRootLength(root){
    if (root === null) return 0;     
    const left = root.left ? inOrderToRootLength(root.left) : 0;
    const right = root.right ? inOrderToRootLength(root.right) : 0;
    return left + right + 1;
}

let formatTimeline = anime.timeline({
    autoplay: false,
});

function formatBinaryTree(root){
    formatTimeline = anime.timeline({
    });
    buildNodeTimeline(root);
    buildEdgeTimeline(root);
    formatTimeline.play();
}

function buildEdgeTimeline(root){
    if (root.left !== null) buildEdgeTimeline(root.left);
    if (root.parent !== null){
        const x1 = x_distances.get(`node${root.parent.id}`); 
        const y1 = root.parent.level * 80 + NODE_RADIUS;
        const x2 = x_distances.get(`node${root.id}`);
        const y2 = root.level * 80 + NODE_RADIUS;
        console.log( {x1, y1, x2, y2});
        formatTimeline.add({
            targets: `#path${root.id}`,
            d: `M ${x1}, ${y1} L ${x2}, ${y2} `,
        }, 0);
    }
    if (root.right !== null) buildEdgeTimeline(root.right);
}

function buildNodeTimeline(root){
    if (root.left !== null) buildNodeTimeline(root.left);
    const node = document.getElementById(`node${root.id}`);
    const x = shift_x_total - NODE_RADIUS;
    x_distances.set(`node${root.id}`, x );
    formatTimeline.add({
        targets: `#node${root.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { translateX: shift_x_total, translateY: root.level * 80 }
        ],
        complete: function() {
            // root.parent !== null && root.line === null && addLineToDom(root.parent, root);
            root.parent !== null && root.line === null && addPathToDom(root);
            root.line = root.line === null && `line${root.id}`;
        },
    }, 0);
    
    shift_x_total += HORIZONTAL_SPACING;

    if (root.right !== null) buildNodeTimeline(root.right);
}

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
    path.setAttribute('stroke', '#DEAAFF');
    path.setAttribute('stroke-width', '3px');
    svg.appendChild(path);
}

function clearForm() {
    const form = document.getElementById('input-form');
    form.reset();
}

let resizeTimer;
let window_width;
let window_height;

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
        this.onResize = this.onResize.bind(this);
    }

    handleInputChange(event) {
        this.setState({ inputValue: parseFloat(event.target.value) });
    }

    handleRemoveSubmit(event) {
        this.setState({ removeValue: parseFloat(event.target.value) });
    }

    handleInputSubmit(event) {
        event.preventDefault();
        if (this.state.inputValue === '' || isNaN(this.state.inputValue)) return;
        const nodeContainer = document.getElementById('nodecontainer');
        const newNode  = this.state.bst.insert(this.state.inputValue, this.state.count);
        addNodeToDOM(this.state.inputValue, this.state.count);
        shift_x_total = Math.max(0, getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left, 0) * HORIZONTAL_SPACING);
        formatBinaryTree(this.state.bst.root);
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
        window.addEventListener('resize', this.onResize);
        const nodeContainer = document.getElementById('nodecontainer');
        shift_x_total = getWidthMidpoint(nodeContainer);
        window_height = window.innerHeight;
        window_width = window.innerWidth;
    }

    onResize(){
        if (this.state.bst.root === null) return;
        clearTimeout(resizeTimer);
        const nodeContainer = document.getElementById('nodecontainer');
        shift_x_total = Math.max(0, getWidthMidpoint(nodeContainer) - inOrderToRootLength(this.state.bst.root.left, 0) * HORIZONTAL_SPACING);
        resizeTimer = setTimeout(formatBinaryTree(this.state.bst.root), 200);
    }

    render(){ 
        return(
            <PageWrapper id="pagewrapper">
                <NodeContainer id="nodecontainer" >
                <svg class="linecontainer" id="svg-line">

                </svg>
                    
                </NodeContainer>
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