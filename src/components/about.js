import React, { useEffect } from 'react';
import Navbar from './navigation/navbar';
import styled from 'styled-components';
import '../css/about.css';
import AboutMainGraphic from "./aboutmaingraphic";
import {motion} from "framer-motion";
import copy from 'copy-to-clipboard';

const AboutHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 80px;
`

const AboutMessage = styled.div`
    grid-column: auto / span 2;
`

const AboutBody = styled.div`
    font-family: Raleway;
    font-size: 18px;
    font-weight: 500;
`

const Link = styled.a`
    color: black;
`

function About (props){
    useEffect(()=>{
        document.title = 'DataStructs - about';
    }, []);

    return(
        <div>
            <Navbar/>
            <motion.div key="home" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
            <div className='content-wrapper'>
                <AboutMessage>
                    <AboutHeadline>
                        About
                    </AboutHeadline>
                    <AboutBody>
                        DataStructs is a platform for interactive vizualizations of data structures and algorithms
                        to supplement existing visualization sites that offer little in the way of explaining how data structures and algorithms work or why we use them.<br/>
                        <br/>
                        Undergrad CS students at USC get a kick out of warning first-years about <a href="https://bytes.usc.edu/cs104/">CSCI 104: Data Structures and Object Oriented Design</a>, a course that's often recalled as one of the most painful experiences of your freshman year. As someone who had switched to CS two semesters into college and passed the prerequisite placement exam with a "marginal pass", this reputation was never lost on me. Throughout that semester, I fought back every urge to give in and drop out of CS. With the fantastic course staff and support I had at my disposal, though, I pushed through my confusion and self-doubt to build an intution behind data structures & OOP along with a genuine appreciation for the major I'd chosen.
                        <br/><br/>
                        I'm building DataStructs in attempt to assure anyone studying data structures that clarity in this field is within their reach and that it can be extremely rewarding once they have it.
                        <br/><br/>
                        I am a third-year student of Computer Science & Math at the University of Southern California concurrently working towards an M.S. in Electrical Engineering with a focus in Machine Learning. My primary interests lie in
                        data science & deep learning research and its applications in autonomous machines.
                        <br/><br/>
                        As of August 2020, DataStructs is built with <Link style={{ textDecoration: 'underline' }} href="https://reactjs.org">React</Link>, 
                        animated with <Link style={{textDecoration: 'underline'}} href="https://animejs.com/">Anime.js</Link>, 
                        and continuously deployed via Netlify.
                        <br/><br/>
                        Feel free to connect with me on <Link style={{textDecoration: 'underline'}} href="https://www.linkedin.com/in/conorxmccormack">LinkedIn</Link>!
                        <br/><br/>
                        If you're interested in contributing to the project, reach out at <span style={{textDecoration: 'underline'}} onClick={() => copy('conorxmccormack@gmail.com')}>conorxmccormack@gmail.com</span> <span onClick={() => copy('conorxmccormack@gmail.com')}>[click to copy]</span>.
                        <br/><br/>
                        <Link className="hoverHighlit" href='https://github.com/conormccormack/datastructs'>
                            <i className="fab fa-github"></i> View this project on <strong>Github</strong> @conormccormack/datastructs
                        </Link>
                    </AboutBody>
                </AboutMessage>
                <AboutMainGraphic/>
            </div>
            </motion.div>
        </div>
    )
}

export default About;