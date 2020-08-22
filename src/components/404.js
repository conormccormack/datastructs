import React from 'react';
import Navbar from './navigation/navbar';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {motion} from 'framer-motion';

const PageNotFound = styled.div`
    margin-left: auto;
    margin-right: auto;
    padding-top: 1rem;
    font-family: Ramaraja;
    font-size: 50px;
    text-align: center;
`

const LinkHome = styled.div`
    margin-left: auto;
    margin-right: auto;
    font-family: Lato;
    font-size: 20px;
    text-align: center;
`

const FourOhFour = (props) => {
    return(
        <motion.div key="fourOhFour" variants={props.variants} transition={props.transition} initial="pageInit" animate="pageIn" exit="pageOut">
            <Navbar/>
            <div className='landing' style={{height: '100vh'}}>
                <PageNotFound>
                    404: page not found
                </PageNotFound>
                <LinkHome>
                    interesting. hit explore to find where you're going or consider returning to the <Link to='/'>home page</Link>.
                </LinkHome>
            </div>
        </motion.div>
    );
}

export default FourOhFour;