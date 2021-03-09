
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
  const [updatedQualityIndicies, setUpdatedQualityIndicies] = useState([]);

  // Search input
  const [qualityFormSearch, setQualityFormSearch] = useState("");
  const [updateSearch, setUpdateSearch] = useState(false);


  /* ------------------------
   * Functions for interacting with the HTML elements.
   * ------------------------
   */
  

  /**
   * Updates the quality value of a product in the quality data.
   * This function does not update the database directly, only a local variable.
   * 
   * @param {Array} product the quality product to alter quality
   * @param {String} value the new quality value
   */
  const changeProductQuality = (product, value) => {
    for (let index = 0; index < dirtyQualityData.length; index++) {
      const element = dirtyQualityData[index];
      if (element['_id'] == product['_id']){
        product['quality'] = value;
        dirtyQualityData.splice(index, 1, product);
        updatedQualityIndicies.splice(index, 1, true);
        setUpdateSearch(!updateSearch);
        break;
      }
    }
  }
  
  /**
   * Adds or updates the product to the database.
   * 
   * @param {Array} product the product to add to inventory
   */
  const addProductToInventory = async (product) => {
    const {name, type, location} = product;

    const material = await getInventoryItems(name, location);
    const inInventory = (material.length == 0 ? 0 : material[0]['quantity']);

    await putInventoryItem(name, type, location, inInventory + 1);
  }

  /**
   * Updates the quality table to remove any items with quality good or faulty.
   * If an item is good then it is added to the inventory database.
   */
  const updateQualityTable = async () => {
    
    for (let index = 0; index < dirtyQualityData.length; index++) {
      const product = dirtyQualityData[index];
      if (updatedQualityIndicies[index] && product['Quality'] != 'None'){
        switch (product['quality']) {
          case 'Good':
            await addProductToInventory(product);
            removeQualityProduct(product['_id']);
            break;
          case 'Faulty':
            removeQualityProduct(product['_id']);
            break;
        }
      }
    // End of for loop
    }
    
    // Update the quality table view
    getQualityData();
    setUpdateSearch(!updateSearch);
  }

  /**
   * Get quality information when searches are updated.
   */
  useEffect(() => {
    // retrieve quality information
    const qualityLookUp = async () => {
      if (qualityFormSearch === "") {
        setSearchQualityData(dirtyQualityData);
      } else {
        let searchResults = [];
        dirtyQualityData.forEach(element => {
          const name = element['name'];
          if (name.search(new RegExp('^' + qualityFormSearch,'i')) >= 0){
            searchResults = [...searchResults, element]
          }
        });
        setSearchQualityData(searchResults);
      }
    };
    qualityLookUp();
  }, [qualityFormSearch, dirtyQualityData, updateSearch]);

  /**
   * Initialize the quality information from the database.
   */
  useEffect(() => {
    getQualityData();
  }, []);
  

  /* ------------------------
   * Function that interact with database backend
   * ------------------------
   */


  /**
   * Retrieve all items in inventory with the specified name and location. 
   * It should return an array containing only 1 element based on the database conditions.
   * 
   * @param {String} name the name of the item
   * @param {String} location the location of the item
   * @returns 
   */
  const getInventoryItems = async (name, location) => {
    let material = [];
    await axios.post("/api/inventory/location", 
    { 
      name: name,
      location: location
    },
    {
      headers: {
      "x-auth-token": userToken,
      },
    })
    .then((response) => {
      if (response.data) {
        material = response.data;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    return material;
  }

  /**
   * Puts an item into inventory based on its name and location. 
   * If the item did not exist, then it is added as a new element. 
   * If the item already eisted, then the item is found in the database and only its quantity is updated.
   * 
   * @param {String} name the name of the item
   * @param {String} type the type of the item (raw, part, final)
   * @param {String} location the location of the item
   * @param {BigInteger} quantity the quantity of the item
   */
  const putInventoryItem = async (name, type, location, quantity) => {
    await axios.put("/api/inventory/superUpdate", 
    {
      name: name,
      type: type,
      location: location,
      quantity: quantity,
    },
    {
      headers: {
        "x-auth-token": userToken,
      },
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Gets all the quality data from the database.
   */
  const getQualityData = async () => {
    // Update the view from database
    await axios.get("/api/quality", 
    {
      headers: {
        "x-auth-token": userToken,
      },
    }).then((response) => {
      setDirtyQualityData(response.data);
      setUpdatedQualityIndicies(new Array(response.data.length).fill(false));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Remove a quality product from the quality database by its key.
   * 
   * @param {String} key the unique key that identifies a quality product
   */
  const removeQualityProduct = async (key) => {
    await axios.post("/api/quality/delete", 
    {
      _id: key,
    },
    {
      headers: {
        "x-auth-token": userToken,
      },
    })/*
    .then((response) => {
      if (response.data) {
        setDirtyQualityData(response.data);
        setUpdatedQualityIndicies(new Array(response.data.length).fill(false));
      }
    })*/
    .catch(function (error) {
      console.log(error);
    });
  }

  /* ------------------------
   * HTML display
   * ------------------------
   */

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
                              onClick={(e) => changeProductQuality(m,"None")}
                            >
                              None
                            </DropdownItem>
                            <DropdownItem
                              onClick={(e) => changeProductQuality(m,"Good")}
                            >
                              Good
                            </DropdownItem>
                            <DropdownItem
                              onClick={(e) => changeProductQuality(m,"Faulty")}
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
                    Apply Changes
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