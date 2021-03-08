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
import { inArray } from "jquery";
import { useLoading, Oval } from '@agney/react-loading';

const Production = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));

  // database references
  const [inventory, setInventory] = useState([]);
  const [product, setProductLines] = useState([]);
  const [materials, setMaterials] = useState([]);

  // search input
  const [formData, setFormData] = useState("");
  const [formProdData, setFormProdData] = useState("");

  const onInvSearchChange = (e) => setFormData(e.target.value);
  const onProdSearchChange = (e) => setFormProdData(e.target.value);
  const [updateProdSearch, setUpdateProdSearch] = useState(false);

  // Toggle product line modal
  const toggleAddModal = () => {setAddModal(!addModal);}
  const toggleCreateModal = () => setCreateModal(!createModal);
  
  // add new product line modal
  const [addModal, setAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [prodMatList, setProdMatList] = useState([{ matName: "Leather", matQuantity: 1 }]);
  const [unstableAddInputsValidation, setUnstableAddInputValidation] = useState({prodName: false, quantities:[true]});
  const [addErrorMessages, setAddErrorMessages] = useState({prodName: "Cannot have an empty product name", quantities:[""]});
  const [disabledAddNewProd, setDisableAddNewProd] = useState(true);

  // create product modals
  const [createModal, setCreateModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodLoc, setProdLoc] = useState("");
  const [prodQuant, setProdQuant] = useState(1);
  const [unstableCreateInputsValidation, setUnstableCreateInputValidation] = useState({quantity:true});
  const [createErrorMessages, setCreateErrorMessages] = useState({quantity:""});
  const [disabledCreateNewProd, setDisableCreateNewProd] = useState(false);
  const [createProdOutputHTML, setCreateProdOutputHTML] = useState([]);
  const [hideCreateBtns, setHiddenCreateBtns] = useState(false);
  const [hideLoading, setHiddenLoading] = useState(true);

  // Loading Circle
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval color='#11cdef' width='50px'/>,
  });

  /* -------------------------
   * Functions dealing with the adding a new product line.
   * --------------------------
  */

  /**
   * Initialize the add product line modal with initial values.
   */
  const initAddModal = () => {
    toggleAddModal();
    setNewProdName("");
    setProdMatList([{ matName: "Leather", matQuantity: 1 }]);
    setUnstableAddInputValidation({prodName: false, quantities:[true]});
    setAddErrorMessages({prodName: "Cannot have an empty product name", quantities:[""]});
    setDisableAddNewProd(true);
  }

  /**
   * Update the new product line name.
   * 
   * @param {Event} e the triggered event
   */
  const onNewProdChange = (e) => {
    setNewProdName(e.target.value);
  }

  /**
   * Updates the adding product line modal's material value based on the events target.
   * 
   * @param {Event} e the triggered event
   * @param {Number} index the material element's index in the modal
   */
  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    let title = name
    if (name.includes('matQuantity')){
      let splt = name.split("_");
      title = splt[0]
    }
    const list = [...prodMatList];
    list[index][title] = value;
    setProdMatList(list);
  };
  
  /**
   * Removes a material element from the adding product line modal.
   * 
   * @param {Number} index the material element's index in the modal
   */
  const removeMaterial = (index) => {
    const list = [...prodMatList];
    list.splice(index, 1);
    setProdMatList(list);
    
    let inputs = unstableAddInputsValidation;
    const matInputs = [...inputs['quantities']];
    matInputs.splice(index, 1);
    inputs['quantities'] = matInputs;
    setUnstableAddInputValidation(inputs)

    let messages = addErrorMessages;
    const matMess = [...messages['quantities']];
    matMess.splice(index, 1);
    messages['quantities'] = matMess;
    setAddErrorMessages(messages);
  };
  /**
   * Adds a new material element to the adding product line modal in the last position with default values.
   */
  const addMaterial = () => {
    setProdMatList([...prodMatList, { matName: "Leather", matQuantity: 1 }]);

    let inputs = unstableAddInputsValidation;
    inputs['quantities'] = [...inputs['quantities'], true];
    setUnstableAddInputValidation(inputs);

    let messages = addErrorMessages;
    messages['quantities'] = [...messages['quantities'], ""];
    setAddErrorMessages(messages);
  };

  /**
   * Validates all the inputs that could be invalid and display an error message for adding a new product line. 
   * If any of the inputs are invalid, then the submit button is disabled.
   * 
   * @param {Event} e the triggered event
   */
  const validateUnstableAddInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const inputs = unstableAddInputsValidation;
    const messages = addErrorMessages;

    let valid = true;
    let message = "";

    // Target is a product name input
    if (name == "prodName"){
      if (value.trim() == ""){
        valid = false;
        message = 'Cannot have an empty product name';
      }
      product.forEach(prod => {
        if (value.trim().toLowerCase()  == prod.name.trim().toLowerCase()){
          valid = false;
          message = 'Cannot have two products with the same name';
          return;
        }
      });
      inputs[name] = valid;
      messages[name] = message;

      // Target is a quantity input
    }else{
      if (isNaN(value)){
        valid = false;
        message = "Must be a number";
      }else if (value < 1){
        valid = false;
        message = "Must be greater or equal to 1";
      }

      let idx = Number(name.split("_")[1]);
      inputs['quantities'][idx] = valid;
      messages['quantities'][idx] = message;
    }
    
    // Disable add new product line if all inputs are not valid.
    let isDisabled = !inputs['prodName'];
    inputs["quantities"].forEach(validQuant => {
      if (!validQuant){
        isDisabled = true;
      }
    });
    
    setDisableAddNewProd(isDisabled);
    setUnstableAddInputValidation(inputs);
    setAddErrorMessages(messages);
  }
  
  /**
   * Adds the new product defined in the modal to the database.
   * 
   * @param {Event} e the triggered event.
   */
  const addProduct = async (e) => {
    let list = []
    let names = []
    for (let index = 0; index < prodMatList.length; index++) {
      const element = prodMatList[index];
      const idx = inArray(element['matName'], names);
      if (idx < 0){
        names.push(element['matName'])
        list = [...list, [element['matName'], element['matQuantity']]];
      }else{
        list[idx] = [list[idx][0], parseInt(list[idx][1]) + parseInt(element['matQuantity'])];
      }
    }

    await axios
      .post(
        "/api/product_line/add",
        { name: newProdName,
          material: list
         },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      ).then(() => {
          setUpdateProdSearch(!updateProdSearch);
      })
      .catch((err) => console.log("Error", err));
  };

  /* -------------------------
   * Functions dealing with the creating a product from the product line.
   * --------------------------
   */

  /**
   * Initialize the create a product modal with initiaze values.
   * 
   * @param {String} name the name of the product to create
   */
  const initCreateModal = (name) => {
    toggleCreateModal();
    setProdName(name);
    setProdQuant(1);
    setUnstableCreateInputValidation({quantity:true});
    setCreateErrorMessages({quantity:""});
    setDisableCreateNewProd(false);
    setCreateProdOutputHTML([]);
    setHiddenCreateBtns(false);
  }

  /**
   * Update the product quantity of creating a product.
   * 
   * @param {Event} e the triggered event
   */
   const onProdQuantChange = (e) => {
    setProdQuant(e.target.value);
  }

  /**
   * Validates all the inputs that could be invalid and display an error message for creating a product.
   * If any of the inputs are invalid, then the submit button is disabled.
   * 
   * @param {Event} e the triggered event
   */
  const validateUnstableCreateInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const inputs = unstableCreateInputsValidation;
    const messages = createErrorMessages;

    let valid = true;
    let message = "";

    // Target is a product name input
    if (name == "quantity"){
      if (isNaN(value)){
        valid = false;
        message = "Must be a number";
      }else if (value < 1){
        valid = false;
        message = "Must be greater or equal to 1";
      }
      inputs[name] = valid;
      messages[name] = message; 
    }
    
    // Disable add new product line if all inputs are not valid.
    let isDisabled = !inputs['quantity'];
    
    setDisableCreateNewProd(isDisabled);
    setUnstableCreateInputValidation(inputs);
    setCreateErrorMessages(messages);
  }


  /**
   * Creating product from product line.
  */ 
  const createProduct = async () => {
    setHiddenCreateBtns(true);
    setHiddenLoading(false);

    // Get materials for product.
    let productLineMat;
    await axios.post("/api/product_line", 
    { 
      name: prodName
    },
    {
      headers: {
      "x-auth-token": userToken,
      },
    })
    .then((response) => {
      if (response.data) {
        productLineMat = response.data[0]['material'];
      }
    })
    .catch(function (error) {
      console.log(error);
    });

    // Get each material from inventory
    let invalids = [];
    let allMaterials = [];
    productLineMat.forEach(element => {
      
      const name = element[0];
      const num = element[1];

      axios.post("/api/inventory/location", 
      { 
        name: name,
        location: prodLoc
      },
      {
        headers: {
        "x-auth-token": userToken,
        },
      })
      .then((response) => {
        if (response.data) {
          const material = response.data;
          const inInventory = (material.length == 0 ? 0 : material[0]['quantity']);
          allMaterials = [...allMaterials, [name, num, inInventory]];
          if (inInventory < num * prodQuant){
            invalids = [...invalids, [name, num * prodQuant, inInventory]];
          }

          // For the last material only, update the html output
          if (productLineMat[productLineMat.length-1][0] == name){
            updateOutputHTML(invalids, allMaterials);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    });

    const updateOutputHTML = (invalids, allMaterials) => {
      let html = [];
      if (invalids.length != 0){
        invalids.forEach(element => {
          const material = element[0];
          const need = element[1];
          const have = element[2];
          html = [...html, <FormGroup><Button className='btn-danger' disabled>Don't have enough of <label className='text-indigo strong'>{material}</label> to 
          make {prodQuant} {prodName} at your location ({prodLoc}).<br/>Requires {need}, but only {have} in inventory.</Button></FormGroup>];
        });
      }else{
        // Uncomment when inventory and quality is complete
        removeFromInventory(allMaterials);
        for (let index = 0; index < prodQuant; index++) {
          addToQuality([prodName, prodLoc]);
        }
        html = [<FormGroup><Button className='btn-success' disabled>Successfully created {prodQuant} <label className='text-indigo strong'>{prodName}</label> in {prodLoc}.</Button></FormGroup>];
      }
      setHiddenLoading(true);
      setCreateProdOutputHTML(html);
    }
  
    const removeFromInventory = async (materials) => {


      await materials.forEach(element => {
        const name = element[0];
        const numNeeded = element[1] * prodQuant;
        const inInventory = element[2];

        axios.post("/api/inventory/remove", 
        { 
          name: name,
          quantity: inInventory - numNeeded,
        },
        {
          headers: {
          "x-auth-token": userToken,
          },
        })
        .catch(function (error) {
          console.log(error);
        });
      });
    }

    const addToQuality = async (product) => {
      const name = product[0];
      const location = product[1];
      await axios.post("/api/quality/add", 
      { 
        name: name,
        location: location,
      },
      {
        headers: {
        "x-auth-token": userToken,
        },
      })
      .then((response) => {
        if (response.data) {
          materials = response.data[0]['material'];
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  };

  

  /* -------------------------
   * Functions that retrieve information from databases.
   * -------------------------
   */

  // get inventory information when searches are updated.
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
          name: { $regex: "^" + formData, $options: 'i' },
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
          name: { $regex: "^" + formProdData, $options: 'i' },
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
  }, [formData, formProdData, updateProdSearch]);

  // Retrieve values only once.
  useEffect(() => {
    // Retrieve product line location from user
    const getProdLoc = async () => {
      const response = await axios.get("/api/auth", 
      {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .catch((err) => console.log("Error", err));
      if (response && response.data) {
        var user = response.data;
        setProdLoc(user.location);
      }
    };
    getProdLoc();

    // Get all materials
    const getMaterialList = () => {
      axios.get("/api/material", 
      {
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
  };
    getMaterialList();
  }, []);

  

  /* -------------------------
   * Returns the HTML code for the productino tab.
   * -------------------------
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
                            <span className="mb-0 text-sm">{m.name}</span>
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

        <br />
        <br />

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
                      style={{ padding: "0px 0px 0px 100px" }}
                    >
                      <Button
                        outline
                        color="primary"
                        onClick={() => {
                          initAddModal();
                        }}
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
                            <span className="mb-0 text-sm">{m.name}</span>
                          </Media>
                        </Media>
                      </th>
                      <td className="text-right">
                        <Button
                          onClick={() => {
                            initCreateModal(m.name);
                          }}
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
            <Form className="form" name="addProductForm">
              <FormGroup className="mb-3">
                <label>
                  <span className="text-muted">Product Name</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input
                    invalid={!unstableAddInputsValidation['prodName']}
                    type="text"
                    name="prodName"
                    required
                    onChange={(e) => {onNewProdChange(e);validateUnstableAddInputs(e);}}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">Error: {addErrorMessages['prodName']}</FormFeedback>
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                {prodMatList.map((x, i) => (
                  <div className="box">
                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: "100%",
                          display: "inline",
                          float: "left",
                          marginRight: "20px",
                          paddingRight: "50px",
                        }}
                      >
                        Material {i + 1}
                      </span>
                    </label>

                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: "10%",
                          display: "inline",
                          float: "right",
                          marginLeft: "20px",
                        }}
                      >
                        Quantity
                      </span>
                    </label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        type="select"

                        name={"matName"}
                        value={x.matName}
                        onChange={(e) => handleMaterialChange(e, i)}
                      >
                        {[...materials, ...product].map((m) => (
                          <option>{m.name}</option>
                        ))}
                      </Input>
                      <Input
                        style={{
                          width: "10%",
                          display: "inline",
                          float: "right",
                          marginLeft: "20px",
                        }}
                        type="number"
                        min="1"
                        className="ml10"
                        name={"matQuantity_" + i}
                        value={x.matQuantity}
                        invalid={!unstableAddInputsValidation['quantities'][i]}
                        onChange={(e) => {handleMaterialChange(e, i); validateUnstableAddInputs(e);}}
                      />
                      <FormFeedback className="invalid-tooltip" type="invalid">Error: {addErrorMessages['quantities'][i]}</FormFeedback>
                      {prodMatList.length !== 1 && (
                        <Button
                          color="secondary"
                          className="mr10"
                          onClick={() => removeMaterial(i)}
                        >
                          Remove
                        </Button>
                      )}
                    </InputGroup>
                  </div>
                ))}
              </FormGroup>
            </Form>
            <Button color="primary" onClick={addMaterial}>
              Add Another Material
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={disabledAddNewProd}
              color="primary"
              onClick={(e) => {
                addProduct(e);
                toggleAddModal();
              }}
            >
              Confirm
            </Button>
            <Button color="secondary" onClick={toggleAddModal}>
              Cancel
            </Button>
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
                  <Input disabled type="text" name="location" value={prodLoc} />
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
                    value={prodQuant}
                    min="1"
                    onChange={(e) => {onProdQuantChange(e); validateUnstableCreateInputs(e)}}
                    invalid={!unstableCreateInputsValidation['quantity']}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">Error: {createErrorMessages['quantity']}</FormFeedback>
                </InputGroup>
              </FormGroup>
                {createProdOutputHTML.map((m) => (
                  m
                ))}
            </Form>
          </ModalBody>
          <ModalFooter>
            <FormGroup
              hidden={hideLoading}
            >
              <section {...containerProps}>
                {indicatorEl}
              </section>
            </FormGroup>
              <Button
                hidden={hideCreateBtns}
                disabled={disabledCreateNewProd}
                color="primary"
                onClick={() => {
                  createProduct();
                }}
              >
                Confirm
              </Button>
              <Button 
                hidden = {hideCreateBtns}
                color="secondary" 
                onClick={toggleCreateModal}
              >
                Cancel
              </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Production;
