import React from 'react';
import styled from "styled-components";

const MainGraphic = styled.div`
    width: 300px;
    padding-right: 100px;
    margin-left: auto;
    grid-row: 1 / 2;
    grid-column: 3 / 4;
    
`

function AboutMainGraphic () {

    return (
        <MainGraphic>
            <img src={require('../resources/images/darklogotag.svg')} alt='darklogo'/>
        </MainGraphic>
    )

}

export default AboutMainGraphic;
