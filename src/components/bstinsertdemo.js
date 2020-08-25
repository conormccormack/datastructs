import React, { Component } from 'react';
import anime from 'animejs';
import '../css/bst.css';
import '../css/input-range.css';
import '../resources/fonts/fontawesome/css/all.css';

const HORIZONTAL_SPACING = 45;
const NODE_RADIUS = 30;
const VERTICAL_SPACING = 70;
let TRAVERSE_DURATION = 350;
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
            this.animator.insertTimeline.add({
                targets: document.getElementById(`insert-frontnode${node.id}`),
                innerHTML: node.value,
                easing: 'easeOutCubic',
                round: 1,
                duration: 500,
            }, (traverseCount - 1) * TRAVERSE_DURATION)
            this.deleteNode(swap, true);
        } else {
            if (child_of_type !== 'root') {
                this.animator.removeElementFromDOM(`insert-path${node.id}`);  
                if (child_of_type === 'right') node.parent.right = replacement;
                else if (child_of_type === 'left') node.parent.left = replacement;
            } 
            else {
                if (replacement) this.animator.removeElementFromDOM(`insert-path${replacement.id}`);
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
            this.animator.removeElementFromDOM(`insert-node${node.id}`);
        }

        if (this.root) this.updateLevels(this.root, 0);
    }

    async tearDownTree(){
        if (this.root === null) return;
        this.animator.buildTearDownAnimation(this.root, this.root);
        this.animator.insertTimeline.play();
        await this.animator.insertTimeline.finished;
        this.animator.insertTimeline = anime.timeline({ autoplay: false });
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
    node.setAttribute('id', `insert-node${count}`);
    node.setAttribute('style', `float: left;`);
    let frontHighlight = document.createElement('div');
    frontHighlight.classList.add('front-node');
    frontHighlight.setAttribute('id', `insert-frontnode${count}`);
    let text = document.createTextNode(value);
    frontHighlight.appendChild(text);
    node.appendChild(frontHighlight);
    document.getElementById("insert-nodecontainer").appendChild(node);
}

// Given an element selector, return the pixel midpoint of its width dimension.
function getWidthMidpoint(selector) {
    return (selector.getBoundingClientRect().width / 2);
}

// Given child node, create path from child to parent, add to DOM.
function addPathToDom(child){
    if (child.parent === null) return;
    let svg = document.getElementById('insert-svg-line');
    const parent_selector = document.getElementById(`insert-node${child.parent.id}`);
    const child_selector = document.getElementById(`insert-node${child.id}`);
    const container = document.getElementById(`insert-nodecontainer`);

    const x1 = (parent_selector.getBoundingClientRect().x + parent_selector.getBoundingClientRect().right)/2 - container.getBoundingClientRect().x;
    const y1 =  parent_selector.getBoundingClientRect().bottom - container.getBoundingClientRect().y - NODE_RADIUS;
    const x2 = (child_selector.getBoundingClientRect().x + child_selector.getBoundingClientRect().right)/2 - container.getBoundingClientRect().x;
    const y2 = child_selector.getBoundingClientRect().y - container.getBoundingClientRect().y + NODE_RADIUS;

    let path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('id', `insert-path${child.id}`);
    path.setAttribute('d', `M ${x1}, ${y1} L ${x2}, ${y2} `);
    path.setAttribute('stroke', '#3C5B6F');
    path.setAttribute('stroke-width', '3px');
    path.setAttribute('opacity', '0.0');
    svg.appendChild(path);
}

class Animator {
    constructor(props){
        this.insertTimeline = anime.timeline({ autoplay: false })
    }
    buildTearDownAnimation(node, root){
        this.insertTimeline.add({
            targets: `#insert-node${node.id}`,
            opacity: 0,
            scale: .9,
            translateX: `+=60`,
            translateY: `-=20`,
            duration: 1000,
            complete: () => {
                document.getElementById(`insert-node${node.id}`).remove();
            }
        }, node.level * 50)
        if (node !== root) {
            this.insertTimeline.add({
                targets: `#insert-path${node.id}`,
                opacity: 0,
                scale: .9,
                translateX: `+=60`,
                translateY: `-=20`,
                duration: 1000,
                complete: () => {
                    document.getElementById(`insert-path${node.id}`).remove();
                }
            }, node.level * 50)
        }
        if (node.left !== null) this.buildTearDownAnimation(node.left, root);
        if (node.right !== null) this.buildTearDownAnimation(node.right, root);
    }

    removeElementFromDOM(id) {    
        var toRemove = document.getElementById(id);
        if (id === null) return;
        this.insertTimeline.add({
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
        node.setAttribute('id', `insert-node${count}`);
        node.setAttribute('style', `float: left;`);
        let frontHighlight = document.createElement('div');
        frontHighlight.classList.add('front-node');
        frontHighlight.setAttribute('id', `insert-frontnode${count}`);
        let text = document.createTextNode(value);
        frontHighlight.appendChild(text);
        node.appendChild(frontHighlight);
        document.getElementById("insert-nodecontainer").appendChild(node);
    }

    buildEdgeTimeline(root, tree){
        if (root.left !== null) this.buildEdgeTimeline(root.left, tree);
        if (root.parent !== null){
            const x1 = tree.x_distances.get(`insert-node${root.parent.id}`); 
            const y1 = root.parent.level * VERTICAL_SPACING + NODE_RADIUS;
            const x2 = tree.x_distances.get(`insert-node${root.id}`);
            const y2 = root.level * VERTICAL_SPACING + NODE_RADIUS;
            const curr_opacity = parseFloat(document.getElementById(`insert-path${root.id}`).getAttribute('opacity'));
            const isNew = curr_opacity > 0.7 ? false : true;
            this.insertTimeline.add({
                targets: `#insert-path${root.id}`,
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
        const node = document.getElementById(`insert-node${root.id}`);
        const x = shift_x - NODE_RADIUS;
        const isNew = root.parent !== null && root.line === null ? true : false;
        tree.x_distances.set(`insert-node${root.id}`, x );
        root.parent !== null && root.line === null && addPathToDom(root);
        root.line = root.line === null && `insert-line${root.id}`;
        if (isNew){
            this.insertTimeline.add({
                targets: `#insert-node${root.id}`,
                marginLeft: { value: `${-node.getBoundingClientRect().width}px`, duration: 0 },
                keyframes: [
                    { scale: isNew ? 0 : 1, duration: 0 },
                    { translateX: isNew ? 0 : shift_x, translateY: root.level * VERTICAL_SPACING,  scale: 1, duration: 800 },
                    { translateX: shift_x, translateY: root.level * VERTICAL_SPACING, delay: 200, duration: 800 }
                ],
                easing: 'easeInOutExpo',
            }, traverseCount * TRAVERSE_DURATION);
        } else {
            this.insertTimeline.add({
                targets: `#insert-node${root.id}`,
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

    async formatBinaryTree(tree){
        if (tree.root !== null){
            this.buildNodeTimeline(tree.root, tree);
            this.buildEdgeTimeline(tree.root, tree);
        }
        this.insertTimeline.play();
        await this.insertTimeline.finished;
        this.insertTimeline = anime.timeline({});
        return;
    }

    addTraverseStep(node, shift_order){
        this.insertTimeline.add({
            targets: `#insert-node${node.id}`,
            keyframes: [
                { scale: 1 },
                { scale:1 },
            ],
            easing: 'easeInOutBack',
            duration: TRAVERSE_DURATION,
        }, (traverseCount + shift_order) * TRAVERSE_DURATION);
        this.insertTimeline.add({
            targets: `#insert-frontnode${node.id}`,
            keyframes: [
                { background: '#3C5B6F' },
                { background: ' ' },
            ],
            easing: 'easeInOutBack',
            duration: TRAVERSE_DURATION,
        }, (traverseCount + shift_order) * TRAVERSE_DURATION);
        if (node.parent !== null && shift_order === 0) {
            this.insertTimeline.add({
                targets: `#insert-path${node.id}`,
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
        this.insertTimeline.add({
            duration: TRAVERSE_DURATION,
            complete: () => {
                setCaptionLine(lineNumber)
            }
        }, (traverseCount-1) * TRAVERSE_DURATION + delay * (TRAVERSE_DURATION/divisor))
    }
}
class BstInsertDemo extends Component {    
    constructor (props) {
        super(props);
        this.animator = new Animator();
        this.state = {
            bst: new BinarySearchTree(this.animator, (x) => this.setState({ currentLine: x })),
            count: 0,
            disable: true,
            numActiveNodes: 0,
            treeHeight: 0,
            formatting: true,
            autoNodes: [],
        };
        this.calculateShiftX = this.calculateShiftX.bind(this);
        this.onResize = this.onResize.bind(this);
        this.autoInsert = this.autoInsert.bind(this);
        this.autoClear = this.autoClear.bind(this);
    }

    async componentDidMount(){
        window.addEventListener('resize', this.onResize);
        shift_x = getWidthMidpoint(document.getElementById('insert-nodecontainer'));
        traverseOn = true;
        const nodeValues = [306, 427, 217, 371];
        this.state.bst.insert(nodeValues.shift(), this.state.count);
        this.setState({
            count: this.state.count + 1, 
            numActiveNodes: 1, 
            treeHeight: 1,
            autoNodes: nodeValues,
        });
        shift_x = this.calculateShiftX(document.getElementById('insert-nodecontainer'));
        await this.animator.formatBinaryTree(this.state.bst);
        this.setState({ disable: false });
        window.addEventListener('insert-insertReady', this.autoInsert);
        window.addEventListener('insert-clearReady', this.autoClear);
        dispatchEvent(new Event('insert-insertReady'));
    }

    async autoInsert(){
        traverseCount = 0;
        this.state.bst.insert(this.state.autoNodes.shift(), this.state.count + 1);
        this.setState({ count: this.state.count + 1 });
        shift_x = this.calculateShiftX(document.getElementById('insert-nodecontainer'));
        setTimeout(() => { this.setState({ treeHeight: this.state.bst.getTreeHeight()}) }, 200);
        await this.animator.formatBinaryTree(this.state.bst);
        this.state.autoNodes.length > 0 ? dispatchEvent(new Event('insert-insertReady')) : dispatchEvent(new Event('insert-clearReady'));
    }

    async autoClear(){
        traverseCount = 0;
        this.animator.timeline = anime.timeline({ autoplay: false });
        await this.state.bst.tearDownTree();
        this.setState({ autoNodes: [306, 427, 217, 371], bst: new BinarySearchTree(this.animator, (x) => this.setState({ currentLine: x }))});
        dispatchEvent(new Event('insert-insertReady'));
    }

    componentWillUnmount() {
        window.removeEventListener('insert-insertReady', this.autoRemove);
        window.removeEventListener('insert-clearReady', this.autoInsert);
        window.removeEventListener('resize', this.onResize);
    }

    calculateShiftX(nodeContainer) {
        const rightOverflow = Math.min(0, getWidthMidpoint(nodeContainer) - BinarySearchTree.sizeOfSubtree(this.state.bst.root.right) * HORIZONTAL_SPACING - NODE_RADIUS);
        return 20 + Math.max(NODE_RADIUS, getWidthMidpoint(nodeContainer) - BinarySearchTree.sizeOfSubtree(this.state.bst.root.left) * HORIZONTAL_SPACING + rightOverflow);
    }

    toggleTraverseOn(){ traverseOn = !traverseOn; }
    
    onResize(){
        if (this.state.bst.root === null) return;
        clearTimeout(resizeTimer);
        shift_x = this.calculateShiftX(document.getElementById('insert-nodecontainer'));
        resizeTimer = setTimeout(async () => {
            this.animator.insertTimeline = anime.timeline({ autoplay: false });
            await this.animator.formatBinaryTree(this.state.bst);
        }, 500);
    }

    render(){ 
        return(
            <div style={{ marginTop: '2rem' }}>
                <div className="demo-nodecontainer" id="insert-nodecontainer" style={{ height: `${(this.state.treeHeight - 1)*70 + 100}px`}} >
                    <svg className="linecontainer" id="insert-svg-line" />                    
                </div>
            </div>

        );
    }
}

export default BstInsertDemo;