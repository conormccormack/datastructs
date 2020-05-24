import React from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.div`
    font-size: 18px;
    vertical-align: text-bottom;
    font-family: Raleway, sans-serif;
    padding-top: 4px;
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
            return props.nextPage.replace(/\W/g, '')
        }
    }
    const nextPage = parseNextPageLink()
    return (
        <Button>
            <Link style={{textDecoration:'None' , color:'black'}} to={nextPage}>{props.nextPage}</Link>
        </Button>
    )
}

export default NavigationButton;