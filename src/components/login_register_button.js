import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

const LoginButton = styled.div`
    margin-left: 10px; 
    border-radius: 50px;
    width: 100px;
    min-width: 20px;
    text-align: center;
    margin-top: 2px;
    height: 28px;
    background-color: #3C5B6F;
`

const Buttontext = styled.div`
    color: white;
    padding: 4px;
    font-family: Raleway, sans-serif;
    font-weight: 500;
    height: 100%;
`

function LoginRegister() {
    return(
        <Link to='/' style={{textDecoration:'None' , color:'black'}}>
            <LoginButton>
                <Buttontext>Login</Buttontext>
            </LoginButton>
        </Link>
    );
}

export default LoginRegister;