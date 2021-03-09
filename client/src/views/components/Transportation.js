import React, { useState, useEffect } from "react";
import axios from "axios";
// reactstrap components
import {
  Badge,
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
  Progress,
  Table,
  Container,
  Row,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  UncontrolledTooltip,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Col,
} from "reactstrap";
// core components
import Header from "components/Headers/CardlessHeader.js";

const Transportation = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));
  const [transportation, setTransportation] = useState([]);
  const [transportationData, setTransportationData] = useState({
    _id: "",
    name: "",
    quantity: 0,
    location: "",
    destination: "",
    status: "",
  });
  const { name, quantity, location, destination, status } = transportationData;
  const onChangeAdd = (e) => {
    setTransportationData({
      ...transportationData,
      [e.target.name]: e.target.value,
    });
  };
  // search input
  const [formData, setFormData] = useState("");

  const onChange = (e) => setFormData(e.target.value);

  const [updated, setUpdated] = useState(false);

  // get shipmeny information
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      if (formData === "") {
        await axios
          .get("/api/transportation", {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setTransportation(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        const body = {
          name: { $regex: "^" + formData, $options: 'i' },
        };
        await axios
          .post("/api/transportation", body, {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setTransportation(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
    lookup();
  }, [formData, updated]);

  const onAdd = async (e) => {
    if (
      name == "" ||
      quantity == 0 ||
      location == "" ||
      destination == 0 ||
      status == ""
    ) {
      window.alert("Please Enter Data Into All Fields");
    } else {
      closeModal1();

      const newTransportation = {
        name,
        quantity,
        location,
        destination,
        status,
      };

      const body = JSON.stringify(newTransportation);

      try {
        await axios
          .post("/api/transportation/add", body, {
            headers: {
              "x-auth-token": userToken,
              "Content-Type": "application/json",
            },
          })
          .then(() => {
            setUpdated(!updated);
          });
      } catch (err) {
        console.log(err.response.data);
      }
    }
  };

  const onChangeStatus = async(_id,status) => {
    console.log(status);
    const data = {
      _id,
      status
    };
    const body = JSON.stringify(data);

     
    try {
      await axios
      .post("/api/transportation/changeStatus", body, {
        headers: {
          "x-auth-token": userToken,
          "Content-Type": "application/json",
        },
      }).then(closeModal).then(setUpdated(!updated));

  }
  catch (err) {
    console.log(err.response.data);
  }
}

  const onDelete = async (_id) => {
    const shipmentId = {
      _id,

    };

    console.log(_id);
    const body = JSON.stringify(shipmentId);
    try {
      await axios
        .post("/api/transportation/delete", body, {
          headers: {
            "x-auth-token": userToken,
            "Content-Type": "application/json",
          },
        })
        .then(setUpdated(!updated));
    } catch (err) {
      console.log(err.response.data);
    }
  };

  //Info for Modal
  const { buttonLabel, className } = props;
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  //Close Status Modal
  function closeModal() {
    setModal(!modal);
  }

  //Close Add Modal
  function closeModal1() {
    setModal1(!modal1);
  }

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
                      style={{ backgroundColor: "#2181EC" }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => onChange(e)}
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
                      _id: "",
                      name: "",
                      quantity: 0,
                      location: "",
                      destination: "",
                      status: "",
                    });
                  }}
                >
                  Add Shipment
                </Button>
                <Modal
                  isOpen={modal1}
                  changeStatus={closeModal1}
                  className={className}
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
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            placeholder="STATUS"
                            name="status"
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
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Location</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Status</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {transportation.map((t) => (
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
                      <td>{t.location}</td>
                      <td>{t.destination}</td>
                      <td>{t.status}</td>
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
                            <DropdownItem href="#pablo" onClick={closeModal}>
                              Change Status
                            </DropdownItem>
                            <Modal
                              isOpen={modal}
                              changeStatus={closeModal}
                              className={className}
                            >
                              <ModalHeader changeStatus={closeModal}>
                                Change Status
                              </ModalHeader>
                              <ModalBody>Choose Status of Delivery
                                <Form className="changeStatusForm">
                                  <FormGroup>
                                    <div className="custom-control custom-control-alternative custom-radio mb-3">
                                      <input
                                          className="custom-control-input"
                                          id="customRadio1"
                                          name="custom-radio-1"
                                          type="radio"
                                      />
                                      <label className="custom-control-label" htmlFor="customRadio1">
                                        In Transit
                                      </label>
                                    </div>
                                    <div className="custom-control custom-control-alternative custom-radio mb-3">
                                      <input
                                          className="custom-control-input"
                                          id="customRadio2"
                                          name="custom-radio-1"
                                          type="radio"
                                      />
                                      <label className="custom-control-label" htmlFor="customRadio2">
                                        Reached Destination
                                      </label>
                                    </div>
                                    <div className="custom-control custom-control-alternative custom-radio mb-3">
                                      <input
                                          className="custom-control-input"
                                          id="customRadio3"
                                          name="custom-radio-1"
                                          type="radio"
                                      />
                                      <label className="custom-control-label" htmlFor="customRadio3">
                                        Awaiting Pickup
                                      </label>
                                    </div>
                                  </FormGroup>
                                </Form>
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={(e)=> onChangeStatus(t._id,t.status)}>
                                  Change Status
                                </Button>{" "}
                                <Button color="secondary" onClick={closeModal}>
                                  Cancel
                                </Button>
                              </ModalFooter>
                            </Modal>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => onDelete(t._id)}
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
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Transportation;
