import React from 'react';
import styled from 'styled-components'

const MainPanel = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-top: 20px;
`

const WelcomeHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
`

const WelcomeBody = styled.div`
    font-family: Raleway;
    font-size: 16px;
    width: 600px
`

const WelcomeMessage =styled.div`
    padding-right: 5vw;
`

const MainGraphic = styled.div`
    max-width: 600px;
    padding-left: 3vw;
`

function Mainlanding(){
    return (
        <MainPanel>
            <MainGraphic>
                <img src={require("../resources/images/logo_waves.svg")} alt="logo waves"></img>
            </MainGraphic>
            <WelcomeMessage>
                <WelcomeHeadline>Welcome to DataStructs</WelcomeHeadline>
                    <WelcomeBody>
                DataStructs is a beautiful, intuitive platform for vizualizing essential data structures and algorithms.
                    <br/><br/>
                Each page includes buttery-smooth animations of common data structures that you can build and use <strong>without
                        writing a single line of code.</strong><br/><br/>
                On top of that, DataStructs provides explanations and automated notes for every animation, so anyone can
                    build an intuition each approach’s motivating ideas and asymptotic behavior. <br/><br/>
                Open the explore menu to browse the collection categorically, click everything to see 💯, or search for a
                    specific data structure or concept in the search bar.
                    </WelcomeBody>
            </WelcomeMessage>

        </MainPanel>
    )
}

export default Mainlanding;