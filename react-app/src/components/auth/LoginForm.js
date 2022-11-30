import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { login } from '../../store/session';
import './auth.css'
import background from '../../assests/background.png'

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory()

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      history.push('/dashboard')
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div id='login_form_wrapper' style={{ backgroundImage: `url(${background})`}}>
      <form id='login_form' onSubmit={onLogin}>
        <div id='login_form_title'>Log in</div>
        <div className='errors'>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div className='auth_form_input_container flex_col'>
          <div htmlFor='email'>Email address</div>
          <input
            name='email'
            type='text'
            value={email}
            onChange={updateEmail}
            required
          />
        </div>
        <div className='auth_form_input_container flex_col'>
          <div htmlFor='password'>Password</div>
          <input
            name='password'
            type='password'
            value={password}
            onChange={updatePassword}
            required
          />
        </div>
        <button type='submit' id='login_btn'>Login</button>
      </form>

    </div>
  );
};

export default LoginForm;
