import React, { Component } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import styled from 'styled-components';

const PageWrapper = styled.div`
    padding-left: 6rem;
    padding-right: 6rem;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const Controls = styled.div`

`

const NodeContainer = styled.div`
`

class BinarySearchTree {
    constructor() {
        this.root = null;   
    }

    insert(value) {
        var newNode = new Node (value);
        if (this.root === null) this.root = newNode;
        else this.insertNode(this.root, newNode);
    }
    insertNode(root, newNode){ 
        if (newNode.value < root.value){
            if (root.left !== null) this.insertNode(root.left, newNode);
            else root.left = newNode;
        } else if (newNode.value >= root.value){
            if (root.right !== null) this.insertNode(root.right, newNode);
            else root.right = newNode;
        }
    }
}

class Node {
    constructor (value){
        this.value = value;
        this.left = null;
        this.right = null;
    }
}


function addNode(value, count) {
    var node = document.createElement("div");
    node.setAttribute('class', 'bstnode');
    node.setAttribute('id', `node${count}`);
    var text = document.createTextNode(value);
    node.appendChild(text);
    document.getElementById("nodecontainer").appendChild(node);
}

function leftRight(distance, selector) {
    console.log("selector: " + selector)
    anime({
        targets: selector,
        keyframes: [
            { translateX: distance },
            { translateX: 0 },
        ],
        duration: 1500,
    });

}

class AnimeTest extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: '',
            bst: new BinarySearchTree,
            count: 0,
        };
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({ value: event.target.value });
    }

    handleInputSubmit(event) {
        event.preventDefault();
        this.state.bst.insert(this.state.value);
        setTimeout(0);
        addNode(this.state.value, this.state.count);
        var el = document.querySelectorAll(`#node${this.state.count}`);
        leftRight(this.state.value, `#node${this.state.count}`);
        this.setState({ value: '', count: this.state.count + 1});
        console.log(this.state.bst);
    }

    shouldComponentUpdate(){
        return false;
    }

    componentDidMount(){
        
    }

    render(){ 
        return(
            <PageWrapper>
                <NodeContainer id="nodecontainer" />
                <Controls>
                    <form onSubmit={this.handleInputSubmit}>
                        <label>
                            <input type="number" onChange={this.handleInputChange}/> Input
                        </label>
                    </form>
                </Controls>
            </PageWrapper>
        );
    }
}



export default AnimeTest;