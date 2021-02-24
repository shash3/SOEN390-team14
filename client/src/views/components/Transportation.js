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
  UncontrolledTooltip, ModalHeader, ModalBody, ModalFooter, Button, Modal,
} from "reactstrap";
// core components
import Header from "components/Headers/CardlessHeader.js";

const Transportation = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));
  const [transportation, setTransportation] = useState([]);
  // search input
  const [formData, setFormData] = useState("");

  const onChange = (e) => setFormData(e.target.value);

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
          name: formData,
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
  }, [formData]);

  const {
    buttonLabel,
    className
  } = props;

  const [modal, setModal] = useState(false);
  function closeModal(){
    setModal(!modal);
  }

  const changeStatus= async(status, iid)=>{

    const sstatus = {
      status,
      iid
    };

    const body = JSON.stringify(sstatus);
    try{
      await axios.post("/api/transportation/changeStatus", body, { headers: {
      "x-auth-token": userToken,
        "Content-Type":"application/json"},});
    }
    catch(err){
      console.log(err.response.data);
    }
  }

  return (
    <>
      <Header/>
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
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">IID</th>
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
                    <tr key={t.id} value={t.iid}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                                  {t.iid}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{t.name}</td>
                      <td>{t.quantity}</td>
                      <td>
                          {t.location}
                      </td>
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
                            <DropdownItem
                              href="#pablo"
                              onClick={() =>changeStatus(t.status, t.iid)}
                            >
                              Change Status
                            </DropdownItem>
                            <Modal isOpen={modal} changeStatus={closeModal} className={className}>
                              <ModalHeader changeStatus={closeModal}>Modal title</ModalHeader>
                              <ModalBody>
                                Choose Status of Delivery
                              </ModalBody>
                              <ModalFooter>
                                <Button color="primary" onClick={closeModal}>Change Status</Button>{' '}
                                <Button color="secondary" onClick={closeModal}>Cancel</Button>
                              </ModalFooter>
                            </Modal>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
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
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
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
