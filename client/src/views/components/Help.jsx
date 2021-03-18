/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { } from 'react';

// reactstrap components
import {
  Container,
  Row,
  Button,
  Col,
  Card,
  CardHeader,
} from 'reactstrap';

// core components
import CardlessHeader from '../../components/Headers/CardlessHeader';

const Help = () => (
  <>
    <CardlessHeader />
    {/* Page content */}
    <Container className="mt--7" fluid>
      {/* Dark table */}
      <Row className="mt-1">
        <div className="col">
          <Card className="bg-default shadow">
            <CardHeader className="bg-transparent border-0">
              <h3 className="text-white mb-0">Welcome to the Help Page!</h3>
            </CardHeader>
            <Row className="mb-2 ml-2 mr-2 mt-2">
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <h1 className=" mb-3 mt-3">FAQ</h1>
                    <div>
                      <h3 className="text-left">How do I change my location?</h3>
                      <p className="text-left">Only users with administrative permissions can change a users location and can do so from the Admin Panel. If you need your location changed but do not have administrative permission please content a supervisor or manager that does.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How do I change my permission?</h3>
                      <p className="text-left">Only users with administrative permissions can change a users permission and can do so from the Admin Panel. If you need your permission changed but do not have administrative permission please content a supervisor or manager that does.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How do I enter a new Sale into the system?</h3>
                      <p className="text-left">If you have administrative or finance privileges and want to enter a new Sale into the system, go to the finance tab, go to sales, go to the sales table, select the add sale button at the top and fill out the form. After confirming this should enter a new sale into the system.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How do I enter a new shipment into the system?</h3>
                      <p className="text-left">If you have administrative or transportation privileges and want to enter a new shipment into the system, go to the transportation tab, go to the inventory table, select the add shipment button at the top and fill out the form. After confirming this should enter a new shipment into the system.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How can I confirm that a shipment has been packaged?</h3>
                      <p className="text-left">If you have administrative or transportation privileges and want to confirm that a shipment has been packaged, go to the transportation tab, go to the packaging table, select your shipment through the three dots on the right and select the completed option.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How can I transfer parts from one plant to another?</h3>
                      <p className="text-left">If you have administrative or production privileges and want to transfer parts from one plant to another, go to the production tab, go to the top of the inventory table, fill out the form and the transfer request should be made.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How do I enter a new PO into the system?</h3>
                      <p className="text-left">If you have administrative or finance privileges and want to enter a new PO into the system, go to the finance tab,  go to the procurement table, select the add PO button at the top and fill out the form. After confirming this should enter a new PO into the system.</p>
                    </div>
                    <div>
                      <h3 className="text-left">How can I confirm that a AP or AR invoice has been completed?</h3>
                      <p className="text-left">If you have administrative or finance privileges and want to enter a new PO into the system, go to the finance tab, go to AR/AP, go to the first table, click on the three dots on the right of the invoice and select the option you want.</p>
                    </div>
                  </CardHeader>
                </Card>
              </Col>
            </Row>
            <Row className="mb-2 ml-2 mr-2 mt-2">
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <div>
                      <h2 className=" mb-3">Contact Support</h2>
                      <h3 className="">
                        <i className="ni ni-email-83 mr-2" />
                        Email
                      </h3>
                      <h4 className="mb-3">soen390shop@gmail.com</h4>
                      <h3 className="">
                        <i className="fa fa-phone-square mr-2 " />
                        Number
                      </h3>
                      <h4 className="">1-(555)-555-5555</h4>
                    </div>
                  </CardHeader>
                </Card>
              </Col>
              <Col className="">
                <Card className="shadow">
                  <CardHeader className="bg-transparent text-center">
                    <h2 className=" mb-0">Have Any Suggestions?</h2>
                    <div>
                      <form>
                        <textarea
                          className="form-control form-control-alternative"
                          rows="5"
                          placeholder="Enter Suggestion Here ..."
                        />
                        <Button
                          className="mt-4"
                          color="primary"
                        >
                          Submit Suggestion
                        </Button>
                      </form>
                    </div>
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

export default Help;
