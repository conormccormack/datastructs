import React from 'react';
import styled from 'styled-components'
import HomeMainGraphic from "./homemaingraphic";
import '../../css/home.css';

const WelcomeHeadline = styled.div`
    font-family: Ramaraja;
    font-size: calc(40px + 10 * ((100vw - 1130px) / (550)));
`

const WelcomeBody = styled.div`
    font-family: Lato;
    font-size: 20px;
`

const WelcomeMessage =styled.div`
    box-sizing: border-box;
`

function Mainlanding(){
    return (
        <div className='main-wrapper'>
            <HomeMainGraphic/>
            <WelcomeMessage>
                <WelcomeHeadline>Welcome to DataStructs.</WelcomeHeadline>
                <WelcomeBody>
                    DataStructs is a platform for interactive visualizations of data structures and algorithms.
                    <br/><br/>
                    Each page includes animations of common data structures that you can build and use without
                    writing a single line of code.<br/><br/>
                    On top of that, DataStructs provides explanations and automated notes for every animation, so anyone can
                    build an intuition each subject's motivating ideas and asymptotic behavior. <br/><br/>
                    Click <strong>explore</strong> or search for a specific data structure or concept in the search bar.
                </WelcomeBody>
            </WelcomeMessage>
        </div>
    )
}

export default Mainlanding;