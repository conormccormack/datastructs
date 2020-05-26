import React from 'react';
import Navbar from "../navbar";
import styled from 'styled-components';
import Mainlanding from "../mainlanding";

const HomeContainer = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
`

function Home() {
    return (
        <HomeContainer>
            <Navbar/>
            <Mainlanding/>
        </HomeContainer>
    );
}

export default Home;