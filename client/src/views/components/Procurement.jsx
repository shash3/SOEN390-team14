/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// reactstrap components
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from 'reactstrap';

// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const Procurement = () => {

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
                <h2 className="mb-0">Procurement</h2>
                <Button className="mt-4"
                        color="primary"
                        onClick={() => {
                          closeModal();
                        }}
                >
                  Add Purchase Order
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
                              type="text"
                              placeholder="NAME"
                              name="name"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="number"
                              placeholder="QUANTITY  (please use scroller on right)"
                              name="quantity"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="Supplier"
                              name="supplier"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="Destination"
                              name="destination"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="number"
                              placeholder="Net Value"
                              name="netValue"
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="date"
                              placeholder="Date"
                              name="date"
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button color="primary">
                          Add Procurement Order
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
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Receipt ID</th>
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

export default Procurement;