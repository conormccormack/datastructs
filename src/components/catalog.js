import React from 'react';
import Navbar from './navbar';
import queryString from 'query-string';
import styled from 'styled-components';

const CatalogContainer = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`
const CatalogHeadline = styled.div`
    font-family: Ramaraja;
    font-size: 50px;
    padding-left: 100px;
`

function Catalog(props){
    const query = queryString.parse(props.location.search);
    return(
        <CatalogContainer>
            <Navbar/>
            {query.term ? <CatalogHeadline>Search results for {query.term}:</CatalogHeadline> :
                <CatalogHeadline>This is the catalog filtered by {query.view}.</CatalogHeadline>
            }
        </CatalogContainer>
    )
}

export default Catalog;