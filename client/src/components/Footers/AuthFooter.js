import React from "react";

// reactstrap components
import { NavItem, NavLink, Nav, Container, Row, Col } from "reactstrap";

const Login = () => {
  return (
    <>
      <footer className="py-5">
        <Container>
          <Row className="align-items-center justify-content-xl-between">
            <Col xl="6">
              <div className="copyright text-center text-xl-left text-muted">
                © {new Date().getFullYear()}{" "}
                <a
                  className="font-weight-bold ml-1"
                  href="https://www.creative-tim.com?ref=adr-auth-footer"
                  target="_blank"
                >
                  SOEN390-TEAM14
                </a>
              </div>
            </Col>
            <Col xl="6">
              <Nav className="nav-footer justify-content-center justify-content-xl-end">
                <NavItem>
                  <NavLink
                    href="https://github.com/shash3/SOEN390-team14/"
                    target="_blank"
                  >
                   MINI CAPSTONE: BIKERR ERP SYSTEM 
                  </NavLink>
                  </NavItem>
              </Nav>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Login;
