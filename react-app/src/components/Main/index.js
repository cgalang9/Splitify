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
import EditExpenseForm from '../EditExpenseForm';
import AddPaymentForm from '../AddPaymentForm';
import EditPaymentForm from '../EditPaymentForm';
import AddFriendForm from '../AddFriendForm';
import CreateGroup from '../CreateGroup';

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
                            <Route exact path="/groups/:groupId" component={() => <GroupPage />} />
                            <Route exact path="/add-expense" component={() => <AddExpenseForm />} />
                            <Route exact path="/expenses/:expenseId/edit-expense" component={() => <EditExpenseForm />} />
                            <Route exact path="/add-payment" component={() => <AddPaymentForm />} />
                            <Route exact path="/payments/:paymentId/edit-payment" component={() => <EditPaymentForm />} />
                            <Route exact path="/add-friend" component={() => <AddFriendForm />} />
                            <Route exact path="/create-group" component={() => <CreateGroup />} />
                            <Route exact path="/error">
                                <h1>There was an error</h1>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    )
};

export default Main;
