import React, { Component } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import styled from 'styled-components';
import { parse } from 'query-string';

const PageWrapper = styled.div`
    padding-left: 6rem;
    padding-right: 6rem;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const Controls = styled.div`
    margin-left: auto;
`

const NodeContainer = styled.div`
    
`


class BinarySearchTree {
    constructor() {
        this.root = null;   
    }

    insert(value, count) {
        var newNode = new Node (value, 0, count);
        if (this.root === null) this.root = newNode;
        else { 
            newNode.level = newNode.level + 1;
            this.insertNode(this.root, newNode);
        }
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
        this.height = 0;
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
    var nodeContainer = document.getElementById('nodecontainer');
    var node = document.getElementById(`node${newNode.id}`);
    const center = get_translateX_center(nodeContainer, node) + node.getBoundingClientRect().width;
    const x_translation = center + get_translateX_shiftLeftRight(newNode); 
    anime({
        targets: `#node${newNode.id}`,
        marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
        keyframes: [
            { translateX: x_translation, translateY: newNode.level * 80, scale: 0, duration: 0 },
            { scale: 1 },
        ],
        duration: 1500,
    });

    var node = document.getElementById(`node${newNode.id}`);
}

function clearForm() {
    const form = document.getElementById('input-form');
    form.reset();
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
        const newNode  = this.state.bst.insert(this.state.inputValue, this.state.count);
        addNodeToDOM(this.state.inputValue, this.state.count);
        initNodePosition(newNode);
        this.setState({ count: this.state.count + 1 });
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
        window.addEventListener('resize', this.adjustToResize)
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