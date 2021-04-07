/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from 'reactstrap';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const AdminNavbar = (props) => {
  const [user, setUser] = useState({});
  const [logout, setLogout] = useState(false);
  const [tokenRefresh, setTokenRefresh] = useState(false);
  let history = useHistory();

  // get user information
  useEffect(() => {
    const getUserInformation = async () => {
      const userToken = JSON.parse(localStorage.getItem('user'));

      const response = await axios
        .get('/api/auth', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error(err));
      if (response && response.data) {
        setUser(response.data);
      }
    };
    getUserInformation();
  }, []);

  // logout (remove token)
  const loggingOut = (e) => {
    localStorage.removeItem('user');
    localStorage.removeItem('permission');
    setLogout(true);
  };

  // logout go back to login page
  if (logout) {
    history.push('/auth/login');
  }

  /**
   * Set a timer to refresh every few seconds.
   */
  useEffect(() => {
    let refresh = true
    setInterval(() => {
      setTokenRefresh(refresh)
      refresh = !refresh
    }, 1000 * 15)
  }, []);

  useEffect(() => {
    let token = localStorage.getItem('user')
    let decodedToken = jwt_decode(token)
    let currentDate = new Date()
    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      localStorage.removeItem('user');
      localStorage.removeItem('permission');
      history.push('/auth/login')
    }
  }, [tokenRefresh]);

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <div
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          >
            {props.brandText}
          </div>
          <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder="Search" type="text" />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={
                        user.avatar
                      }
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user.name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem onClick={(e) => loggingOut(e)}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
