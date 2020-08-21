import React from 'react';
import {Link} from 'react-router-dom';

function HomeButton(props){
    return (
        <div className='home-button'>
            <Link to='/'>
                <img className="logo" alt="datastructs logo" src={require("../resources/images/darklogo.png")}/>
            </Link>
        </div>
    );
}

export default HomeButton;