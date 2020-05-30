import React from 'react';
import styled from "styled-components";

const MainGraphic = styled.div`

`

function AboutMainGraphic () {

    return (
        <MainGraphic>
            <img src={require('../resources/images/darklogotag.svg')} alt='darklogo'/>
        </MainGraphic>
    )

}

export default AboutMainGraphic;
