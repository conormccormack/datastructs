import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import '../../resources/fonts/fontawesome/css/all.css';
import '../../css/navbar.css'

function NavItem(props){
    const [ open, setOpen ] = useState(false);
    return (
        <div className={`nav-button ${props.text === 'about' && 'about-nav'}`}>
            {props.link !== '#' ?
                <Link className='link' to={props.link}> 
                    {props.text}
                </Link> :
                <Link to={'#'} className='link' onClick={() => { setOpen(!open) } }>
                    {props.text}
                </Link>
            }
            {open && props.children}
        </div>
    )
}

export default NavItem;