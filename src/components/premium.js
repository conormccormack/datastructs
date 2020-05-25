import React from 'react';
import styled from 'styled-components';
import Navbar from "./navbar";

const PremiumContainer = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`
const PremiumHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 80px;
    padding-left: 100px;
`

function Premium(){
    return(
        <PremiumContainer>
            <Navbar/>
            <PremiumHeadline>Premium</PremiumHeadline>
        </PremiumContainer>
    )
}

export default Premium;