import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/navbar.css';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as BackArrow } from  '../../resources/icons/arrow.svg';

function Dropdown (props) {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el){
        setMenuHeight(el.offsetHeight);
    }

    function DropdownItem(props){
        return(
            <Link className='link menu-item' 
                to={props.link} onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
            > 
                    {props.children}
            </Link>
        )
    }

    function DropdownSectionTitle(props){
        return(
            <Link className='section-title'> 
                {props.leftIcon && <span className='icon-button' onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>{props.leftIcon}</span>}
                <span style={{fontFamily: 'Raleway'}}>{props.children}</span>
            </Link>
        )
    }

    return (
        <div className='dropdown' style={{height: menuHeight}} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === 'main'}
                unmountOnExit
                timeout={500}
                classNames='menu-primary'
                onEnter={calcHeight}
            >
                <div className="menu">
                    <DropdownSectionTitle>Explore</DropdownSectionTitle>
                    <DropdownItem link={'/'}>home</DropdownItem>
                    <DropdownItem goToMenu='trees'>trees</DropdownItem>
                    <DropdownItem link={'about'}>about</DropdownItem>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'trees'} 
                unmountOnExit
                timeout={500}
                classNames='menu-secondary'
                onEnter={calcHeight}
            >
                <div className="menu">
                    <DropdownSectionTitle leftIcon={<BackArrow/>} goToMenu='main'>Trees</DropdownSectionTitle>
                    <DropdownItem link={'bst'}>Binary Search Tree</DropdownItem>
                </div>
            </CSSTransition>

        </div>
    )
}

export default Dropdown;