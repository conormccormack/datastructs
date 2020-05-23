import React from "react";
import '../css/navbar.css'
import styled from 'styled-components'
import HomeButton from "./homebutton";


const NavLayout = styled.div`
    padding: 20px;
    display: grid;
    background-color: #EEF0F2;
    grid-template-columns: 1fr  1fr 1fr;
    font-family: PoiretOne;
    height: 50px;
`

const ControlButton = styled.div`
    font-size: 1.5em;
    vertical-align: text-bottom;
`

function Navbar(){
    return (
        <NavLayout>
            <HomeButton className="homeLink"/>
            <ControlButton>
                Categories
            </ControlButton>
            <ControlButton>
                Premium
            </ControlButton>
        </NavLayout>
    );
}

export default Navbar;