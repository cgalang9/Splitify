import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { getCurrUserGroupsThunk } from '../../store/groups';
import { getFriendsThunk } from '../../store/currUserFriends';
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
                <div id='left_menu_groups_head'>GROUPS <button onClick={() => history.push('/create-group')} className='add_btn'><i className="fa-solid fa-plus" />add</button></div>
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
                <div id='left_menu_friends_head'>FRIENDS <button className='add_btn' onClick={() => history.push('/add-friend')}><i className="fa-solid fa-plus" />add</button></div>
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
