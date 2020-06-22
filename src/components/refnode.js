import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import '../css/bst.css';
import styled from 'styled-components';

const RefNode = React.forwardRef((props, ref) => {
    return(
        <div id={`node${props.node.id}`} style={{ marginLeft: '-60px' }} ref={ref} className='bstnode'>{props.node.value}</div>
    )
});

export default RefNode;