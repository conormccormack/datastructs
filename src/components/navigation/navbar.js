import React from "react";
import '../../css/navbar.css';
import styled from 'styled-components';
import HomeButton from "../homebutton";
import NavItem from './navitem.js'
import Searchbar from "../searchbar";
import Dropdown from './dropdown';

const NavLayout = styled.div`
    padding-top: 10px;
    padding-left: 90px;
    padding-right: 90px;
    display: flex;
    justify-content: flex-start;
    grid-template-columns: repeat(5,200px);
    height: 50px;
`
const SearchbarContainer = styled.div`
    margin-left: auto;
    margin-right: 10px;
`


function Navbar(){
    return (
        <NavLayout className='nav-container'>
            <HomeButton/>
            <NavItem link={'about'} text='about'/>
            <NavItem link={'#'} text='explore'>
                <Dropdown/>
            </NavItem>
            
            <SearchbarContainer>
                <Searchbar/>
            </SearchbarContainer>
        </NavLayout>
    );
}

export default Navbar;