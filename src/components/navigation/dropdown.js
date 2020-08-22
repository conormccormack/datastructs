import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/navbar.css';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as BackArrow } from  '../../resources/icons/arrow.svg';
import { ReactComponent as TreeIcon } from  '../../resources/icons/treeicon.svg';
import { ReactComponent as HomeIcon } from  '../../resources/icons/house.svg';
import { ReactComponent as AboutIcon } from '../../resources/icons/question.svg';
import { ReactComponent as RightChevron } from '../../resources/icons/chevron.svg';
 
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
                {props.leftIcon && <span className='icon-button'>{props.leftIcon}</span>}
                {props.children}
                {props.rightIcon && <span className='icon-right'>{props.rightIcon}</span>}
            </Link>
        )
    }

    function DropdownSectionTitle(props){
        return(
            <Link className='section-title'> 
                {props.leftIcon && <span className='back-button icon-button' onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>{props.leftIcon}</span>}
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
                    <DropdownItem leftIcon={<HomeIcon/>} link={'/'}>home</DropdownItem>
                    <DropdownItem leftIcon={<TreeIcon/>} rightIcon={<RightChevron/>} goToMenu='trees'>trees</DropdownItem>
                    <DropdownItem leftIcon={<AboutIcon/>} link={'about'}>about</DropdownItem>
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
                    <DropdownItem link={'avl'}>AVL Trees</DropdownItem>
                </div>
            </CSSTransition>

        </div>
    )
}

export default Dropdown;