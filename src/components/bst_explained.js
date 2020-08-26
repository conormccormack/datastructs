import React from 'react';
import '../css/explanations.css';
import BstDemo from './home/bstdemo.js';
import BstInsertDemo from './bstinsertdemo';
import BstDegenerateDemo from './bstdegeneratedemo';

function BstExplained() {
    
    return (
        <div className='explanation-content'>
            <div>
                <div className='algorithm-grid'>
                    <div className='explanation-intro'>
                        <div className='explanation-title'> 
                            nice, but why? 
                        </div>
                        Binary search trees are the foundation for many more advanced data structures that are used all the time in production environments to organize data in a way that offers quick (often logarithmic) lookup, insertion, and removal.
                        <br/><br/>
                        If you’re already familiar with the binary search algorithm for finding elements in a sorted list, understanding how we construct binary search trees should come very naturally. Binary search trees abide by the following simple rules:
                        <div className='subsection-grid'>
                            <div id='bst-rules'>
                                <ul>
                                    <li>
                                        any node <strong>v</strong> has connections to at most two nodes said to be its "left" and "right" children
                                    </li>
                                    <br/>
                                    <li>
                                        for a given node <strong>v</strong>, any node with a smaller key value lives in the 	<strong>v</strong>’s left subtree       and   any node with a great key 
                                        value lives in <strong>v</strong>’s right subtree.
                                    </li>
                                </ul>
                            </div>
                            <div style={{width: '100%'}}>
                                <img id='bst-rules-img' src={require("../resources/images/rule.png")} alt="bst rule"/>
                            </div>
                        </div>

                        Given this rule, looking for a key in our tree is as simple as looking to our left if the value is smaller than the key we’re currently looking at and looking to our right if it is bigger than our current key.
                        The algorithms for insertion and deletion are naturally straightforward given the construction of the binary search tree.
                    </div>
                    <div className='explanation-section'>
                        <div className='explanation-subtitle'>Summary</div>
                        Binary Search Trees typical offer the following operations:
                        <ul>
                            <li>insert(node): O(n) <span className='question'>?</span><span className='hidden'>Confused by this?</span> </li>
                            <li>search(key): O(n)  <span className='question'>?</span> </li>
                            <li>delete(key): O(n) <span className='question'>?</span> </li>
                        </ul>
                        <BstDemo maxHeight={4} maxNodes={4}/>
                    </div>
                </div>
                <div className='algorithm-grid'>
                    <div className='explanation-section'>
                        <div className='explanation-subtitle'>Insertion:</div>
                        Start at the top of the tree (the root). If the key you’re inserting is smaller than the root’s key, look to your left for a new spot. Likewise, if it is larger than the root,’s key look right. If the root has no child in this new spot, simply insert the new node as the appropriate left or right child of the root. Otherwise, keep searching left and right now starting from the node that already exists in the spot you found. 
                        <BstInsertDemo/>
                    </div>
                    <div className='explanation-section'>
                        <div className='explanation-subtitle'>Deletion:</div>
                        Start at the top of the tree (the root). If the key you’re deleting is smaller than the root’s key, look to your left. Likewise, if it is larger than the root’s key, look right. If the root has no child in this spot, the key you’re looking for does not exist in the tree. Otherwise, keep searching left and right now starting from the node that already exists in the spot you found. 

                        Once you found the node with the key you’re looking for, you’re ready to remove it from the tree, but there are three cases you must consider:
                        If the node you’re about to delete has
                        <ol>
                            <li>
                                No children, then go ahead and delete it.
                            </li>
                            <li>
                                One child, then connect that child to the parent of the node you’re about to delete
                            </li>
                            <li>
                                Two children, then find the nodes successor by looking right once and recursively looking left. With the successor found, you can:
                                <ol>    
                                    <li>
                                        Swap the node you are about to delete with its successor, and delete the node in its swapped position or...
                                    </li>
                                    <li>
                                        Replace the value of your node with that of its successor and then delete the original successor node.
                                    </li>
                                </ol>
                            </li>
                        </ol>
                    </div>
                </div>
                <div className='explanation-section'>

                <div className='explanation-subtitle'>Limitations:</div>
                    As great as binary search trees can be, their most basic form is far from perfect. Vanilla BST’s can quickly become degenerate if they have no self-balancing mechanism.

                    Degenerate binary search trees offer little to no advantage over linked lists since any operation may have to traverse every node in the tree in order complete, which gives us O(n) linear complexity. 

                    However, if trees remain balanced and non-degenerate, we can guarantee logarithmic complexity for every operation as the tree height of a complete binary tree of size <strong>n</strong> is only O(log <strong>n</strong>). Intuitively, this makes sense, as every time we choose to go search left or right when traversing a binary search tree, we are eliminating half of the possible spots in our search space, just as we do in the binary search algorithm.

                    Advanced implementations of binary search trees, as mentioned earlier, include self-balancing in order to guarantee logarithmic runtimes. Examples of this include AVL Trees and Red-Black Tress, which are coming to DataStructs soon. 
                    <br/><br/>
                    Below is an example of a binary search tree quickly becoming degenerate, where the height is always equal to the number of nodes in the tree. 
                    <BstDegenerateDemo/>
                </div>

            </div>
        </div>
    )
}

export default BstExplained;