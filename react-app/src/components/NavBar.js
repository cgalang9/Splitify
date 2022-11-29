import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './NavBar.css'
import { logout } from '../store/session';
import { Modal } from '../context/Modal';
import CreateGroup from './CreateGroup'
import AddFriendForm from './AddFriendForm'



const NavBar = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.session)

  const onLogout = async (e) => {
    history.push('/')
    await dispatch(logout());
  }

  const toggleMenu = () => {
    const menu = document.querySelector('#dropdown_menu')
    if(menu.classList.contains('hidden')) {
      menu.classList.remove('hidden')
    } else {
      menu.classList.add('hidden')
    }
  }

  const [showModalGroup, setShowModalGroup] = useState(false);
  const [showModalFriend, setShowModalFriend] = useState(false);

  return (
    <div id='nav_wrapper'>
      <nav id='nav'>
        <div id='logo'>
          <i className="fa-solid fa-envelope" />Splitify
          {/* <LoginFormModal/> */}
        </div>
        <div id='menu' onClick={toggleMenu}>
          <img src='https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-teal19-200px.png' alt='user_icon' id='nav_user_icon' />
          {user.user && <div>{user.user.username}</div>}
          <i className="fa-solid fa-caret-down" />
        </div>
        <div id='dropdown_menu' className='hidden'>
          <div className='dropdown_menu_item' id='dropdown_first' onClick={() => history.push('/dashboard')}>
            Dashboard
          </div>
          <div className='dropdown_menu_item' onClick={() => setShowModalGroup(true)}>
            Create a group
          </div>
          {showModalGroup && (
            <Modal onClose={() => setShowModalGroup(false)}>
              <CreateGroup />
            </Modal>
          )}
          <div className='dropdown_menu_item' onClick={() => setShowModalFriend(true)}>
            Add a friend
          </div>
          {showModalFriend && (
            <Modal onClose={() => setShowModalFriend(false)}>
              <AddFriendForm />
            </Modal>
          )}
          <div className='dropdown_menu_item' id='dropdown_last' onClick={onLogout}>
            Log out
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
