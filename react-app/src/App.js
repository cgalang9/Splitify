import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import { authenticate } from './store/session';
import Splash from './components/Splash';
import Dashboard from './components/Dashboard';
import GroupPage from './components/GroupPage';
import AllExpenses from './components/AllExpenses';
import AddExpenseForm from './components/AddExpenseForm';
import EditExpenseForm from './components/EditExpenseForm';
import AddPaymentForm from './components/AddPaymentForm';
import EditPaymentForm from './components/EditPaymentForm';
import AddFriendForm from './components/AddFriendForm';
import CreateGroup from './components/CreateGroup';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/' exact={true}>
          <Splash />
        </Route>
        <Route path='/dashboard' exact={true}>
          <Dashboard />
        </Route>
        <Route path='/groups/:groupId' exact={true}>
          <GroupPage />
        </Route>
        <Route path='/all' exact={true}>
          <AllExpenses />
        </Route>
        <Route path='/add-expense' exact={true}>
          <AddExpenseForm />
        </Route>
        <Route path='/expenses/:expenseId/edit-expense' exact={true}>
          <EditExpenseForm />
        </Route>
        <Route path='/add-payment' exact={true}>
          <AddPaymentForm />
        </Route>
        <Route path='/payments/:paymentId/edit-payment' exact={true}>
          <EditPaymentForm />
        </Route>
        <Route path='/create-group' exact={true}>
          <CreateGroup />
        </Route>
        <Route path='/add-friend' exact={true}>
          <AddFriendForm />
        </Route>
        <Route path='/login' exact={true}>
          <LoginForm />
        </Route>
        <Route path='/sign-up' exact={true}>
          <SignUpForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
