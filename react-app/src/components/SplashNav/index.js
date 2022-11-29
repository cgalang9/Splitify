import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import './SplashNav.css'

const SplashNav = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const demoUserLogin = async (e) => {
      const data = await dispatch(login('demo@aa.io', 'password'))
      console.log(data)
      if (data) {
        history.push('/')
      } else {
        history.push('/dashboard')
      }
    };

    return (
        <div id='splash_nav'>
            <div id='splash_nav_logo'>
              <i className="fa-solid fa-envelope" />Splitify
            </div>
            <div id='splash_nav_btns'>
                <div id='splash_nav_login' onClick={() => history.push('/login')}>Login</div>
                <div id='splash_nav_signup' onClick={() => history.push('/signup')}>Sign Up</div>
                <div id='splash_nav_signup' onClick={demoUserLogin}>Login as Demo User</div>
            </div>
        </div>
    )
};

export default SplashNav
