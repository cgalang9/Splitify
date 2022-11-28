import React from 'react';
import { useHistory } from 'react-router-dom';
import './SplashNav.css'

const SplashNav = () => {
    const history = useHistory()
    return (
        <div id='splash_nav'>
            <div>Logo Here</div>
            <div id='splash_nav_btns'>
                <div id='splash_nav_login' onClick={() => history.push('/login')}>Login</div>
                <div id='splash_nav_signup' onClick={() => history.push('/signup')}>Sign Up</div>
            </div>
        </div>
    )
};

export default SplashNav
