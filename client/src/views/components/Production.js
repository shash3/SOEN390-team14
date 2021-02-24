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
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const Production = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));

  // database references
  const [inventory, setInventory] = useState([]);
  const [product, setProductLines] = useState([]);
  const [materials, setMaterials] = useState([]);

  // search input
  const [formData, setFormData] = useState("");
  const [formProdData, setFormProdData] = useState("");

  const onInvSearchChange = (e) => setFormData(e.target.value );
  const onProdSearchChange = (e) => setFormProdData(e.target.value);


  // create product line modals
  const [addModal, setAddModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodLoc, setProdLoc] = useState("");

  const [newProdName, setNewProdName] = useState("");
  const onNewProdChange = (e) => setNewProdName(e.target.value);

  // Toggle product line modal
  const toggleAddModal = () => setAddModal(!addModal);
  const toggleCreateModal = () => setCreateModal(!createModal);
  
  // Retrieve product line location from user
  const getProdLoc = async () => {
    const response = await axios
      .get("/api/auth", {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .catch((err) => console.log("Error", err));
      if (response && response.data) {
        var user = response.data;
        setProdLoc(user.location);
      }
  }
  getProdLoc();

  // Material options for new product modal
  const [prodMatList, setProdMatList] = useState([{ matName: "", matQuantity: 1 }]);
 
  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...prodMatList];
    list[index][name] = value;
    setProdMatList(list);
  };
  const removeMaterial = index => {
    const list = [...prodMatList];
    list.splice(index, 1);
    setProdMatList(list);
  };
  const addMaterial = () => {
    setProdMatList([...prodMatList, { matName: "", matQuantity: 1 }]);
  };

  // Adding new Product Line
  const addProduct = async () => {
    //validate entries
    prodMatList.forEach((prodName, quant) => {
      
    });

    await axios
      .post("/api/product_line/add", 
        { name : newProdName}, 
        { headers: {
          "x-auth-token": userToken,
        },
      })
      .catch((err) => console.log("Error", err));
  }
  

  // Creating product from product line
  const createProduct = async () => {

  }


  // get inventory information
  useEffect(() => {
    // retrieve inventory information
    const invLookup = async () => {
      if (formData === "") {
        await axios
          .get("/api/inventory", {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setInventory(response.data);
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
          .post("/api/inventory", body, {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setInventory(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
    invLookup();

    // retrieve production line information
    const prodLookup = async () => {
      if (formProdData === "") {
        await axios
          .get("/api/product_line", {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setProductLines(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        const body = {
          name: formProdData,
        };
        await axios
          .post("/api/product_line", body, {
            headers: {
              "x-auth-token": userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setProductLines(response.data);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    };
    prodLookup();

  }, [formData, formProdData]);

  
  // Get all materials
  const getMaterialList = () => {
    axios.get("/api/material", {
      headers: {
        "x-auth-token": userToken,
      },
    })
    .then((response) => {
      if (response.data) {
        setMaterials(response.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getMaterialList();





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
                        onChange={(e) => onInvSearchChange(e)}
                      />
                    </InputGroup>
                  </FormGroup>
                </Form>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Location</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((m) => (
                    <tr key={m.id} value={m.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              {m.name}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{m.quantity}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          <i className="bg-success" />
                          {m.location}
                        </Badge>
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
                              onClick={(e) => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                            >
                              Something else here
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

        <br/>
        <br/>

        {/* Product Line Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Product Line</h2>
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
                        onChange={(e) => onProdSearchChange(e)}
                      />
                    </InputGroup>
                    <ButtonGroup
                      className="btn-group-sm"
                      style={{ padding : "0px 0px 0px 100px" }}
                    >
                      <Button 
                        outline 
                        color="primary"
                        onClick={() => {toggleAddModal(); setProdMatList([{ matName: "", matQuantity: 1 }]);}}
                      >
                        Add New Product Line
                      </Button>
                    </ButtonGroup>
                  </FormGroup>
                </Form>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {product.map((m) => (
                    <tr key={m.id} value={m.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">
                              {m.name}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td className="text-right">
                        <Button
                          onClick={() => {toggleCreateModal(); setProdName(m.name);}}
                        >
                          Create
                        </Button>
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
      
      {/** Modal For Add Product*/}
      <div>
      <Modal isOpen={addModal} toggle={toggleAddModal}>
        <ModalHeader toggle={toggleAddModal}>Add New Product</ModalHeader>
        <ModalBody>
          <Form className="form" name='addProductForm'>
            <FormGroup className="mb-3">
              <label>
                <span className="text-muted">Product Name</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Input
                  type="text"
                  name="prodName"
                  required
                  onChange={(e) => onNewProdChange(e)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup className="mb-3">
              {prodMatList.map((x, i) => (
                <div className="box">
                  <label>
                    <span className="text-muted" style={{ width: '100%', display: 'inline', float: 'left', marginRight: '20px', paddingRight: '50px'}}>Material {i + 1}</span>
                  </label>
                    
                  <label>
                    <span className="text-muted" style={{ width : '10%', display: 'inline', float: 'right', marginLeft: '20px' }}>Quantity</span>
                  </label>
                  <InputGroup className="input-group-alternative">
                    <Input
                      type="select"
                      name="matName"
                      value={x.matName}
                      onChange={e => handleMaterialChange(e, i)}
                    >
                      {materials.map((m) => (
                        <option>{m.name}</option>
                      ))}
                    </Input>
                    <Input style={{ width : '10%', display: 'inline', float: 'right', marginLeft: '20px' }}
                      type="number"
                      min="1"
                      className="ml10"
                      name="matQuantity"
                      value={x.matQuantity}
                      onChange={e => handleMaterialChange(e, i)}
                    />
                    {prodMatList.length !== 1 && <Button
                      color="secondary"
                      className="mr10"
                      onClick={() => removeMaterial(i)}>Remove</Button>
                    }
                  </InputGroup>
                </div>
              ))}
            </FormGroup>
          </Form>
          <Button color="primary" onClick={addMaterial}>Add Another Material</Button>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {toggleAddModal(); addProduct();}}>Confirm</Button>
          <Button color="secondary" onClick={toggleAddModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>


    {/** Modal For Create Product*/}
    <div>
      <Modal isOpen={createModal} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Create Product</ModalHeader>
        <ModalBody>
          <Form className="form">
            <FormGroup className="mb-3">
              <label>
                <span className="text-muted">Product Name</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Input
                  disabled 
                  type="text"
                  name="prodName"
                  value={prodName}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <label>
                <span className="text-muted">Location</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Input
                  disabled
                  type="text"
                  name="location"
                  value={prodLoc}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <label>
                <span className="text-muted">Quantity</span>
              </label>
              <InputGroup className="input-group-alternative">
                <Input
                  type="number"
                  name="quantity"
                  defaultValue="1"
                  min="1"
                />                  
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {toggleCreateModal();  createProduct()}}>Confirm</Button>
          <Button color="secondary" onClick={toggleCreateModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>

    </>
  );
};

export default Production;
