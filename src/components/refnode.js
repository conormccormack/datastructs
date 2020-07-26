import React from 'react';
import { gsap } from 'gsap';
import '../css/bst.css';
import { Transition } from 'react-transition-group';

const RefNode = React.forwardRef((props, ref) => {
    return(
        <Transition 
            key={props.key}
            in={props.node.show}
            mountOnEnter
            unmountOnExit
            addEndListener={(node, done) => {
                if (props.node.isNew){                    
                    gsap.from(
                        node,
                        .5,
                        {
                            scale: 0, 
                            ease: 'back.out(2)',
                            onComplete: done,
                        }
                    )
                } else {
                    console.log(`not new`)
                    gsap.to(
                        node,
                        .3,
                        {
                            autoAlpha: props.node.show ? 1 : 0,
                        }
                    )
                }
            }}
        >   
            {state => (
                <>
                    {state}
                    <div id={`node${props.node.id}`} ref={ref} style={{ marginLeft: '-60px' }}  className='bstnode'>{props.node.value}</div>
                </>
            )}
       </Transition>
    )
});

export default RefNode;