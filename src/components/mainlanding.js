import React from 'react';
import styled from 'styled-components'

const MainPanel = styled.div`
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
`

const MainWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`

const WelcomeMessage =styled.div`
    grid-column: 2 / 3;
    padding-right: 100px;
`

const MainGraphic = styled.div`
    width: 600px;
    grid-column: 1 / 2;
    padding-right: 30px;
    padding-left: 120px;
`

function Mainlanding(){
    return (
        <MainPanel>
            <MainWrapper>
                <MainGraphic>
                    <img src={require("../resources/images/logo_waves.svg")} alt="logo waves"></img>
                </MainGraphic>
                <WelcomeMessage>
                    <WelcomeHeadline>Deadly Waves</WelcomeHeadline>
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

            </MainWrapper>

        </MainPanel>
    )
}

export default Mainlanding;