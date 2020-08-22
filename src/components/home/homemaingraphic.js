import React from 'react';
import styled from "styled-components";

const ResponsiveGraphic = styled.div`
    width: 100%;
    box-sizing: border-box;
`

function HomeMainGraphic() {
    return(
        <ResponsiveGraphic>
            <img style={{ marginLeft: 'auto', marginRight: 'auto', width: '100%'}} src={require("../../resources/images/bst_sc.png")} alt="logo on waves"/>
        </ResponsiveGraphic>
    )
}  

export default HomeMainGraphic; 