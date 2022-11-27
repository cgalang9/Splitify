import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './NavBar.css'
import { logout } from '../store/session';

const NavBar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.session)

  const onLogout = async (e) => {
    await dispatch(logout());
    history.push('/')
  }

  const toggleMenu = () => {
    const menu = document.querySelector('#dropdown_menu')
    if(menu.classList.contains('hidden')) {
      menu.classList.remove('hidden')
    } else {
      menu.classList.add('hidden')
    }
  }

  return (
    <nav id='nav'>
      <div id='logo'>
        LOGO HERE
      </div>
      <div id='menu' onClick={toggleMenu}>
        <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' id='nav_user_icon' />
        {user.user && <div>{user.user.username}</div>}
        <i className="fa-solid fa-caret-down" />
      </div>
      <div id='dropdown_menu' className='hidden'>
        <div className='dropdown_menu_item' onClick={() => history.push('/dashboard')}>
          Dashboard
        </div>
        <div className='dropdown_menu_item' onClick={() => history.push('/create-group')}>
          Create a group
        </div>
        <div className='dropdown_menu_item' onClick={() => history.push('/add-friend')}>
          Add a friend
        </div>
        <div className='dropdown_menu_item' onClick={onLogout}>
          Log out
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
