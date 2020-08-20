import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import '../../resources/fonts/fontawesome/css/all.css';

const Button = styled.div`
    font-size: 16px;
    vertical-align: text-bottom;
    font-family: Raleway, sans-serif;
    font-weight: 500;
    padding-top: 8px;
    padding-left: 15px;
    padding-right: 15px;
`

function NavItem(props){
    const [ open, setOpen ] = useState(false);
    return (
        <Button>
            {props.link !== '#' ?
                <Link style={{textDecoration:'None' , color:'black'}} to={props.link}> 
                    {props.text}
                </Link> :
                <Link style={{textDecoration:'None' , color:'black'}} onClick={() => { setOpen(!open) } }>
                    {props.text}
                </Link>
            }
            {open && props.children}
        </Button>
    )
}

export default NavItem;