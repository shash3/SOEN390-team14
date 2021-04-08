/* eslint-disable no-undef */
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
import FinanceHeader from '../../components/Headers/FinanceHeader.jsx';
import Tooltip from "@material-ui/core/Tooltip";
import {exportToJsonExcel} from "../../variables/export";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [updated, setUpdated] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [salesData, setSalesData] = useState({
    name: '',
    quantity: 0,
    purchaser: '',
    location: '',
    value: 0,
    date: '',
  });
  const {
    name, quantity, purchaser, location, value, date,
  } = salesData;
  const onDelete = async (_id) => {
    const salesId = {
      _id,

    };
    const body = JSON.stringify(salesId);
    try {
      await axios
        .post('/api/sales/delete', body, {
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
  const onChangeSalesData = (e) => {
    setSalesData({
      ...salesData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      await axios
        .get('/api/sales', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setSales(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    lookup();
  }, [updated]);

  const addSale = async () => {
    if (
      name === ''
      || quantity <= 0
      || location === ''
      || value <= 0
      || date === ''
      || purchaser === ''
    

    ) {
      // eslint-disable-next-line no-alert
      alert('Please Enter Data Into All Fields');
    } else {
      const body = JSON.stringify(salesData);
      try {
        await axios
          .post('/api/sales/add', body, {
            headers: {
              'x-auth-token': userToken,
              'Content-Type': 'application/json',
            },
          });
      } catch (err) {
        console.error(err);
      }

      setUpdated(!updated);
    }
  };

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
                <h2 className="mb-0">Sales</h2>
                <Tooltip
                    title="Add a new Sales Order"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                >
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={() => {
                      closeModal();
                      setSalesData({
                        name: '',
                        quantity: 0,
                        purchaser: '',
                        location: '',
                        value: 0,
                        date: '',

                      });
                    }}
                  >
                    Add Sales Order
                  </Button>
                </Tooltip>
                <Tooltip
                    title="Export to PDF"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                >
                  <Button
                    className="mt-4 float-right"
                    color="danger"
                  >
                    Export to PDF
                  </Button>
                </Tooltip>
                <Tooltip
                    title="Click to export to CSV"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                >
                  <Button
                      className="mt-4 float-right"
                      color="success"
                      onClick={() => exportToJsonExcel('Sales Orders', sales)}
                  >
                    Export to CSV
                  </Button>
                </Tooltip>
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
                          <Tooltip
                              title="Enter a Name for the material being sold ex: Leather"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="text"
                              placeholder="NAME"
                              name="name"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter the amount of the material being sold ex: 2"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="number"
                              placeholder="QUANTITY  (please use scroller on right)"
                              name="quantity"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter who purchased the material being sold ex: SportExperts"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="text"
                              placeholder="Purchaser"
                              name="purchaser"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter where the material currently is: SportExperts"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="text"
                              placeholder="Location"
                              name="location"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter the net value of the material being sold ex: 20"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="number"
                              placeholder="Net Value"
                              name="value"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter when the date when the material was sold "
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="date"
                              placeholder="Date"
                              name="date"
                              onChange={(e) => onChangeSalesData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Tooltip
                            title="Click her to add the sale order"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                        >
                          <Button color="primary" onClick={() => { addSale(); closeModal(); }}>
                            Add Sales Order
                          </Button>
                        </Tooltip>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Tooltip
                        title="Cancel the sale order"
                        arrow
                        placement="top-start"
                        enterDelay={750}
                    >
                      <Button color="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                    </Tooltip>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Receipt ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Location</th>
                    <th scope="col">Purchaser</th>
                    <th scope="col">Net Value</th>
                    <th scope="col">Date</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody style={{ overflow: 'auto' }}>
                  {sales.map((t) => (
                    <tr key={t._id} value={t.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{t._id}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{t.name}</td>
                      <td>{t.quantity}</td>
                      <td>{t.purchaser}</td>
                      <td>{t.location}</td>
                      <td>{t.value}</td>
                      <td>{t.date.substr(0, 10)}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <Tooltip
                              title="Delete a sale order"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
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
                          </Tooltip>
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

export default Sales;
