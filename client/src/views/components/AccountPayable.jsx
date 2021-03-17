/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// reactstrap components
import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Form,
  FormGroup,
  InputGroup,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from 'reactstrap';
// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';

const AccountPayable = () => {
  const [payables, setPayables] = useState([]);
  const [payablesP, setPayablesP] = useState([]);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [updated, setUpdated] = useState(false);
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      await axios
        .get('/api/procurement/payables', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setPayables(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      await axios
        .get('/api/procurement/payablesP', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setPayablesP(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    lookup();
  }, [updated]);

  const onDelete = async (_id) => {
    const salesId = {
      _id,

    };
    const body = JSON.stringify(salesId);
    try {
      await axios
        .post('/api/procurement/delete', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(setUpdated(!updated));
    } catch (err) {
      console.error(err);
    }
  };
  const onSetPaid = async (_id) => {
    const salesId = {
      _id,

    };
    const body = JSON.stringify(salesId);
    try {
      await axios
        .post('/api/procurement/setPaid', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(setUpdated(!updated));
    } catch (err) {
      console.error(err);
    }
  };

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
                <Button
                  className="mt-4"
                  color="primary"
                  onClick={() => {
                    closeModal();
                  }}
                >
                  Add AR Receipt
                </Button>
                <Button
                  className="mt-4 float-right"
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
                          Add AR Receipt
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
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>

                <tbody style={{ overflow: 'auto' }}>
                  {payables.map((t) => (
                    <tr key={t._id} value={t.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{t._id}</span>
                          </Media>
                        </Media>
                      </th>

                      <td>{t.date.substr(0, 10)}</td>
                      <td>{t.value}</td>
                      <td>
                        {t.paid ? 'Paid' : 'Not Paid'}
                        {' '}
                      </td>

                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onSetPaid(t._id)}
                            >
                              Set To Paid
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>

            </Card>
          </div>
        </Row>
        <br />
        <br />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Paid Accounts Payable</h2>

              </CardHeader>
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>

                <tbody style={{ overflow: 'auto' }}>
                  {payablesP.map((t) => (
                    <tr key={t._id} value={t.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{t._id}</span>
                          </Media>
                        </Media>
                      </th>

                      <td>{t.date.substr(0, 10)}</td>
                      <td>{t.value}</td>
                      <td>
                        {t.paid ? 'Paid' : 'Not Paid'}
                        {' '}
                      </td>

                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete
                            </DropdownItem>

                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
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
