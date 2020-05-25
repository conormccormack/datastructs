import React from 'react';
import Navbar from './navbar';
import styled from 'styled-components';
import '../css/about.css';

const AboutContainer = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
`
const AboutHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 80px;
    padding-left: 100px;
`

const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`

const AboutMessage = styled.div`
    padding-right: 30px;
    grid-column: 1 / 3;
`

const AboutBody = styled.div`
    padding-left: 100px;
    font-family: Raleway;
    font-size: 16px;
    font-weight: 500;
`
const MainGraphic = styled.div`
    width: 300px;
    padding-right: 100px;
    margin-left: auto;
    grid-row: 1 / 2;
    grid-column: 3 / 4;
    
`

const GitHubLink = styled.a`
    text-decoration: none;
    color: black;
    hover: 
`

function About (){
    return(
        <AboutContainer>
            <Navbar/>
            <MainWrapper>
                <AboutMessage>
                    <AboutHeadline>
                        About
                    </AboutHeadline>
                    <AboutBody>
                        DataStructs is a beautiful, intuitive platform for vizualizing data structures and algorithms.<br/>
                        <br/>
                        As of May 2020, DataStructs is built around React, animated with Anime.js, and hosted on AWS Amplify.
                        <br/><br/>
                        <GitHubLink className="hoverHighlit" href='https://github.com/conormccormack/datastructs'>
                            <i className="fab fa-github"></i> View this project on <strong>Github</strong>
                        </GitHubLink> @conormccormack/datastructs
                    </AboutBody>
                </AboutMessage>
                <MainGraphic>
                    <img src={require('../resources/images/darklogotag.svg')} alt='darklogo'/>
                </MainGraphic>
            </MainWrapper>
        </AboutContainer>
    )
}

export default About;