import React from 'react';
import {motion} from 'framer-motion';
import '../css/bst.css'

// 


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