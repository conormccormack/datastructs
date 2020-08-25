import React, { Component } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import '../css/input-range.css';
import '../resources/fonts/fontawesome/css/all.css';
import ClosedCodeCaptions from './closedcodecaptions';

const HORIZONTAL_SPACING = 45;
const NODE_RADIUS = 30;
const VERTICAL_SPACING = 70;
let TRAVERSE_DURATION = 500;
let shift_x;
let resizeTimer;
let traverseCount = 0;
let traverseOn = true;

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

class UndoController {
    constructor(){
        this.performed = [];
        this.recall = []
    }
    
    newState(state, action, value){
        this.performed.push({ state: state, action: action, value: value });
    }

    undo(){
        if (this.performed.length === 0) return -1;
        this.recall.push(this.performed.pop());
        const newState = this.performed[this.performed.length - 1];
        return newState !== undefined ? newState : [];
    }
    
    redo(){
        if (this.recall.length === 0) return -1;
        this.performed.push(this.recall.pop());
        const newState = this.performed[this.performed.length - 1];
        return newState !== undefined ? newState : [];
    }

    getCurrentState(){
        return this.performed[this.performed.length - 1];
    }
}

class BinarySearchTree {
    constructor(animator, setCaptionLine) {
        this.root = null;
        this.numActiveNodes = 0;
        this.x_distances = new Map();
        this.animator = animator;
        this.setCaptionLine = setCaptionLine;
    }

    updateLevels(root, level){
        root.level = level;
        if (root.right !== null) this.updateLevels(root.right, level + 1);
        if (root.left !== null) this.updateLevels(root.left, level + 1 );
    }

    getValuesAsArray(){
        if (!this.root) return;
        let arr = []
        let queue = []
        queue.push(this.root)
        while (queue.length > 0) {
            const node = queue.shift();
            arr.push(node.value);
            if (node.left !== null) queue.push(node.left);
            if (node.right !== null) queue.push(node.right);
        }
        return arr;
    }

    getTreeHeight(){
        if (this.root === null) return 0;
        return 1 + this.getTreeHeightRecurse(this.root, 0);
    }
    getTreeHeightRecurse(node, total){ 
        const left = node.left !== null ? this.getTreeHeightRecurse(node.left, total) + 1 : 0;
        const right = node.right !== null ? this.getTreeHeightRecurse(node.right, total) + 1 : 0;
        return total + Math.max(left, right);
    }

    // Insert node into tree and update heights map.
    insert(value, count) {
        var newNode = new Node (value, 0, count);
        var success = true;
        if (this.root === null) {
            if (traverseOn) {
                this.animator.addCaptionStep(0, 0, 2, this.setCaptionLine);
                this.animator.addCaptionStep(1, 1, 2, this.setCaptionLine);
            }
            this.root = newNode;
            addNodeToDOM(value, count);
            this.numActiveNodes += 1;
        }
        else {
            newNode.level += 1;
            success = this.insertNode(this.root, newNode, count);
        }
        return success;
    }

    insertNode(root, newNode, count){  
        if (traverseOn) this.animator.addTraverseStep(root, 0);
        if (newNode.value === root.value) {
            if (traverseOn) this.animator.addCaptionStep(12, 0, 2, this.setCaptionLine);
            if (traverseOn) this.animator.addCaptionStep(13, 1, 2, this.setCaptionLine);
            return false;
        } else if (newNode.value < root.value){
            if (traverseOn) this.animator.addCaptionStep(2, 0, 3, this.setCaptionLine);
            if (root.left !== null) {
                if (traverseOn) this.animator.addCaptionStep(5, 1, 3, this.setCaptionLine);
                if (traverseOn) this.animator.addCaptionStep(6, 2, 3, this.setCaptionLine);
                newNode.level = newNode.level + 1;
                return this.insertNode(root.left, newNode, count);
            } else {
                if (traverseOn) this.animator.addCaptionStep(3, 1, 3, this.setCaptionLine);
                if (traverseOn) this.animator.addCaptionStep(4, 2, 3, this.setCaptionLine);
                root.left = newNode; 
                newNode.parent = root;
                this.numActiveNodes += 1;
                addNodeToDOM(newNode.value, count);
                return true;
            }
        } else if (newNode.value > root.value){
            if (traverseOn) this.animator.addCaptionStep(7, 0, 3, this.setCaptionLine);
            if (root.right !== null) {
                newNode.level = newNode.level + 1;
                if (traverseOn) this.animator.addCaptionStep(10, 1, 3, this.setCaptionLine);
                if (traverseOn) this.animator.addCaptionStep(11, 2, 3, this.setCaptionLine);
                return this.insertNode(root.right, newNode, count);
            } else { 
                if (traverseOn) this.animator.addCaptionStep(8, 1, 3, this.setCaptionLine);
                if (traverseOn) this.animator.addCaptionStep(9, 2, 3, this.setCaptionLine);
                root.right = newNode; 
                newNode.parent = root;
                this.numActiveNodes += 1;
                addNodeToDOM(newNode.value, count);
                return true;
            }
        }
    }

    removeRecurse(root, value){
        this.setCaptionLine(4);
        if (root !== null && traverseOn) this.animator.addTraverseStep(root, 0);
        if (root === null) {
            return false;
        } else if (value < root.value) {
            this.animator.addCaptionStep(0, 0, 2, this.setCaptionLine);
            this.animator.addCaptionStep(1, 1, 2, this.setCaptionLine);
            return this.removeRecurse(root.left, value);
        } else if (value > root.value) {
            this.animator.addCaptionStep(2, 0, 2, this.setCaptionLine);
            this.animator.addCaptionStep(3, 1, 2, this.setCaptionLine);
            return this.removeRecurse(root.right, value);
        } else {
            this.animator.addCaptionStep(4, 0, 5, this.setCaptionLine);
            this.deleteNode(root);
            this.numActiveNodes -= 1;
            return true;
        }  
    }

    deleteNode(node, isSuccessor){
        let child_of_type = (node.parent !== null) ? (node.parent.right === node) ? 'right' : 'left' : 'root';
        let replacement = (node.left === null && node.right === null) ? null : (node.left === null) ? node.right : node.left;
        if (node.left !== null && node.right !== null){
            this.animator.addCaptionStep(9, 1, 5, this.setCaptionLine);
            this.animator.addCaptionStep(10, 3, 5, this.setCaptionLine);
            const swap = this.findLeftmost(node.right);
            this.animator.addTraverseStep(swap, -1);
            node.value = swap.value;
            this.animator.timeline.add({
                targets: document.getElementById(`frontnode${node.id}`),
                innerHTML: node.value,
                easing: 'easeOutCubic',
                round: 1,
                duration: 500,
            }, (traverseCount - 1) * TRAVERSE_DURATION)
            this.deleteNode(swap, true);
        } else {
            if (child_of_type !== 'root') {
                this.animator.removeElementFromDOM(`path${node.id}`);  
                if (child_of_type === 'right') node.parent.right = replacement;
                else if (child_of_type === 'left') node.parent.left = replacement;
            } 
            else {
                if (replacement) this.animator.removeElementFromDOM(`path${replacement.id}`);
                this.root = replacement;
            }
            if (replacement) {
                replacement.parent = node.parent;
                !isSuccessor && this.animator.addCaptionStep(7, 1, 5, this.setCaptionLine);
                !isSuccessor && this.animator.addCaptionStep(8, 3, 5, this.setCaptionLine);
            } else if (!replacement && !isSuccessor) {
                this.animator.addCaptionStep(5, 1, 5, this.setCaptionLine);
                this.animator.addCaptionStep(6, 3, 5, this.setCaptionLine);
            }
            this.animator.removeElementFromDOM(`node${node.id}`);
        }

        if (this.root) this.updateLevels(this.root, 0);
    }

    async tearDownTree(){
        if (this.root === null) return;
        this.animator.buildTearDownAnimation(this.root, this.root);
        this.animator.timeline.play();
        await this.animator.timeline.finished;
        this.animator.timeline = anime.timeline({ autoplay: false });
        return;
    }

    static sizeOfSubtree(root){
        if (root === null) return 0;     
        const left = root.left ? this.sizeOfSubtree(root.left) : 0;
        const right = root.right ? this.sizeOfSubtree(root.right) : 0;
        return left + right + 1;
    }

    findLeftmost(root){
        return root.left === null ? root : this.findLeftmost(root.left);
    }
        
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

class Animator {
    constructor(props){
        this.timeline = anime.timeline({ autoplay: false })
    }

    removeElementFromDOM(id) {    
        var toRemove = document.getElementById(id);
        if (id === null) return;
        this.timeline.add({
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

    addNodeToDOM(value, count) {
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

    buildEdgeTimeline(root, tree){
        if (root.left !== null) this.buildEdgeTimeline(root.left, tree);
        if (root.parent !== null){
            const x1 = tree.x_distances.get(`node${root.parent.id}`); 
            const y1 = root.parent.level * VERTICAL_SPACING + NODE_RADIUS;
            const x2 = tree.x_distances.get(`node${root.id}`);
            const y2 = root.level * VERTICAL_SPACING + NODE_RADIUS;
            const curr_opacity = parseFloat(document.getElementById(`path${root.id}`).getAttribute('opacity'));
            const isNew = curr_opacity > 0.7 ? false : true;
            this.timeline.add({
                targets: `#path${root.id}`,
                d: `M ${x1}, ${y1} L ${x2}, ${y2}`,
                opacity: { value: '1.0', easing: 'easeInSine', delay: isNew ? 600: 0, duration: isNew ? 200 : 0 },
                stroke: { value: '#DEAAFF', delay: isNew ? 800 : 0 },
                easing: 'easeInOutExpo',
            }, traverseCount * TRAVERSE_DURATION);
        }
        if (root.right !== null) this.buildEdgeTimeline(root.right, tree);
    }

    buildNodeTimeline(root, tree){
        if (root.left !== null) this.buildNodeTimeline(root.left, tree);
        const node = document.getElementById(`node${root.id}`);
        const x = shift_x - NODE_RADIUS;
        const isNew = root.parent !== null && root.line === null ? true : false;
        tree.x_distances.set(`node${root.id}`, x );
        root.parent !== null && root.line === null && addPathToDom(root);
        root.line = root.line === null && `line${root.id}`;
        if (isNew){
            this.timeline.add({
                targets: `#node${root.id}`,
                marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
                keyframes: [
                    { scale: isNew ? 0 : 1, duration: 0 },
                    { translateX: isNew ? 0 : shift_x, translateY: root.level * VERTICAL_SPACING,  scale: 1, duration: 800 },
                    { translateX: shift_x, translateY: root.level * VERTICAL_SPACING, delay: 200, duration: 800 }
                ],
                easing: 'easeInOutExpo',
            }, traverseCount * TRAVERSE_DURATION);
        } else {
            this.timeline.add({
                targets: `#node${root.id}`,
                marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
                keyframes: [
                    { scale: isNew ? 0 : 1, duration: 0 },
                    { translateX: isNew ? 0 : shift_x, translateY: root.level * VERTICAL_SPACING,  scale: 1, duration: 800 },
                    { translateX: shift_x, translateY: root.level * VERTICAL_SPACING, delay: 200, duration: 800 }
                ],
                easing: 'easeInOutExpo',
            }, traverseCount * TRAVERSE_DURATION);
        }
    
        shift_x += HORIZONTAL_SPACING;
    
        if (root.right !== null) this.buildNodeTimeline(root.right, tree);
    }

    buildTearDownAnimation(node, root){
        this.timeline.add({
            targets: `#node${node.id}`,
            opacity: 0,
            scale: .9,
            translateX: `+=60`,
            translateY: `-=20`,
            duration: 1000,
            complete: () => {
                document.getElementById(`node${node.id}`).remove();
            }
        }, node.level * 50)
        if (node !== root) {
            this.timeline.add({
                targets: `#path${node.id}`,
                opacity: 0,
                scale: .9,
                translateX: `+=60`,
                translateY: `-=20`,
                duration: 1000,
                complete: () => {
                    document.getElementById(`path${node.id}`).remove();
                }
            }, node.level * 50)
        }
        if (node.left !== null) this.buildTearDownAnimation(node.left, root);
        if (node.right !== null) this.buildTearDownAnimation(node.right, root);
    }

    async formatBinaryTree(tree){
        if (tree.root !== null){
            this.buildNodeTimeline(tree.root, tree);
            this.buildEdgeTimeline(tree.root, tree);
        }
        this.timeline.play();
        await this.timeline.finished;
        this.timeline = anime.timeline({});
        return;
    }

    addTraverseStep(node, shift_order){
        this.timeline.add({
            targets: `#node${node.id}`,
            keyframes: [
                { scale: 1 },
                { scale:1 },
            ],
            easing: 'easeInOutBack',
            duration: TRAVERSE_DURATION,
        }, (traverseCount + shift_order) * TRAVERSE_DURATION);
        this.timeline.add({
            targets: `#frontnode${node.id}`,
            keyframes: [
                { background: '#3C5B6F' },
                { background: ' ' },
            ],
            easing: 'easeInOutBack',
            duration: TRAVERSE_DURATION,
        }, (traverseCount + shift_order) * TRAVERSE_DURATION);
        if (node.parent !== null && shift_order === 0) {
            this.timeline.add({
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

    addCaptionStep(lineNumber, delay, divisor, setCaptionLine){
        this.timeline.add({
            duration: TRAVERSE_DURATION,
            complete: () => {
                setCaptionLine(lineNumber)
            }
        }, (traverseCount-1) * TRAVERSE_DURATION + delay * (TRAVERSE_DURATION/divisor))
    }
}

class RefactoredBST extends Component {
    inputLines = [{value: 'if root is NULL:' , indent: 0}, {value: 'insert at root' , indent: 1},
        {value: 'if input < curr:' , indent: 0}, {value: 'if curr.left is NULL:' , indent: 1},
        {value: 'insert input at curr.left' , indent: 2}, {value: 'else:' , indent: 1}, 
        {value: 'look left' , indent: 2}, {value: 'else if input > curr:' , indent: 0}, 
        {value: 'if curr.right is NULL:' , indent: 1}, {value: 'insert input at curr.right' , indent: 2},
        {value: 'else:' , indent: 1}, {value: 'look right' , indent: 2}, {value: 'else:' , indent: 0},
        {value: 'reject duplicate' , indent: 1}
    ]

    removeLines = [{value: 'if remove < curr:' , indent: 0}, {value: 'look left' , indent: 1}, 
        {value: 'else if remove > curr:' , indent: 0}, {value: 'look right' , indent: 1},  
        {value: 'else:' , indent: 0}, {value: 'if curr has no children:' , indent: 1}, 
        {value: 'delete curr' , indent: 2}, 
        {value: 'else if curr has only one child:' , indent: 1}, {value: 'connect child to curr\'s parent' , indent: 2}, 
        {value: 'else if curr has two children:' , indent: 1}, 
        {value: 'replace curr with its succcessor' , indent: 2},
    ]
    
    constructor (props) {
        super(props);
        this.animator = new Animator();
        this.state = {
            inputValue: '',
            removeValue: '',
            bst: new BinarySearchTree(this.animator, (x) => this.setState({ currentLine: x })),
            count: 0,
            disable: true,
            numActiveNodes: 0,
            treeHeight: 0,
            formatting: true,
            seekValue: TRAVERSE_DURATION/2,
            errorMessage: '',
            currentOperation: 'input',
            currentLine: -1,
            undoController: new UndoController(),
        };
        this.handleInputSubmit = this.handleInputSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRemoveChange = this.handleRemoveChange.bind(this);
        this.handleRemoveSubmit = this.handleRemoveSubmit.bind(this); 
        this.calculateShiftX = this.calculateShiftX.bind(this);
        this.onResize = this.onResize.bind(this);
        this.tearDownTree = this.tearDownTree.bind(this);
        this.resyncFormat = this.resyncFormat.bind(this);
        this.playPause = this.playPause.bind(this);
    }

    componentWillUnmount() { 
    }

    async componentDidMount(){
        window.addEventListener('resize', this.onResize);
        shift_x = getWidthMidpoint(document.getElementById('nodecontainer'));
        this.toggleTraverseOn();
        const randomTree = [];
        while(randomTree.length < Math.min(10, shift_x / NODE_RADIUS - 1)){
            const s = Math.floor(Math.random() * 420 + 1);
            if (randomTree.indexOf(s) === -1) randomTree.push(s);
        }
        const sortedTree = Array.from(randomTree).sort();
        const median = sortedTree[Math.floor(sortedTree.length/2)];
        const medianIndex = randomTree.indexOf(median);
        randomTree[medianIndex] = randomTree[0];
        randomTree[0] = median;
        randomTree.forEach( (value, index) => {
            this.state.bst.insert(parseFloat(value), this.state.count + index);
            this.state.undoController.newState(this.state.bst.getValuesAsArray(), 'INSERT', value);
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        });
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        this.setState({
            count: this.state.count + randomTree.length, 
            numActiveNodes: this.state.bst.numActiveNodes, 
            treeHeight: this.state.bst.getTreeHeight(),
        });
        await this.animator.formatBinaryTree(this.state.bst);
        this.setState({ disable: false });
        this.toggleTraverseOn();
    }
    
    handleInputChange(event) {
        this.setState({ inputValue: isNaN(event.target.value) ? '' : parseFloat(event.target.value)});
    }

    handleRemoveChange(event) {
        this.setState({ removeValue: isNaN(event.target.value) ? '' : parseFloat(event.target.value)});
    }
    
    async handleInputSubmit(event) {
        event.preventDefault();
        this.setState({ currentOperation: 'input', currentLine: `${traverseOn ? 0 : -1}` });
        this.animator.timeline = anime.timeline({ autoplay: false });
        this.setState({ disable: true });
        if (this.state.inputValue === '' || isNaN(this.state.inputValue)) {
            this.setState({ errorMessage: 'Please enter an number (e.g. 32, 2.7).', inputValue: '', disable: false});
            return;
        }
        const success = this.state.bst.insert(this.state.inputValue, this.state.count);
        if (!success) {
            this.setState({ errorMessage: `${this.state.inputValue} already exists in the tree.`, inputValue: '', disable: false })
            if (!traverseOn) return;
        }
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        if (success) this.setState({ errorMessage: '' });
        this.state.undoController.newState(this.state.bst.getValuesAsArray(), 'INSERT', this.state.inputValue);
        this.setState({ inputValue : '',});
        await this.animator.formatBinaryTree(this.state.bst);
        this.setState({ count: this.state.count + 1,
            disable: false, 
            numActiveNodes: this.state.bst.numActiveNodes,
            treeHeight: this.state.bst.getTreeHeight(), 
        });
        traverseCount = 0;
        document.getElementById('input-field').focus();
    }

    async handleRemoveSubmit(event) {
        event.preventDefault();
        const removeValue = this.state.removeValue;
        this.setState({ currentOperation: 'remove' });
        if (this.state.removeValue === '' || isNaN(this.state.removeValue)) {
            this.setState({ errorMessage: 'Please enter an number (e.g. 32, 2.7).', removeValue: '' }); 
            return;
        }
        if (this.state.bst.root == null){
            this.setState({ errorMessage: 'Could not remove: tree is empty.', removeValue: '' });
            return;
        }
        this.setState({ disable: true });
        this.animator.timeline = anime.timeline({ });
        const success = this.state.bst.removeRecurse(this.state.bst.root, removeValue);
        success && this.state.undoController.newState(this.state.bst.getValuesAsArray(), 'REMOVE', removeValue);
        this.setState({ removeValue: '', errorMessage: '' });
        if (this.state.bst.root !== null) {
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        };
        await this.animator.formatBinaryTree(this.state.bst);
        this.setState({
            disable : false, 
            numActiveNodes: this.state.bst.numActiveNodes,
            treeHeight: this.state.bst.getTreeHeight(),
            errorMessage: success ? '' : `${removeValue} s not exist in the tree.`,
            removeValue: '',
        });
        document.getElementById('remove-field').focus();
        traverseCount = 0;
    }

    calculateShiftX(nodeContainer) {
        const rightOverflow = Math.min(0, getWidthMidpoint(nodeContainer) - BinarySearchTree.sizeOfSubtree(this.state.bst.root.right) * HORIZONTAL_SPACING - NODE_RADIUS);
        return Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - BinarySearchTree.sizeOfSubtree(this.state.bst.root.left) * HORIZONTAL_SPACING + rightOverflow);
    }

    async handleUndoRedo(action){
        this.setState({ disable: true });
        const prev_trav = traverseOn;
        traverseOn = false; 
        const currState = this.state.undoController.getCurrentState();
        const newState = action === 'Undo' ? this.state.undoController.undo(): this.state.undoController.redo();
        if (newState !== -1) {
            this.setState({ errorMessage: `${action}ing ${action === 'Undo' ? currState.action : newState.action} 
                ${action === 'Undo' ? currState.value : newState.value}...` 
            });
            await this.tearDownTree();
            newState.state.forEach( (value, index) => {
                this.state.bst.insert(parseFloat(value), this.state.count + index);
                shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
            });
            shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
            this.setState({
                count: this.state.count + newState.state.length, 
                numActiveNodes: this.state.bst.numActiveNodes, 
                treeHeight: this.state.bst.getTreeHeight(),
                errorMessage: `${action} ${action === 'Undo' ? currState.action : newState.action} 
                ${action === 'Undo' ? currState.value : newState.value} complete.`,
            });
            await this.animator.formatBinaryTree(this.state.bst);
        }
        else this.setState({ errorMessage: `Nothing to ${action}.`});
        this.setState({ disable: false });
        traverseOn = prev_trav;
    }
    
    toggleTraverseOn(){ traverseOn = !traverseOn; }
    
    handleIntervalChange(event){ TRAVERSE_DURATION = 1500 - event.target.value; }
    
    onResize(){
        if (this.state.bst.root === null || this.state.disable === true) return;
        clearTimeout(resizeTimer);
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        resizeTimer = setTimeout(async () => {
            this.setState({disable : true});
            this.animator.timeline = anime.timeline({ autoplay: false });
            await this.animator.formatBinaryTree(this.state.bst);
            this.setState({disable : false});
        }, 500);
    }
    
    async tearDownTree(){
        this.setState({disable: true});
        this.animator.timeline = anime.timeline({ autoplay: false });
        await this.state.bst.tearDownTree();
        this.setState({disable: false, bst: new BinarySearchTree(this.animator, (x) => this.setState({ currentLine: x }))});
        return;
    }

    async resyncFormat(){
        this.setState({disable: true });
        shift_x = this.calculateShiftX(document.getElementById('nodecontainer'));
        this.animator.timeline = anime.timeline({ autoplay: false });
        await this.animator.formatBinaryTree(this.state.bst);
        this.setState({disable: false });
    }

    playPause(){
        if (this.state.disable){
            this.animator.timeline.pause();
            this.setState({ disable: false });
        } else {
            this.animator.timeline.play();
            this.setState({ disable: true });
        }
    }

    render(){ 
        return(
            <div className='page-wrapper'>
                <div className="nodecontainer" id="nodecontainer" style={{ height: `${(this.state.treeHeight - 1)*70 + 100}px`}} >
                    <svg className="linecontainer" id="svg-line" />                    
                </div>
                <div style={{ display: `${this.props.hideUI && 'none'}`}} className='ui-container'>
                    <div className='tree-info'>Number of Nodes: {this.state.numActiveNodes}</div> 
                    <div className='tree-info'>Tree Height: {this.state.treeHeight}</div>
                    <form id='input-form' onSubmit={this.handleInputSubmit} className='controlForm'>
                        <label>
                            <input disabled={this.state.disable} className='field' type="number" value={this.state.inputValue} id="input-field" onChange={this.handleInputChange}/> 
                            <button disabled={this.state.disable} id='input-button' onClick={this.handleInputSubmit} className='field-button'>Insert</button>
                        </label>
                    </form>
                    <form id='remove-form' onSubmit={this.handleRemoveSubmit} className='controlForm'>
                        <label>
                            <input disabled={this.state.disable} className='field' type="number" value={this.state.removeValue} id="remove-field" onChange={this.handleRemoveChange}/> 
                            <button disabled={this.state.disable} id='remove-button' onClick={this.handleRemoveSubmit} className='field-button'>Remove</button>
                        </label>
                    </form>
                    {/* <input type='range' step={TRAVERSE_DURATION} min={TRAVERSE_DURATION/2} max={this.animator.timeline.duration - 1800} value={this.state.seekValue} onChange={(e) => this.setState({ seekValue: e.target.value})}/>
                    <button onClick={() => this.playPause()}>{this.state.disable ? 'Pause' : 'Play'}</button>
                    <button onClick={() => this.animator.timeline.seek(this.state.seekValue)}></button> */}
                    <div className='tree-info'> 
                        <label>
                            Animate traversal
                            <input type='checkbox' defaultChecked='on' id='traverse-checkbox' onChange={this.toggleTraverseOn}/>
                        </label>
                    </div>
                    <div className='tree-info slider-wrapper'>
                        <label>
                            Traversal Speed 
                            <input style={{width: '120px'}} className='slider' type='range' defaultValue='1000' min='0' max='1400' id='traverse-interval-slider' onChange={this.handleIntervalChange}/>
                        </label>
                    </div>
                    <button disabled={this.state.disable} onClick={() => this.resyncFormat()} className='refresh-button'>
                        Something wrong? <i className="fas fa-sync-alt"/>
                    </button>
                    <button className='clear-button' onClick={() => { 
                        this.tearDownTree(); 
                        this.setState({ numActiveNodes: 0, treeHeight: 0 });
                        }} disabled={this.state.disable}>
                            Clear Tree
                    </button>
                    <button className='clear-button' onClick={() => this.handleUndoRedo('Undo')} disabled={this.state.disable}>
                        Undo
                    </button>
                    <button className='clear-button' onClick={() => this.handleUndoRedo('Redo')} disabled={this.state.disable}>
                        Redo
                    </button>
                    {this.animator.timeline.duration}
                    <div className='tree-info' id='error-message'>{this.state.errorMessage}</div>
                    <ClosedCodeCaptions current={this.state.currentLine} lines={ 
                            this.state.currentOperation === 'input' ? this.inputLines : 
                            this.state.currentOperation === 'remove' ? this.removeLines :
                            []
                        }/>
                </div>
            </div>
        );
    }
}

export default RefactoredBST;