import React from 'react';
import styled from "styled-components";
import '../css/navbar.css';
import '../resources/fonts/fontawesome/css/all.css';

const RalewayFont = styled.div`
    font-size: 16px;
    vertical-align: text-bottom;
    font-family: Raleway, sans-serif;
    font-weight: 500;
    padding-top: 8px;
    padding-left: 15px;
    padding-right: 15px;
`

function ExlporeDropdown(){
    return (
        <RalewayFont>
            <div className='title'>explore<i className="fas caret fa-caret-down"/></div>
            <ul>
                <li>Stacks</li>
                <li>Queues</li>
                <li>Graphs</li>
                <li>Binary Trees</li>
            </ul>
        </RalewayFont>
    )
}

export default ExlporeDropdown;