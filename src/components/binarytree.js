import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import '../css/bst.css'
import styled from 'styled-components';

// Build and maintain state as array.
// Each element in array represents a level on the tree.

function BinaryTree (props){
    // Return level on tree given id
    const computeLevel = id => (Math.floor(Math.log2(id + 1)));
    // Compute left-right zero based index of id on its level in the tree.
    const computeIndexOnLevel = (id, level) => (id + 1 - Math.pow(2,level));

    return(
            <AnimatePresence>
                {props.displayNodes}
            </AnimatePresence>
    )

}

export default BinaryTree;