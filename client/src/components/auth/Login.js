import React, { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("success");
  };

  return (
    <Fragment>
      <h1 ClassName="large text-primary">Sign In</h1>
      <p ClassName="lead">
        <i ClassName="fas fa-user"></i> Sign Into Your Account
      </p>
      <form ClassName="form" onSubmit={(e) => onSubmit(e)}>
        <div ClassName="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div ClassName="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" ClassName="btn btn-primary" value="Login" />
      </form>
      <p ClassName="my-1">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </Fragment>
  );
};
export default Login;
