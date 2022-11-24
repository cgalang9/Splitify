import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const Dashboard = () => {
    const dispatch = useDispatch()

    return (
        <div id='dashboard_wrapper'>
            <h1>Dashboard</h1>
        </div>
    )
};

export default Dashboard;
