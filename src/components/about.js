import React from 'react';
import Navbar from './navbar';
import styled from 'styled-components';
import '../css/about.css';
import AboutMainGraphic from "./aboutmaingraphic";
import {motion} from "framer-motion";
import copy from 'copy-to-clipboard';

const AboutContainer = styled.div`
    height: 100vh;
    background-color: #ece7e3;
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
                        DataStructs is a beautiful, intuitive platform for vizualizing data structures and algorithms built by Conor McCormack
                        to replace existing sites that offer little in the way of explaining how data structures and algorithms work or why we use them.<br/>
                        <br/>
                        I am a third-year student of Computer Science & Math at the University of Southern California concurrently working towards an M.S. in Applied Data Science. My primary interests lie in
                        data science & deep learning research and its applications in autonomous machines. Feel free to connect with me on <Link style={{textDecoration: 'underline'}} href="https://www.linkedin.com/in/conorxmccormack">LinkedIn</Link> if
                        that's your sort of thing.
                        <br/><br/>
                        As of August 2020, DataStructs is built with <Link style={{textDecoration: 'underline'}} href="https://reactjs.org">React</Link>, 
                        animated with <Link style={{textDecoration: 'underline'}} href="https://animejs.com/">Anime.js</Link>, 
                        and continuously deployed via Netlify.
                        <br/><br/>
                        If you're interested in contributing to the project, reach out at <span style={{textDecoration: 'underline'}} onClick={() => copy('conorxmccormack@gmail.com')}>conorxmccormack@gmail.com</span> <span onClick={() => copy('conorxmccormack@gmail.com')}>[click to copy]</span>.
                        <br/><br/>
                        <Link className="hoverHighlit" href='https://github.com/conormccormack/datastructs'>
                            <i className="fab fa-github"></i> View this project on <strong>Github</strong> @conormccormack/datastructs
                        </Link>
                    </AboutBody>
                </AboutMessage>
                <AboutMainGraphic/>
            </MainWrapper>
            </motion.div>
        </AboutContainer>
    )
}

export default About;