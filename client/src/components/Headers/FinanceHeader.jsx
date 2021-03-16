import React from 'react';

import { Link } from 'react-router-dom';
// reactstrap components
import {
  Card, CardBody, Container, Row, Col,
} from 'reactstrap';

const FinanceHeader = () => (
  <>
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          {/* Card stats */}
          <Row>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <span className="h2 font-weight-bold mb-0">
                        <Link to="/admin/finance-payable" activeClassName="active">
                          Accounts Payable
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-file-invoice" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <span className="h2 font-weight-bold mb-0">
                        <Link to="/admin/finance-receivable" activeClassName="active">
                          Accounts Receivable
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-file-invoice-dollar" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <span className="h2 font-weight-bold mb-0">
                        <Link to="/admin/finance-sales" activeClassName="active">
                          Sales
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <i className="fas fa-hand-holding-usd" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <span className="h2 font-weight-bold mb-0">
                        <Link to="/admin/finance-procurement" activeClassName="active">
                          Procurement
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-boxes" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  </>
);

export default FinanceHeader;
