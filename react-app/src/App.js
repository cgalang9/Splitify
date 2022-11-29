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
import SplashNav from './components/SplashNav';

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
      <Switch>
        <Route path='/' exact={true}>
          <SplashNav />
          <Splash />
        </Route>
        <Route path='/dashboard' exact={true}>
          <NavBar />
          <Dashboard />
        </Route>
        <Route path='/groups/:groupId' exact={true}>
          <NavBar />
          <GroupPage />
        </Route>
        <Route path='/all' exact={true}>
          <NavBar />
          <AllExpenses />
        </Route>
        {/* <Route path='/add-expense' exact={true}>
          <NavBar />
          <AddExpenseForm />
        </Route>
        <Route path='/expenses/:expenseId/edit-expense' exact={true}>
          <NavBar />
          <EditExpenseForm />
        </Route>
        <Route path='/add-payment' exact={true}>
          <NavBar />
          <AddPaymentForm />
        </Route>
        <Route path='/payments/:paymentId/edit-payment' exact={true}>
          <NavBar />
          <EditPaymentForm />
        </Route>
        <Route path='/create-group' exact={true}>
          <NavBar />
          <CreateGroup />
        </Route>
        <Route path='/add-friend' exact={true}>
          <NavBar />
          <AddFriendForm />
        </Route> */}
        <Route path='/login' exact={true}>
          <SplashNav />
          <LoginForm />
        </Route>
        <Route path='/signup' exact={true}>
          <SplashNav />
          <SignUpForm />
        </Route>
        {/* <ProtectedRoute path='/users' exact={true} >
          <NavBar />
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <NavBar />
          <User />
        </ProtectedRoute> */}
      </Switch>
    </BrowserRouter>
  );
}

export default App;
