import React from 'react';
import { Link } from 'react-router-dom';
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';

const whiteLogo = require('../../assets/img/brand/logo-white.png');
const argonRreact = require('../../assets/img/brand/argon-react.png');

const AdminNavbar = () => (
  <>
    <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
      <Container className="px-4">
        <NavbarBrand to="/" tag={Link}>
          <img
            alt="..."
            src={whiteLogo.default}
          />
        </NavbarBrand>
        <button type="button" className="navbar-toggler" id="navbar-collapse-main">
          <span className="navbar-toggler-icon" />
        </button>
        <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                <Link to="/">
                  <img
                    alt="..."
                    src={argonRreact.default}
                  />
                </Link>
              </Col>
              <Col className="collapse-close" xs="6">
                <button type="button" className="navbar-toggler" id="navbar-collapse-main">
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink
                className="nav-link-icon"
                to="/auth/register"
                tag={Link}
              >
                <i className="ni ni-circle-08" />
                <span className="nav-link-inner--text">Register</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link-icon" to="/auth/login" tag={Link}>
                <i className="ni ni-key-25" />
                <span className="nav-link-inner--text">Login</span>
              </NavLink>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  </>
);

export default AdminNavbar;
