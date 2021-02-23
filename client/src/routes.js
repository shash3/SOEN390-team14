import Index from "views/Index.js";
import Profile from "views/components/Profile.js";
import Transportation from "views/components/Transportation.js";
import Register from "views/components/Register.js";
import Login from "views/components/Login.js";
import Finance from "views/components/Finance.js";
import Production from "views/components/Production.js";
import QualityAssurance from "views/components/QualityAssurance.js";
// IN ADMIN.JS AS WELL IF MODIFYING
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/production",
    name: "Production",
    icon: "ni ni-planet text-blue",
    component: Production,
    layout: "/admin",
  },
  {
    path: "/transportation",
    name: "Transportation",
    icon: "ni ni-pin-3 text-orange",
    component: Transportation,
    layout: "/admin",
  },
  {
    path: "/finance",
    name: "Finance",
    icon: "ni ni-bullet-list-67 text-red",
    component: Finance,
    layout: "/admin",
  },
  {
    path: "/Quality-assurance",
    name: "Quality Assurance",
    icon: "ni ni-bullet-list-67 text-red",
    component: QualityAssurance,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  },
];
export default routes;
