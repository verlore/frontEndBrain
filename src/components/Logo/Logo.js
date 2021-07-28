import React from 'react';
import './Logo.css';
import Untitled from './Untitled.png';
import Tilt from 'react-tilt';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
        <Tilt className="Tilt br2 shadow-2" //Tilt is an imported package
              options={{ max : 55 }} 
              style={{ height: 150, width: 150 }} >

                <div className="Tilt-inner "> 

                    <img atl='logo' src={Untitled}/> 

                </div>
         
        </Tilt>
        </div>
    );
}

export default Logo;