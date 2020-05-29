import React from 'react';
import styled from 'styled-components';

const TextWrapper = styled.div`
    text-align: right;
    padding-right: 100px;
`

const Headline = styled.div`
    font-size: 40;
    font-family: Ramaraja;
`

function RelatedPagesCard(props) {
    return (
        <TextWrapper>
            <Headline>Look Interesting?</Headline>
        </TextWrapper>
    )
}

export default RelatedPagesCard;