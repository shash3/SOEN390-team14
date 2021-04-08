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

const Procurement = () => {
  const [procurement, setProcurement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [updated, setUpdated] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [procurementData, setProcurementData] = useState({
    name: '',
    quantity: 0,
    supplier: '',
    destination: '',
    value: 0,
    date: '',
  });
  const {
    name, quantity, supplier, destination, value, date,
  } = procurementData;
  const onDelete = async (_id) => {
    const procurementId = {
      _id,

    };
    const body = JSON.stringify(procurementId);
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
  const [modal, setModal] = useState(false);
  const onChangeProcurementData = (e) => {
    setProcurementData({
      ...procurementData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const getMaterials = async () => {
      await axios
        .get('/api/material', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setMaterials(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    const getAllLoc = async () => {
      const response = await axios
        .get('/api/locations')
        .catch((err) => console.error('Error', err));
      if (response.data) {
        setLocations(response.data);
      }
    };
    getAllLoc();
    getMaterials();
  }, []);

  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      await axios
        .get('/api/procurement', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setProcurement(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    lookup();
  }, [updated]);

  const addProcurement = async () => {
    if (
      name === ''
      || quantity === 0
      || supplier === ''
      || destination === 0
      || value === ''
      || date === ''

    ) {
      // eslint-disable-next-line no-alert
      alert('Please Enter Data Into All Fields');
    } else {
      const body = JSON.stringify(procurementData);
      const shipmentData = {
        name,
        quantity,
        type: 'raw',
        location: supplier,
        destination,
        status: 'In Transit',
        packagingStatus: true,

      };
      const body2 = JSON.stringify(shipmentData);

      try {
        await axios
          .post('/api/transportation/addP', body2, {
            headers: {
              'x-auth-token': userToken,
              'Content-Type': 'application/json',
            },
          });
      } catch (err) {
        console.error(err);
      }
      try {
        await axios
          .post('/api/procurement/add', body, {
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
                <h2 className="mb-0">Procurement</h2>
                <Tooltip
                    title="Click here to add a new PO"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                >
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={() => {
                      closeModal();
                      setProcurementData({
                        name: '',
                        quantity: 0,
                        purchaser: '',
                        location: '',
                        value: 0,
                        date: '',

                      });
                    }}
                  >
                    Add Procurement
                  </Button>
                </Tooltip>
                <Tooltip
                    title="Click to export to PDF"
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
                      onClick={() => exportToJsonExcel('Procurement Orders', procurement)}
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
                              title="Select the name of the order being purchased ex: Leather"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="select"
                              placeholder="NAME"
                              name="name"
                              onChange={(e) => onChangeProcurementData(e)}
                            >
                              {[{ name: 'Select Material' }, ...materials].map((m) => (
                                <option>{m.name}</option>
                              ))}
                            </Input>
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter the quantity of material being purchased ex: 1"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="number"
                              placeholder="QUANTITY  (please use scroller on right)"
                              name="quantity"
                              onChange={(e) => onChangeProcurementData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter who supplied the material being bought ex: Leather Inc."
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="text"
                              placeholder="Supplier"
                              name="supplier"
                              onChange={(e) => onChangeProcurementData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter where the material being purchased will be delivered ex: Plant 1"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="select"
                              placeholder="Destination"
                              name="destination"
                              onChange={(e) => onChangeProcurementData(e)}

                            >
                              {[{ location: 'Select Destination' }, ...locations].map((l) => (
                                <option>{l.location}</option>
                              ))}
                            </Input>
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter th net value of the materials being purchased ex: 20"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="number"
                              placeholder="Net Value"
                              name="value"
                              onChange={(e) => onChangeProcurementData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                              title="Enter the date the materials were purchased"
                              arrow
                              placement="top-start"
                              enterDelay={750}
                          >
                            <Input
                              type="date"
                              placeholder="Date"
                              name="date"
                              onChange={(e) => onChangeProcurementData(e)}
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Tooltip
                            title="Click to create the PO order"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                        >
                          <Button color="primary" onClick={() => { addProcurement(); closeModal(); }}>
                            Add Procurement
                          </Button>
                        </Tooltip>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Tooltip
                        title="Cancel PO"
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
                    <th scope="col">Supplier</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Net Value</th>
                    <th scope="col">Date</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody style={{ overflow: 'auto' }}>
                  {procurement.map((t) => (
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
                      <td>{t.supplier}</td>
                      <td>{t.destination}</td>
                      <td>{t.value}</td>
                      <td>{t.date.substr(0, 10)}</td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <Tooltip
                              title="Delete PO"
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

export default Procurement;
