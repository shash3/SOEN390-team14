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
  Form, Modal, ModalHeader, ModalBody, FormGroup, InputGroup, Input, ModalFooter,
} from 'reactstrap';

// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const AccountPayable = () => {

  const [modal, setModal] = useState(false);

  function closeModal() {
    setModal(!modal);
  }
 
  return (
    <>
      <FinanceHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Accounts Payable</h2>
                <Button className="mt-4"
                        color="primary"
                        onClick={() => {
                          closeModal();
                        }}
                >
                  Add AP Receipt
                </Button>
                <Button className="mt-4 float-right"
                        color="danger"
                >
                  Export to PDF
                </Button>
                <Modal
                    isOpen={modal}
                    changeStatus={closeModal}
                >
                  <ModalHeader changeStatus={closeModal}>
                    Fill In The Form Below
                  </ModalHeader>
                  <ModalBody>
                    <Form className="form">
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="date"
                              placeholder="Date"
                              name="date"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="Status"
                              name="status"
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button color="primary">
                          Add AP Receipt
                        </Button>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">Invoice ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
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

export default AccountPayable;
