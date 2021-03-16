/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
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
import Header from '../../components/Headers/CardlessHeader';

const Transportation = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [transportation, setTransportation] = useState([]);
  const [packaging, setPackaging] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [complete, setComplete] = useState(false);
  const [transportationData, setTransportationData] = useState({
    _id: '',
    name: '',
    quantity: 0,
    type: '',
    location: '',
    destination: '',
    status: '',
  });
  const [tranPage, setTranPage] = useState(0);
  const [packPage, setPackPage] = useState(0);
  const [compPage, setCompPage] = useState(0);
  const NUM_OF_ITEMS_IN_A_PAGE = 15;
  const {
    name, quantity, type, location, destination,
  } = transportationData;
  const onChangeAdd = (e) => {
    setTransportationData({
      ...transportationData,
      [e.target.name]: e.target.value,
    });
  };
  // search input
  const [formData, setFormData] = useState('');

  const onChange = (e) => setFormData(e.target.value);

  const [updated, setUpdated] = useState(false);

  // Info for Modal
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  // Close Status Modal
  function closeModal() {
    setModal(!modal);
  }

  // Close Add Modal
  function closeModal1() {
    setModal1(!modal1);
  }

  // get shipmeny information
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      await axios
        .get('/api/transportation/packaging', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setPackaging(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
        await axios
        .get('/api/transportation/completed', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setCompleted(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      if (formData === '') {
        await axios
          .get('/api/transportation', {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setTransportation(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        const body = {
          name: { $regex: `^${formData}`, $options: 'i' },
        };
        await axios
          .post('/api/transportation', body, {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setTransportation(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    lookup();
  }, [formData, updated]);

 

  const onSetReady = async (_id) => {
    const id = {
      _id,
    };
    const body = JSON.stringify(id);
    try {
      await axios
        .post('/api/transportation/sendShipment', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          setUpdated(!updated);
        });
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const onAdd = async () => {
    if (
      name === ''
      || quantity === 0
      || location === ''
      || destination === 0
      || type === ''

    ) {
      alert('Please Enter Data Into All Fields');
    } else {
      closeModal1();

      const newTransportation = {
        name,
        quantity,
        type,
        location,
        destination,
        status: 'Awaiting Pickup',
      };

      const body = JSON.stringify(newTransportation);

      try {
        await axios
          .post('/api/transportation/add', body, {
            headers: {
              'x-auth-token': userToken,
              'Content-Type': 'application/json',
            },
          })
          .then(() => {
            setUpdated(!updated);
          });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const onChangeStatus = async (_id, status, name, type, quantity, destination) => {
   
    if(status == "Completed"){
      
      const data = { 
        name,
        type,
        quantity,
        location: destination,
      };
      const body = JSON.stringify(data);
      try {
        await axios
          .put('/api/inventory/superIncrement', body, {
            headers: {
              'x-auth-token': userToken,
              'Content-Type': 'application/json',
            },
          });
      } catch (err) {
        console.error(err);
      }


    }
    
    const data = {
      _id,
      status,
    };
    const body2 = JSON.stringify(data);

    try {
      await axios
        .post('/api/transportation/changeStatus', body2, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        }).then(closeModal).then(setUpdated(!updated));
    } catch (err) {
      console.error(err);
    }
  
  };

  const onDelete = async (_id) => {
    const shipmentId = {
      _id,

    };
    const body = JSON.stringify(shipmentId);
    try {
      await axios
        .post('/api/transportation/delete', body, {
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

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Inventory</h2>
                <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
                  <FormGroup className="mb-3 mt-3">
                    <InputGroup
                      className="input-group-alternative"
                      style={{ backgroundColor: '#2181EC' }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => { onChange(e); setTranPage(0); }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Form>

                <Button
                  className="mt-4"
                  color="primary"
                  onClick={() => {
                    closeModal1();
                    setTransportationData({
                      _id: '',
                      name: '',
                      quantity: 0,
                      type: '',
                      location: '',
                      destination: '',
                      status: '',
                    });
                  }}
                >
                  Add Shipment
                </Button>
                <Modal
                  isOpen={modal1}
                  changeStatus={closeModal1}
                >
                  <ModalHeader changeStatus={closeModal1}>
                    Fill In The Form Below
                  </ModalHeader>
                  <ModalBody>
                    <Form className="form" onSubmit={(e) => onAdd(e)}>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="NAME"
                            name="name"
                            onChange={(e) => onChangeAdd(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="number"
                            placeholder="QUANTITY  (please use scroller on right)"
                            name="quantity"
                            onChange={(e) => onChangeAdd(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="TYPE"
                            name="type"
                            onChange={(e) => onChangeAdd(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="LOCATION"
                            name="location"
                            onChange={(e) => onChangeAdd(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="DESTINATION"
                            name="destination"
                            onChange={(e) => onChangeAdd(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button color="primary" onClick={(e) => onAdd(e)}>
                          Add Shipment
                        </Button>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={closeModal1}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Status</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {transportation.slice(tranPage * NUM_OF_ITEMS_IN_A_PAGE, (tranPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((t) => (
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
                      <td>{t.type}</td>
                      <td>{t.location}</td>
                      <td>{t.destination}</td>
                      <td>{t.status}</td>
                      <td className="text-right" >
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
                              onClick={() => onChangeStatus(t._id, 'Awaiting Pickup')}
                            >
                              Awaiting Pickup
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onChangeStatus(t._id, 'In Transit')}
                            >
                              In Transit
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onChangeStatus(t._id, 'Completed',t.name,t.type,t.quantity,t.destination)}
                            >
                              Completed
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete Shipment
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={tranPage - 1 < 0 ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setTranPage(tranPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(Array(Math.ceil(transportation.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                      .slice(
                        tranPage - 1 < 0
                          ? tranPage
                          : tranPage - 2 < 0
                            ? tranPage - 1
                            : tranPage - 2,
                        tranPage + 1 >= transportation.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? tranPage + 2
                          : tranPage + 3,
                      )
                      .map((idx) => (
                        <PaginationItem className={idx === tranPage ? 'active' : ''}>
                          <PaginationLink
                            href=""
                            onClick={() => setTranPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem className={tranPage + 1 >= transportation.length / NUM_OF_ITEMS_IN_A_PAGE ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setTranPage(tranPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        <br />
        <br />

        {/* Packaging Table */}

        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Packaging</h2>
              </CardHeader>
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Destination</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {packaging.slice(packPage * NUM_OF_ITEMS_IN_A_PAGE, (packPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((t) => (
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
                      <td>{t.type}</td>
                      <td>{t.location}</td>
                      <td>{t.destination}</td>
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
                            <DropdownItem href="#pablo" onClick={() => onSetReady(t._id)}>
                              Ready
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete Shipment
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={packPage - 1 < 0 ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setPackPage(packPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(Array(Math.ceil(packaging.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                      .slice(packPage - 1 < 0 ? packPage : packPage - 2 < 0 ? packPage - 1 : packPage - 2, packPage + 1 >= packaging.length / NUM_OF_ITEMS_IN_A_PAGE ? packPage + 2 : packPage + 3)
                      .map((idx) => (
                        <PaginationItem className={idx === packPage ? 'active' : ''}>
                          <PaginationLink
                            href=""
                            onClick={() => setPackPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem className={packPage + 1 >= packaging.length / NUM_OF_ITEMS_IN_A_PAGE ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setPackPage(packPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        <br />
        <br />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Completed Shipments</h2>
              </CardHeader>
              <Table className="align-items-center table-flush mb-6" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Type</th>
                    <th scope="col">Location</th>
                    <th scope="col">Destination</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {completed.slice(compPage * NUM_OF_ITEMS_IN_A_PAGE, (compPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((t) => (
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
                      <td>{t.type}</td>
                      <td>{t.location}</td>
                      <td>{t.destination}</td>
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
                              Delete Shipment
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={compPage - 1 < 0 ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setCompPage(compPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(Array(Math.ceil(completed.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                      .slice(compPage - 1 < 0 ? compPage : compPage - 2 < 0 ? compPage - 1 : compPage - 2, compPage + 1 >= completed.length / NUM_OF_ITEMS_IN_A_PAGE ? compPage + 2 : compPage + 3)
                      .map((idx) => (
                        <PaginationItem className={idx === compPage ? 'active' : ''}>
                          <PaginationLink
                            href=""
                            onClick={() => setCompPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem className={compPage + 1 >= completed.length / NUM_OF_ITEMS_IN_A_PAGE ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setCompPage(compPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>

      </Container>
    </>
  );
};

export default Transportation;
