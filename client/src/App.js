import './App.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import  Navbar  from "./components/Navbar.js";
import  Home  from "./components/Home.js";
import  Login  from "./components/auth/Login.js";
import  Register  from "./components/auth/Register.js";


function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path='/' component={Home}/>
      <section className="container">
        <Switch>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/register' component={Register}/>
        </Switch>
      </section>
    </Router>
  );
}

export default App;
