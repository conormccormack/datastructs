import React from "react";
import '../../css/navbar.css';
import styled from 'styled-components';
import HomeButton from "../homebutton";
import NavItem from './navitem.js'
import Searchbar from "../searchbar";
import Dropdown from './dropdown';
// import LoginRegister from "../login_register_button";

const NavLayout = styled.div`
    padding-top: 10px;
    padding-left: 100px;
    padding-right: 100px;
    display: flex;
    justify-content: flex-start;
    background-color: #ece7e3;
    grid-template-columns: repeat(5,200px);
    height: 50px;
`
const SearchbarContainer = styled.div`
    margin-left: auto;
    margin-right: 10px;
`


function Navbar(){
    return (
        <nav role='navigation'>
            <NavLayout>
                <HomeButton className="homeLink"/>
                <NavItem link={'about'} text='about'/>
                <NavItem link={'#'} text='explore'>
                    <Dropdown/>
                </NavItem>
                
                <SearchbarContainer>
                    <Searchbar/>
                </SearchbarContainer>
                {/* <LoginRegister/> */}
            </NavLayout>
        </nav>
    );
}

export default Navbar;