import React from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import styled from "styled-components";
import '../css/bst.css'

const variants = {
    position: i => ({
        scale: 1,
        x: i * 20,
        y: i * 20,
    })

};

//style={{float: 'left'}} exit={{ scale: 0}} initial={{ scale: 0}}
//                      animate={{ scale: 1, x: props.shift, y: props.shift}} whileHover={{scale: 1.25}}

function BSTNode (props) {
    const id = props.id;
    return(
        <motion.div className="bstnode" style={{float: 'left'}} exit={{ scale: 0}} initial={{ scale: 0}}
                                  animate={{ scale: 1, x: props.shift, y: props.shift}} whileHover={{scale: 1.25}}>
                {props.data}
        </motion.div>
    )
}

export default BSTNode;