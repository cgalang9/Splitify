import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './Dashboard.css'

const Dashboard = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    return (
        <div id='dash_wrapper'>
            <div id='dash_left' className='flex_col'>
                <div id='dash_head'>
                    <div>Dash</div>
                    <div><button onClick={() => history.push('/add-expense')}>Add an Expense</button></div>
                    <div>Settle Up</div>
                </div>
            </div>
            <div id='dash_right'>
                RIGHT
            </div>
        </div>
    )
};

export default Dashboard;
