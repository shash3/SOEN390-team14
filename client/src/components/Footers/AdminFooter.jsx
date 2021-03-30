/* eslint-disable no-unused-vars */
import React from 'react';

// reactstrap components
import {
  Row, Col,
} from 'reactstrap';

const Footer = () => (
  <footer className="footer">
    <Row className="align-items-center justify-content-xl-between">
      <Col xl="6">
        <div className="copyright text-center text-xl-left text-muted">
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          <a
            className="font-weight-bold ml-1"
            href="https://www.creative-tim.com?ref=adr-admin-footer"
            rel="noopener noreferrer"
            target="_blank"
          >
            SOEN390-TEAM14
          </a>
        </div>
      </Col>
    </Row>
  </footer>
);

export default Footer;
