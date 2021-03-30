import React from 'react';

// reactstrap components
import {
  Card, CardBody, Container, Row, Col,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const Header = () => (
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
                        <Link to="/admin/production" activeclassname="active">
                          MAIN
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i className="fas fa-chart-bar" />
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
                        {' '}
                        <Link
                          to="/admin/production-scheduling"
                          activeclassname="active"
                        >
                          SCHEDULING
                        </Link>
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i className="fas fa-percent" />
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

export default Header;
