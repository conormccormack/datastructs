import React from "react";
import '../css/navbar.css'
import styled from 'styled-components'
import HomeButton from "./homebutton";
import NavigationButton from './navigationbutton';
import Searchbar from "./searchbar";

const NavLayout = styled.div`
    padding-top: 10px;
    padding-left: 100px;
    padding-right: 100px;
    display: flex;
    justify-content: flex-start;
    background-color: #EFE7E2;
    grid-template-columns: repeat(5,200px);
    height: 50px;
`
const SearchbarContainer = styled.div`
    margin-left: auto;
`

function Navbar(){
    return (
        <nav>
            <NavLayout>
                <HomeButton className="homeLink"/>
                <NavigationButton nextPage="about"/>
                <NavigationButton nextPage="explore"/>
                <NavigationButton nextPage="everything else"/>
                <NavigationButton nextPage="premium"/>
                <SearchbarContainer>
                    <Searchbar/>
                </SearchbarContainer>
            </NavLayout>
        </nav>
    );
}

export default Navbar;