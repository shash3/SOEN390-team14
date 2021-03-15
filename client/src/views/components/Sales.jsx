/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Media,
  Table,
  Container,
  Row,
  ButtonGroup,
  Button,
  Form, Col,
} from 'reactstrap';

// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const Sales = () => {
 
  return (
    <>
      <FinanceHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Sales</h2>
                <Button className="mt-4"
                        color="primary">
                  Add Sales Order
                </Button>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Location</th>
                  <th scope="col">Purchaser</th>
                  <th scope="col">Receipt Number</th>
                  <th scope="col">Net Value</th>
                  <th scope="col">Date</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Sales;