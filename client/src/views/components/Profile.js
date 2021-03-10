import React, { useState, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Badge,
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import axios from "axios";

const Profile = () => {
  const userToken = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState({});
  const [allUser, setAllUser] = useState([]);
  const [newPermission, setNewPermission] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [changedPermition, setChangedPermition] = useState(false);
  // search input
  const [formData, setFormData] = useState("");
  const permission = JSON.parse(localStorage.getItem("permission"));
  const [modal, setModal] = useState(false);
  const [userPage, setUserPage] = useState(0);

  const NUM_OF_ITEMS_IN_A_PAGE = 15;
  //toggle for modal
  const toggle = () => setModal(!modal);
  const onChange = (e) => setFormData(e.target.value);

  // get user-profile user information
  useEffect(() => {
    const getUserInformation = async () => {
      const response = await axios
        .get("/api/auth", {
          headers: {
            "x-auth-token": userToken,
          },
        })
        .catch((err) => console.log("Error", err));
      if (response && response.data) {
        setUser(response.data);
      }
    };
    getUserInformation();
  }, []);

  // get user information search admin-panel
  useEffect(() => {
    // retrieve all users
    const lookup = async () => {
      if (formData === "") {
        const response = await axios
          .get("/api/auth/all", {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .catch((err) => console.log("Error", err));
        if (response && response.data) {
          setAllUser(response.data);
        }
      } else {
        console.log(formData);
        const body = {
          name: { $regex: "^" + formData, $options: 'i' },
        };
        const response = await axios
          .post("/api/auth/name", body, {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .catch((err) => console.log("Error", err));
        if (response && response.data) {
          setAllUser(response.data);
        }
      }
    };
    lookup();
  }, [formData, changedPermition]);

  //store dropdown value
  const handleClick = (e) => {
    setNewPermission(e);
  };

  //change submission
  const submitPermission = async () => {
    setChangedPermition(false);
    toggle();
    const body = {
      email: userEmail,
      permission: newPermission,
    };
    await axios
      .put("http://localhost:5000/api/auth/permission", body, {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .then((response) => {
        if (response) {
          setChangedPermition(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <UserHeader user={user} />
      {/* Page content */}
      {permission === "admin" && (
        <Container className="mt--7" fluid>
          {/* Table */}
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h2 className="mb-0">Registered accounts</h2>
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
                          onChange={(e) => {onChange(e); setUserPage(0);}}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Form>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Location</th>
                      <th scope="col">Permission</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {allUser.slice(userPage * NUM_OF_ITEMS_IN_A_PAGE, (userPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((t) => (
                      <tr key={t.id} value={t.id}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{t.name}</span>
                            </Media>
                          </Media>
                        </th>
                        <td>{t.email}</td>
                        <td>{t.location}</td>
                        <td>
                          <Badge color="" className="badge-dot mr-4">
                            <i className="bg-success" />
                            {t.permission}
                          </Badge>
                        </td>

                        <td className="text-right">
                          <UncontrolledDropdown
                            onClick={() => setUserEmail(t.email)}
                          >
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={toggle}>
                                Change Permission
                              </DropdownItem>

                              <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>
                                  Change account permission
                                </ModalHeader>
                                <ModalBody>
                                  Select permission &ensp;
                                  <Form>
                                    <br />
                                    <FormGroup tag="fieldset" row>
                                      <Col sm={10}>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              value="none"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            None
                                          </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              type="radio"
                                              name="radio2"
                                              value="production"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            Production
                                          </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              type="radio"
                                              name="radio2"
                                              value="transportation"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            Transportation
                                          </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              type="radio"
                                              name="radio2"
                                              value="finance"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            Finance
                                          </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              type="radio"
                                              name="radio2"
                                              value="assurance"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            Quality Assurance
                                          </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                          <Label check>
                                            <Input
                                              type="radio"
                                              name="radio2"
                                              type="radio"
                                              name="radio2"
                                              value="admin"
                                              onClick={(e) =>
                                                handleClick(e.target.value)
                                              }
                                            />{" "}
                                            Admin
                                          </Label>
                                        </FormGroup>
                                      </Col>
                                    </FormGroup>
                                  </Form>
                                </ModalBody>
                                <ModalFooter>
                                  <Button
                                    color="primary"
                                    type="submit"
                                    onClick={() => submitPermission()}
                                  >
                                    Change
                                  </Button>{" "}
                                  <Button color="secondary" onClick={toggle}>
                                    Cancel
                                  </Button>
                                </ModalFooter>
                              </Modal>

                              <DropdownItem onClick={(e) => e.preventDefault()}>
                                Change Location
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
                      <PaginationItem  className={userPage - 1 < 0 ? "disabled" : "active" }>
                        <PaginationLink
                          href=""
                          onClick={() => setUserPage(userPage - 1)}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>

                      {Array.from(Array(Math.ceil(allUser.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                      .slice(userPage - 1 < 0 ? userPage : userPage - 2 < 0 ? userPage-1: userPage-2 , userPage + 1 >= allUser.length / NUM_OF_ITEMS_IN_A_PAGE ? userPage+2 : userPage+3 )
                      .map((idx) => (
                        <PaginationItem className={idx == userPage ? "active" : "" }>
                          <PaginationLink
                            href=""
                            onClick={() => setUserPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem className={userPage + 1 >= allUser.length / NUM_OF_ITEMS_IN_A_PAGE ? "disabled" : "active" }>
                        <PaginationLink
                          href=""
                          onClick={() => setUserPage(userPage + 1)}
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
      )}
      {permission !== "admin" && (
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                      >
                        Settings
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue={user.name}
                              id="input-username"
                              placeholder="Username"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-email"
                              defaultValue={user.email}
                              type="email"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              First name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Lucky"
                              id="input-first-name"
                              placeholder="First name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-last-name"
                            >
                              Last name
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Jesse"
                              id="input-last-name"
                              placeholder="Last name"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                    <hr className="my-4" />
                    {/* Address */}
                    <h6 className="heading-small text-muted mb-4">
                      Contact information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-address"
                            >
                              Address
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                              id="input-address"
                              placeholder="Home Address"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-city"
                            >
                              City
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="New York"
                              id="input-city"
                              placeholder="City"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Country
                            </label>
                            <Input
                              className="form-control-alternative"
                              defaultValue="United States"
                              id="input-country"
                              placeholder="Country"
                              type="text"
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              Postal code
                            </label>
                            <Input
                              className="form-control-alternative"
                              id="input-postal-code"
                              placeholder="Postal code"
                              type="number"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Profile;
