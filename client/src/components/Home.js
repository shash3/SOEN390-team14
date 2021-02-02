import React, {Fragment} from 'react';
import {Link } from 'react-router-dom';
import styled from "styled-components";

export const Home = () => {
    return (
        <div>
            <h1 className="site-title">
                BIKESHOP
            </h1>
            <div className="loginBtn">
                <button><Link to='/login'>Login</Link></button>
            </div>
            <div className="registerBtn">
                <button><Link to='/register'>Register</Link></button>
            </div>
        </div>
    )
}
export default Home;