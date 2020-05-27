import React from 'react';
import {Link} from 'react-router-dom';

function HomeButton(){
    return (
        <Link style={{ fontFamily: 'Ramaraja' }} className="homeLink" to='/'>
            <img className="logoImage" alt="datastructs logo" src={require("../resources/images/darklogo.png")}/>
        </Link>
    );
}

export default HomeButton;