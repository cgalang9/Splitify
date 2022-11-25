import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch, useHistory, Routes, NavLink } from 'react-router-dom';
// import LoginForm from './components/auth/LoginForm';
// import SignUpForm from './components/auth/SignUpForm';
// import NavBar from './components/NavBar';
// import ProtectedRoute from './components/auth/ProtectedRoute';
// import UsersList from './components/UsersList';
import User from '../User';
import UsersList from '../UsersList';
import Dashboard from '../Dashboard';
import LeftMenu from '../LeftMenu';
import GroupPage from '../GroupPage';
import './Main.css'
import AddExpenseForm from '../AddExpenseForm';

function Main() {
    const history = useHistory()
    return (
        <BrowserRouter>
            <div id='main_wrapper' className='flex_col'>
                <div id='main_container'>
                    <div id='main_left'>
                        <LeftMenu />
                    </div>
                    <div id='main_right'>
                        <Switch>
                            <Route exact path="/" component={() => <User/>} />
                            <Route exact path="/dashboard" component={() => <Dashboard />} />
                            <Route exact path="/groups/:groupId" component={() => <GroupPage/>} />
                            <Route exact path='/add-expense' component={() => <AddExpenseForm/>} />
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
};

export default Main;
