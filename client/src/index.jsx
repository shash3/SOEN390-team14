/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import './assets/plugins/nucleo/css/nucleo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/scss/argon-dashboard-react.scss';
import AdminLayout from './layouts/Admin.jsx';
import AuthLayout from './layouts/Auth.jsx';


// verify user is logged in for private route
const isLogin = () => {
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  }
  return false;
};

// reroute to auth page if not logged in
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      isLogin()
        ? <Component {...props} />
        : <Redirect to="/auth" />
    )}
  />
);

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <PrivateRoute Route path="/admin" component={AdminLayout} />
      <Route path="/auth" component={AuthLayout} />
      <Redirect from="/" to="/auth" />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);
