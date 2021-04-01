import Index from './views/Index.jsx';
import Profile from './views/components/Profile.jsx';
import Transportation from './views/components/Transportation.jsx';
import Register from './views/components/Register.jsx';
import Login from './views/components/Login.jsx';
import Finance from './views/components/Finance.jsx';
import Production from './views/components/Production.jsx';
import QualityAssurance from './views/components/QualityAssurance.jsx';
import Help from './views/components/Help.jsx';

// IN ADMIN.JS AS WELL IF MODIFYING
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
    path: '/Quality-assurance',
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
    path: '/login',
    name: 'Login',
    icon: 'ni ni-key-25 text-info',
    component: Login,
    layout: '/auth',
  },
  {
    path: '/register',
    name: 'Register',
    icon: 'ni ni-circle-08 text-pink',
    component: Register,
    layout: '/auth',
  },
  {
    path: '/help',
    name: 'Help',
    icon: 'ni ni-world-2 text-black',
    component: Help,
    layout: '/admin',
  },
];
export default routes;
