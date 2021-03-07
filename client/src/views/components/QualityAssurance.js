
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
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";




const QualityAssurance = () => {
  const userToken = JSON.parse(localStorage.getItem("user"));


  // Quality database data
  const [dirtyQualityData, setDirtyQualityData] = useState([]);
  const [searchQualityData, setSearchQualityData] = useState([]);
  const [updatedQualityData, setUpdatedQuality] = useState([]);

  // Search input
  const [qualityFormSearch, setQualityFormSearch] = useState("");

  const changeProductQuality = (id, value) => {
    console.log();
  }

  const updateQualityTable = () => {

  }


  // get quality information when searches are updated.
  useEffect(() => {
    // retrieve quality information
    const qualityLookUp = async () => {
      if (qualityFormSearch === "") {
        await axios
          .get("/api/quality", {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setSearchQualityData(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        const body = {
          name: qualityFormSearch,
        };
        await axios
          .post("/api/quality", body, {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setSearchQualityData(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
    qualityLookUp();
  }, [qualityFormSearch]);

  useEffect(async () => {
      await axios
        .get("/api/quality", {
          headers: {
            "x-auth-token": userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setDirtyQualityData(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      
  });



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
                <h2 className="mb-0">Quality Parts</h2>
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
                        onChange={(e) => setQualityFormSearch(e.target.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Form>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Location</th>
                    <th scope="col">Quality</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {searchQualityData.map((m) => (
                    <tr key={m.id} value={m.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{m.name}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i className="bg-success" />
                          {m.location}
                        </Badge>
                      </td>
                      <td>{m.quality}</td>
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
                              onClick={(e) => changeProductQuality(m.id,"None")}
                            >
                              None
                            </DropdownItem>
                            <DropdownItem
                              onClick={(e) => changeProductQuality(m.id,"Good")}
                            >
                              Good
                            </DropdownItem>
                            <DropdownItem
                              onClick={(e) => changeProductQuality(m.id,"Faulty")}
                            >
                              Faulty
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <ButtonGroup>
                  <Button
                    onClick={() => {
                      updateQualityTable();
                    }}
                  >
                    Apply Update
                  </Button>
                </ButtonGroup>
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
        <></>
      </Container>
    </>
  );
};

export default QualityAssurance;