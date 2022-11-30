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
import SplashNav from './components/SplashNav';
import Footer from './components/Footer';

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
          <Footer />
        </Route>
        <Route path='/dashboard' exact={true}>
          <NavBar />
          <Dashboard />
          <Footer />
        </Route>
        <Route path='/groups/:groupId' exact={true}>
          <NavBar />
          <GroupPage />
          <Footer />
        </Route>
        <Route path='/all' exact={true}>
          <NavBar />
          <AllExpenses />
          <Footer />
        </Route>
        <Route path='/login' exact={true}>
          <SplashNav />
          <LoginForm />
          <Footer />
        </Route>
        <Route path='/signup' exact={true}>
          <SplashNav />
          <SignUpForm />
          <Footer />
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
