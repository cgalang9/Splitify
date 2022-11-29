import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import './LoginFormT.css';

function LoginFormT() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            setErrors(data.errors)
        } else if (data.message) {
            setErrors([data.message])
        }
      });
  }

  const demoUserLogin = () => {
    setErrors([]);
    const demoUser = {
      credential: 'Demo-lition',
      password: 'password'
    }
    return dispatch(sessionActions.login(demoUser))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
            setErrors(data.errors)
        } else if (data.message) {
            setErrors([data.message])
        }
      });
  }

  return (
    <div className='login_form_container flex'>
      test
        {/* <form onSubmit={handleSubmit} className='login_form flex' >
          <div className='title'>Log in</div>
          <div className='welcome'>Welcome to Airbnb</div>
          <ul className='errors'>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <label className='flex'>
            <span className='input_label'>Username or Email</span>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              className='input_top'
            />
          </label>
          <label className='flex'>
            <span className='input_label'>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input_bottom'
            />
          </label>
          <button type="submit" className='login_btn'>Log In</button>
          <button type="button" className='demo_btn' onClick={demoUserLogin} >Log In As Demo User</button>
        </form> */}
    </div>
  );
}

export default LoginFormT;
