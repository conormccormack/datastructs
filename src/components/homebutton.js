import React from 'react';
import {Link} from 'react-router-dom';

function HomeButton(){
    return (
        <Link style={{ fontFamily: 'PoiretOne' ,textDecoration: 'none', color: 'black', fontSize: '2em' }} className="homeLink" to='/'>
            <img className="logoImage" alt="datastructs logo" src={require("../resources/images/project-diagram-solid.svg")}/>
            DataStructs
        </Link>
    );
}

export default HomeButton;