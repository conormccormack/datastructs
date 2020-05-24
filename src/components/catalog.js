import React from 'react';
import Navbar from './navbar';
import queryString from 'query-string';
import styled from 'styled-components';

const CatalogContainer = styled.div`
    background-color: #EFE7E2;
    height: 100vh;
`

function Catalog(props){
    const query = queryString.parse(props.location.search);
    return(
        <CatalogContainer>
            <Navbar/>
            <div>This is the catalog filtered by {query.view}.</div>
        </CatalogContainer>
    )
}

export default Catalog;