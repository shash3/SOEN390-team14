/* eslint-disable no-undef */
import React from 'react';
import {
  useLocation, Route, Switch, Redirect,
} from 'react-router-dom';
// reactstrap components
import { Container } from 'reactstrap';
// core components
import AdminNavbar from '../components/Navbars/AdminNavbar.jsx';
import AdminFooter from '../components/Footers/AdminFooter.jsx';
import Sidebar from '../components/Sidebar/Sidebar.jsx';
import Index from '../views/Index.jsx';
import Profile from '../views/components/Profile.jsx';
import Transportation from '../views/components/Transportation.jsx';
import Register from '../views/components/Register.jsx';
import Login from '../views/components/Login.jsx';
import Finance from '../views/components/Finance.jsx';
import Production from '../views/components/Production.jsx';
import QualityAssurance from '../views/components/QualityAssurance.jsx';
import ProductionScheduling from '../views/components/Production_Scheduling.jsx';
import Help from '../views/components/Help.jsx';
import AccountPayable from '../views/components/AccountPayable.jsx';
import AccountReceivable from '../views/components/AccountReceivable.jsx';
import Sales from '../views/components/Sales.jsx';
import Procurement from '../views/components/Procurement.jsx';

const logoImg = require('../assets/img/brand/logo.png');

const Admin = (props) => {
  // IN ROUTES.JS AS WELL IF MODIFYING
  const routes = [
    {
      path: '/index',
      name: 'Dashboard',
      icon: 'ni ni-tv-2 text-primary',
      component: Index,
      layout: '/admin',
    },
    {
      path: '/production',
      name: 'Production',
      icon: 'ni ni-box-2 text-blue',
      component: Production,
      layout: '/admin',
    },
    {
      path: '/transportation',
      name: 'Transportation',
      icon: 'ni ni-delivery-fast text-green',
      component: Transportation,
      layout: '/admin',
    },
    {
      path: '/finance',
      name: 'Finance',
      icon: 'ni ni-briefcase-24 text-red',
      component: Finance,
      layout: '/admin',
    },
    {
      path: '/quality-assurance',
      name: 'Quality Assurance',
      icon: 'ni ni-bullet-list-67 text-red',
      component: QualityAssurance,
      layout: '/admin',
    },
    {
      path: '/user-profile',
      name: 'User Profile',
      icon: 'ni ni-single-02 text-yellow',
      component: Profile,
      layout: '/admin',
    },
    {
      path: '/help',
      name: 'Help',
      icon: 'ni ni-world-2 text-black',
      component: Help,
      layout: '/admin',
    },
  ];
  const permission = JSON.parse(localStorage.getItem('permission'));
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (inputRoutes) => inputRoutes.map((prop, key) => {
    if (prop.layout === '/admin') {
      return (
        <Route
          path={prop.layout + prop.path}
          component={prop.component}
          key={key}
        />
      );
    }
    return null;
  });

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i += 1) {
      // console.log(routes.length);
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path)
        !== -1
      ) {
        return routes[i].name;
      }
    }
    return 'Brand';
  };

  // logic to remove nav items depending on permission
  const permissionRoutes = () => {
    if (permission === 'admin') {
      let i;
      for (i = 0; i < routes.length; i += 1) {
        if (routes[i].name === 'User Profile') {
          routes[i].name = 'Admin Panel';
          routes[i].path = '/admin-panel';
        }
      }
    }

    if (permission === 'none' || permission === null) {
      routes.splice(1, 4);
    }
    if (permission === 'production') {
      routes.splice(2, 3);
    }
    if (permission === 'transportation') {
      routes.splice(1, 1);
      routes.splice(2, 2);
    }
    if (permission === 'finance') {
      routes.splice(1, 2);
      routes.splice(2, 1);
    }
    if (permission === 'assurance') {
      routes.splice(1, 3);
    }
    return routes;
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={permissionRoutes()}
        logo={{
          innerLink: '/admin/index',
          imgSrc: logoImg.default,
          imgAlt: '...',
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
          {permission === 'production' && (
            <Route
              path="/admin/production-scheduling"
              component={ProductionScheduling}
            />
          )}
          {permission === 'admin' && (
            <Route
              path="/admin/production-scheduling"
              component={ProductionScheduling}
            />
          )}
          {permission === 'finance' && (
            <Route
              path="/admin/finance-payable"
              component={AccountPayable}
            />
          )}
          {permission === 'admin' && (
            <Route
              path="/admin/finance-payable"
              component={AccountPayable}
            />
          )}
          {permission === 'finance' && (
            <Route
              path="/admin/finance-receivable"
              component={AccountReceivable}
            />
          )}
          {permission === 'admin' && (
            <Route
              path="/admin/finance-receivable"
              component={AccountReceivable}
            />
          )}
          {permission === 'finance' && (
            <Route
              path="/admin/finance-sales"
              component={Sales}
            />
          )}
          {permission === 'admin' && (
            <Route
              path="/admin/finance-sales"
              component={Sales}
            />
          )}
          {permission === 'finance' && (
            <Route
              path="/admin/finance-procurement"
              component={Procurement}
            />
          )}
          {permission === 'admin' && (
            <Route
              path="/admin/finance-procurement"
              component={Procurement}
            />
          )}
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/index" />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
