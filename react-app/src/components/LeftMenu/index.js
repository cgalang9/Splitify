import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { getCurrUserGroupsThunk } from '../../store/groups';
import { getFriendsThunk } from '../../store/currUserFriends';
import CreateGroup from '../CreateGroup';
import AddFriendForm from '../AddFriendForm';
import { Modal } from '../../context/Modal';
import './LeftMenu.css'

const LeftMenu = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
        await dispatch(getFriendsThunk())
    },[])

    const user_groups = useSelector((state) => state.groups)
    const friends = useSelector((state) => state.currUserFriends)
    const user = useSelector((state) => state.session)
    const [showModalGroup, setShowModalGroup] = useState(false);
    const [showModalFriend, setShowModalFriend] = useState(false);

    useEffect(() => {
        if(!user.user) {
            history.push('/')
        }
    },[])

    return (
        <div id='left_menu_wrapper' className='flex_col'>
            <NavLink to='/dashboard'
                className='left_nav_link'
                style={{ textDecoration: 'none', color: 'grey', padding: '0 10px'}}
                activeStyle={{ color: "#70caae", borderLeft: '3px solid #70caae'}}
            >
                <i className="fa-solid fa-envelope" />Dashboard
            </NavLink>
            <NavLink to='/all'
                className='left_nav_link'
                style={{ textDecoration: 'none', color: 'grey', padding: '0 10px'}}
                activeStyle={{ color: "#70caae", borderLeft: '3px solid #70caae'}}
            >
                <i className="fa-solid fa-bars" />All expenses
            </NavLink>
            <div id='left_menu_groups' className='flex_col'>
                <div id='left_menu_groups_head'>GROUPS <button onClick={() => setShowModalGroup(true)} className='add_btn'><i className="fa-solid fa-plus" />add</button></div>
                {showModalGroup && (
                    <Modal onClose={() => setShowModalGroup(false)}>
                      <CreateGroup />
                    </Modal>
                 )}
                {user_groups && user_groups.groups.map(group => (
                    <div key={group.id} className='left_menu_group_li'>
                        <NavLink to={`/groups/${group.id}`}
                            className='left_nav_link'
                            style={{ textDecoration: 'none', color: 'grey', padding: '0 10px'}}
                            activeStyle={{ color: "#70caae", borderLeft: '3px solid #70caae'}}
                        >
                            <i className="fa-solid fa-tag" />{group.name}
                        </NavLink>
                    </div>
                ))}
            </div>
            <div id='left_menu_friends' className='flex_col'>
                <div id='left_menu_friends_head'>FRIENDS <button className='add_btn' onClick={() => setShowModalFriend(true)}><i className="fa-solid fa-plus" />add</button></div>
                {showModalFriend && (
                    <Modal onClose={() => setShowModalFriend(false)}>
                      <AddFriendForm />
                    </Modal>
                )}
                {friends && friends.currUserFriends.map(friend => (
                    <div key={friend.id} className='left_menu_friend_li'>
                        <i className="fa-solid fa-user" />{friend.username}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LeftMenu
