import React from 'react';
import Navbar from "./navbar";
import styled from 'styled-components';
import MainLanding from "./MainLanding";

const gridContainer = styled.div`
    display: grid;
`

function Home() {
    return (
        <gridContainer>
            <Navbar/>
            <MainLanding/>
        </gridContainer>
    );
}

export default Home;