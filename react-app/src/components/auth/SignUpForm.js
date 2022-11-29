import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';

const SignUpForm = () => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data)
      }
    } else {
      setErrors(['Passwords do not match'])
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div id='signup_form_wrapper'>
      <form id='signup_form' onSubmit={onSignUp}>
        <div id='signup_form_title'>Sign up</div>
        <div className='errors'>
          {errors.map((error, ind) => (
            <div key={ind}>{error}</div>
          ))}
        </div>
        <div className='auth_form_input_container flex_col'>
          <div>User Name</div>
          <input
            type='text'
            name='username'
            onChange={updateUsername}
            value={username}
            required
          ></input>
        </div>
        <div className='auth_form_input_container flex_col'>
          <div>Email</div>
          <input
            type='email'
            name='email'
            onChange={updateEmail}
            value={email}
            required
          ></input>
        </div>
        <div className='auth_form_input_container flex_col'>
          <div>Password</div>
          <input
            type='password'
            name='password'
            onChange={updatePassword}
            value={password}
            required
          ></input>
        </div>
        <div className='auth_form_input_container flex_col'>
            <div>Repeat Password</div>
            <input
              type='password'
              name='repeat_password'
              onChange={updateRepeatPassword}
              value={repeatPassword}
              required={true}
            ></input>
        </div>
        <button type='submit' id='signup_btn'>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
