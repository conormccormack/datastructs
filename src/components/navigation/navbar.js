import React from "react";
import HomeButton from "../homebutton";
import NavItem from './navitem.js'
import Searchbar from "../searchbar";
import Dropdown from './dropdown';
import '../../css/navbar.css';

function Navbar(){
    return (
        <div className='nav-container'>
            <HomeButton/>
            <NavItem link={'about'} text='about'/>
            <NavItem link={'#'} text='explore'>
                <Dropdown/>
            </NavItem>
            <Searchbar/>
        </div>
    );
}

export default Navbar;