import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Index from "views/Index.js";
import Profile from "views/components/Profile.js";
import Transportation from "views/components/Transportation.js";
import Register from "views/components/Register.js";
import Login from "views/components/Login.js";
import Accounting from "views/components/Accounting.js";
import Production from "views/components/Production.js";

const Admin = (props) => {
  // IN ROUTES.JS AS WELL IF MODIFYING
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
      path: "/accounting",
      name: "Accounting",
      icon: "ni ni-bullet-list-67 text-red",
      component: Accounting,
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
  const permission = JSON.parse(localStorage.getItem("permission"));
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      console.log(routes.length)
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const permissionRoutes = () => {
    if(permission === "admin"){
      var i;
      for (i = 0; i < routes.length; i++) {
        if(routes[i].name === "User Profile"){
          routes[i].name = "Admin Panel";
          routes[i].path = "/admin-panel";
        }
      }
    }
    console.log(permission)
    if(permission === null){
      routes.splice(1,3);   
    }
    if(permission === "production"){
      routes.splice(2,2);   
    }
    if(permission === "transportation"){
      routes.splice(1,1);   
      routes.splice(2,1);  
    }
    return routes;
  }

  return (
    <>
      <Sidebar
        {...props}
        routes={permissionRoutes()}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/logo.png").default,
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props.location.pathname)}
        />
        <Switch>
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
