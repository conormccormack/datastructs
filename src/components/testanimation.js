import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Navbar from "./navbar";

const TestSandbox = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
    grid-template-columns: 1fr 1fr;
    display: grid;
`

const ListWrapper = styled.div`
    height: 200px; 
    width: 100px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

const DisplayNode = styled.div`
    background-color: #D8BBFF; 
    border-radius: 50%;
    margin: 20px;
    height: 100px; 
    width: 100px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`

const NodeContent = styled.div`
    text-align: center;
    vertical-align: middle;
    font-size: 30px;
    font-family: Helvetica;
    color: #FFF;
`

const Margin20 = styled.div`
    margin: 20px;
`


// class Node {
//     constructor(data, left = null, right = null) {
//         this.data = data;
//         this.leftChild = left;
//         this.rightChild = right;
//     }
// }

// const TemplateTree = [
//     {
//         data: 10,
//         left: {
//             data: 2,
//             left: null,
//             right: null,
//         },
//         right: {
//             data: 12,
//             left: null,
//             right: null,
//         },
//     }
// ];


function TestAnimation(){
    const [numberNodes, setNumberNodes] = useState(0);
    const [inputValue, setInputValue ] = useState('');
    const [tree, setTree] = useState({});
    // const [tree, setTree] = useState(
    //     {
    //         data: 10,
    //         left: {
    //             data: 8,
    //             left: {
    //                 data: 5,
    //                 left: null,
    //                 right: null,
    //             },
    //             right: {
    //                 data: 9,
    //                 left: null,
    //                 right: null,
    //             },
    //         },
    //         right: {
    //             data: 16,
    //             left: {
    //                 data: 12,
    //                 left: null,
    //                 right: null,
    //             },
    //             right: {
    //                 data: 18,
    //                 left: null,
    //                 right: null,
    //             },
    //         }
    //     }
    // );


    class Node {

    }


    // class BinarySearchTree {
    //
    //     insert(data) {
    //         const newNode = new Node(data);
    //         this.insertNodeToTree(this.root, newNode);
    //     }
    //
    //     insertNodeToTree(node, newNode){
    //         if (newNode.data < node.data){
    //             if (node.left == null) node.left = newNode;
    //             else this.insertNodeToTree(node.left, newNode);
    //         } else {
    //             if (node.right == null) node.right = newNode;
    //             else this.insertNodeToTree(node.right, newNode);
    //         }
    //     }
    //
    //     constructor(tree){
    //         this.data = tree.data;
    //         if (tree.left != null) this.insertNodeToTree({ data: tree.data, left:  }, tree.left);
    //         if (tree.right != null) this.insertNodeToTree(this.data, tree.right);
    //         console.log(tree);
    //     }
    //
    // }

    //0                        0                                  -0
    //1              1                      2                     -2
    //2        3          4            5             6            -4
    //3    7    8      9     10      11     12       13      14   -8
    //4 15 16 17 18  19 20  21 22   23 24  25 26  27 28    29 30  -16
    //
    // 2^(n)
    //
    //0                        0                                  -0
    //1              1                                            -1
    //2        3          4                                       -2
    //3    7    8      9     10                                   -4
    //4 15 16 17 18  19 20  21 22                                 -8
    //
    //                         0
    //                     1        2
    //                3      4      5    6
    //             7   8   9  10  11 12 13 14
    //
    //                  0
    //            1
    //         3
    //       7   8
    //
    //                  0
    //             1         2
    //          3    4     5   6
    //
    //  find left child:  2n + 1
    //  find right child: 2n + 2
    //  find parent:      n-1 / 2



    const insertNode = () => {
        if (Object.keys(tree).length === 0){
            setTree({ data: inputValue, left: null, right: null });
        } else {

        }


        // let newTree = new BinarySearchTree(tree);
        // newTree.insert(inputValue);
        // setTree(newTree);

        // let newTree = tree;
        // console.log(newTree);
        // if (inputValue >= newTree.data){
        //     // Base case: create leaf node.
        //     if (newTree.right == null){
        //         newTree.right = {
        //             data: inputValue,
        //             left: null,
        //             right: null,
        //         };
        //         return newTree;
        //     }
        //     else {
        //         return insertNode(newTree.right);
        //     }
        // } else {
        //     // Base case: create leaf node.
        //     if (newTree.left == null){
        //         newTree.left = {
        //             data: inputValue,
        //             left: null,
        //             right: null,
        //         };
        //         return newTree;
        //     } else {
        //         return insertNode(newTree.right);
        //     }
        // }
    };


    const onInsertDown = event => {
        event.preventDefault();
        insertNode();
        setNumberNodes(numberNodes => numberNodes + 1);
    };

    const handleChange = event => setInputValue(parseInt(event.target.value));

    return (
        <div>
            <Navbar/>
            <TestSandbox>
                <ListWrapper>
                    <Margin20>
                        { Object.keys(tree).length > 0 &&  BinaryTree(tree)}
                    </Margin20>
                </ListWrapper>
                <form style={{paddingLeft:'100px'}} onSubmit={onInsertDown}>
                    <label>
                        <input type='text' value={inputValue} onChange={handleChange}></input> Input
                    </label>
                    <p>Number of Nodes: {numberNodes}</p>
                </form>
            </TestSandbox>
        </div>
    )
}

// Recursion
function BinaryTree (tree) {
    return(
        <div>
            <ul>
                <Margin20>
                    <motion.div initial={{scale: 0}} animate={{scale: 1}} whileHover={{scale: 1.5}}>
                        <DisplayNode>
                            <NodeContent>{tree.data}</NodeContent>
                        </DisplayNode>
                    </motion.div>
                </Margin20>
                { tree.left && BinaryTree(tree.left) }
                { tree.right && BinaryTree(tree.right) }
            </ul>
        </div>
    )
}

export default TestAnimation;