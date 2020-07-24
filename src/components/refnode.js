import React from 'react';
import { gsap } from 'gsap';
import '../css/bst.css';
import { Transition } from 'react-transition-group';

const RefNode = React.forwardRef((props, ref) => {
    return(
        <Transition 
            key={props.key}
            mountOnEnter
            unmountOnExit
            addEndListener={(node, done) => {
                gsap.from(
                    node,
                    .5,
                    {
                        scale: 0, 
                        ease: 'back.out(2)',
                        onComplete: done,
                    }
                )
            }}
        >   
       <div id={`node${props.node.id}`} style={{ marginLeft: '-60px' }} ref={ref} className='bstnode'>{props.node.value}</div>
       </Transition>
    )
});

export default RefNode;