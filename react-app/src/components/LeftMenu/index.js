import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getCurrUserGroupsThunk } from '../../store/groups';
import './LeftMenu.css'

const LeftMenu = () => {
    const dispatch = useDispatch()

    useEffect(async() => {
        await dispatch(getCurrUserGroupsThunk())
    },[])

    const user_groups = useSelector((state) => state.groups)

    return (
        <div id='left_menu_wrapper' className='flex_col'>
            <NavLink to='/dashboard' style={{ textDecoration: 'none' }}><div id='dashboard_link'>Dashboard</div></NavLink>
            <NavLink to='/' style={{ textDecoration: 'none' }}><div>All Expenses(main for now)</div></NavLink>
            <div id='left_menu_groups'>
                <div id='left_menu_head'>GROUPS</div>
                {user_groups && user_groups.groups.map(group => (
                    <div key={group.id} className='left_menu_group_li'>
                        <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none' }}><div>{group.name}</div></NavLink>
                    </div>
                ))}
            </div>
            <div>FRIENDS</div>
        </div>
    )
};

export default LeftMenu
