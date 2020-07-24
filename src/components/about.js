import React from 'react';
import Navbar from './navbar';
import styled from 'styled-components';
import '../css/about.css';
import AboutMainGraphic from "./aboutmaingraphic";
import {motion} from "framer-motion";

const AboutContainer = styled.div`
    height: 100vh;
    background-color: #EFE7E2;
`
const AboutHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 80px;
`

const MainWrapper = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    padding-left: 6rem;
    padding-right: 6rem;
`

const AboutMessage = styled.div`
    grid-column: auto / span 2;
`

const AboutBody = styled.div`
    font-family: Raleway;
    font-size: 16px;
    font-weight: 500;
`

const Link = styled.a`
    text-decoration: none;
    color: black;
    hover: 
`

function About (props){
    return(
        <AboutContainer>
            <Navbar/>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
            <MainWrapper>
                <AboutMessage>
                    <AboutHeadline>
                        About
                    </AboutHeadline>
                    <AboutBody>
                        DataStructs is a beautiful, intuitive platform for vizualizing data structures and algorithms.<br/>
                        <br/>
                        As of August 2020, DataStructs is built with <Link style={{textDecoration: 'underline'}} href="https://reactjs.org">React</Link>, animated with <Link style={{textDecoration: 'underline'}} href="https://greensock.com">GreenSock</Link>, and hosted on Netlify.
                        <br/><br/>
                        <Link className="hoverHighlit" href='https://github.com/conormccormack/datastructs'>
                            <i className="fab fa-github"></i> View this project on <strong>Github</strong>
                        </Link> @conormccormack/datastructs
                    </AboutBody>
                </AboutMessage>
                <AboutMainGraphic/>
            </MainWrapper>
            </motion.div>
        </AboutContainer>
    )
}

export default About;