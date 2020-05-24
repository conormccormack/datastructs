import React from 'react';
import styled from 'styled-components';
import Navbar from "./navbar";

const PremiumContainer = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`

function Premium(){
    return(
        <PremiumContainer>
            <Navbar/>
            This is the premium landing site.
        </PremiumContainer>
    )
}

export default Premium;