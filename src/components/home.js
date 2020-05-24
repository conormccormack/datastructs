import React from 'react';
import Navbar from "./navbar";
import styled from 'styled-components';
import Mainlanding from "./mainlanding";

const gridContainer = styled.div`
    display: grid;
`

function Home() {
    return (
        <gridContainer>
            <Navbar/>
            <Mainlanding/>
        </gridContainer>
    );
}

export default Home;