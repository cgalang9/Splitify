import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import './Splash.css'

const Splash = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    return (
        <h1>Splash Page</h1>
    )
};

export default Splash
