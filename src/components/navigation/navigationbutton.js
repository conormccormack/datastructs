import React from 'react';
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

function NavigationButton(props){
    const parseNextPageLink = () => {
        if (props.nextPage.includes('everything')){
            return '/catalog?view=all'
        } else if (props.nextPage.includes('explore')){
            return `/catalog?view=${props.exploreCategory}`
        } else {
            return `/${props.nextPage.replace(/\W/g, '')}`
        }
    };

    const nextPage = parseNextPageLink();
    const isExplore = props.nextPage.includes('ex');

    return (
        <Button>
            <Link style={{textDecoration:'None' , color:'black'}} to={nextPage}> {props.nextPage}
                {isExplore ? <i className="fas caret fa-caret-down"/> : ''}
            </Link>
        </Button>
    )
}

export default NavigationButton;