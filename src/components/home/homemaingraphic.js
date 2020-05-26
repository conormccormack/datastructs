import React from 'react';
import styled from "styled-components";

const MainGraphic = styled.div`
    width: 600px;
    grid-column: 1 / 2;
    padding-right: 30px;
    padding-left: 120px;
`

function HomeMainGraphic() {

    return(
        <MainGraphic>
            <img src={require("../../resources/images/logo_waves.svg")} alt="logo on waves"></img>
        </MainGraphic>
    )
}

export default HomeMainGraphic;