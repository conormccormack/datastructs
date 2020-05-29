import React from 'react';
import styled from 'styled-components';

const Headline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
    padding-left: 100px;
    background-color: #EFE7E2;
`

function PageHeadline (props) {
    return(
        <Headline>
            {props.text}
        </Headline>
    );
}

export default PageHeadline;