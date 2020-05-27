import React from 'react';
import Navbar from './navbar';
import styled from 'styled-components';
import '../css/about.css';
import AboutMainGraphic from "./aboutmaingraphic";

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
                        DataStructs was engineering around the philosophy of <em>treating every day like it's Karen's last ziti.</em>
                        <br/><br/>
                        As of May 2020, DataStructs is built around React, animated with Framer Motion, and hosted on AWS Amplify.
                        <br/><br/>
                        <GitHubLink className="hoverHighlit" href='https://github.com/conormccormack/datastructs'>
                            <i className="fab fa-github"></i> View this project on <strong>Github</strong>
                        </GitHubLink> @conormccormack/datastructs
                    </AboutBody>
                </AboutMessage>
                <AboutMainGraphic/>
            </MainWrapper>
        </AboutContainer>
    )
}

export default About;