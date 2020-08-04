import anime from 'animejs';

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

export default class BinarySearchTree {
    constructor() {
        this.root = null;
        this.numActiveNodes = 0;
        this.x_distances = new Map();
    }

    updateLevels(root, level){
        root.level = level;
        if (root.right !== null) this.updateLevels(root.right, level + 1);
        if (root.left !== null) this.updateLevels(root.left, level + 1 );
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
            this.root = newNode;
            addMessageToLog(`Tree empty: inserting ${value} as root.`, 'end');
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
        if (traverseOn) addTraverseStep(root, 0);
        if (newNode.value === root.value) {
            return false;
        } else if (newNode.value < root.value){
            if (root.left !== null) {
                newNode.level = newNode.level + 1;
                addMessageToLog(`${newNode.value} < ${root.value}, search left.`);
                return this.insertNode(root.left, newNode, count);
            } else { 
                root.left = newNode; 
                newNode.parent = root;
                addMessageToLog(`${newNode.value} < ${root.value}, insert as left leaf.`, 'end');
                this.numActiveNodes += 1;
                addNodeToDOM(newNode.value, count);
                return true;
            }
        } else if (newNode.value > root.value){
            if (root.right !== null) {
                newNode.level = newNode.level + 1;
                addMessageToLog(`${newNode.value} > ${root.value}, search right.`);
                return this.insertNode(root.right, newNode, count);
            } else { 
                root.right = newNode; 
                newNode.parent = root;
                addMessageToLog(`${newNode.value} > ${root.value}, insert as right leaf.`, 'end');
                this.numActiveNodes += 1;
                addNodeToDOM(newNode.value, count);
                return true;
            }
        }
    }

    removeRecurse(root, value){
        if (root !== null && traverseOn) addTraverseStep(root, 0);
        if (root === null) {
            addMessageToLog(`${value} not found.`, 'end');
            return false;
        } else if (value < root.value) {
            addMessageToLog(`${value} < ${root.value}, search left.`);
            return this.removeRecurse(root.left, value);
        } else if (value > root.value) {
            addMessageToLog(`${value} >= ${root.value}, search right.`);
            return this.removeRecurse(root.right, value);
        } else {
            this.deleteNode(root);
            this.numActiveNodes -= 1;
            addMessageToLog(`Found ${value}: removing ${value} from tree.`, 'end');
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

    async tearDownTree(){
        if (this.root === null) return;
        this.buildTearDownAnimation(this.root);
        formatTimeline.play();
        await formatTimeline.finished;
        formatTimeline = anime.timeline({ autoplay: false });
        return;
    }

    buildTearDownAnimation(node){
        formatTimeline.add({
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
        if (node !== this.root) {
            formatTimeline.add({
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
        if (node.left !== null) this.buildTearDownAnimation(node.left);
        if (node.right !== null) this.buildTearDownAnimation(node.right);
    }

    findLeftmost(root){
        return root.left === null ? root : this.findLeftmost(root.left);
    }
}

