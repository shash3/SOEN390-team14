import React from 'react';

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Col,
} from 'reactstrap';
// core components
import FinanceHeader from '../../components/Headers/FinanceHeader.jsx';

const Finance = () => (
  // Useless function
  <>
    <FinanceHeader />
    {/* Page content */}
    <Container className="mt--7" fluid>

      {/* Dark table */}
      <Row className="mt-5">
        <div className="col">
          <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0">
              <h3 className="text-white mb-0">Welcome to Finance!</h3>
            </CardHeader>
            <Row className="mb-2 ml-2 mr-2 mt-2">
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <h1 className=" mb-0">What&apos;s New with BIKERR?</h1>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
            <Row className="mb-2 ml-2 mr-2 mt-2">
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <h2 className=" mb-0">Announcements</h2>
                  </CardHeader>
                </Card>
              </Col>
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <h2 className=" mb-0">Our Goals</h2>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      </Row>
    </Container>
  </>
);
export default Finance;
