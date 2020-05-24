import React from 'react';
import Navbar from './navbar';
import styled from 'styled-components';

const AboutContainer = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
`

function About (){
    return(
        <AboutContainer>
            <Navbar/>
            This is the about page
        </AboutContainer>
    )
}

export default About;