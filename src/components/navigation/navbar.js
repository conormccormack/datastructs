import React, { useState } from "react";
import HomeButton from "../homebutton";
import NavItem from './navitem.js'
import Searchbar from "../searchbar";
import Dropdown from './dropdown';
import '../../css/navbar.css';

function Navbar(){
    const [ hideExplore, setHideExplore ] = useState(false);
    return (
        <div className='nav-container'>
            <HomeButton/>
            <NavItem link={'about'} text='about'/>
            { !hideExplore && <NavItem link={'#'} text='explore'>
                <Dropdown/>
            </NavItem>}
            <Searchbar setHideExplore={(x) => setHideExplore(x)}/>
        </div>
    );
}

export default Navbar;