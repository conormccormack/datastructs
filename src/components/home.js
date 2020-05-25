import React from 'react';
import Navbar from "./navbar";
import styled from 'styled-components';
import Mainlanding from "./mainlanding";

const GridContainer = styled.div`
    display: grid;
`

function Home() {
    return (
        <GridContainer>
            <Navbar/>
            <Mainlanding/>
        </GridContainer>
    );
}

export default Home;