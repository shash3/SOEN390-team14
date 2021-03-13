import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import ProductionHeader from "components/Headers/productionHeader.js";
import { inArray } from "jquery";
import { useLoading, Oval } from '@agney/react-loading';

const Production = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));
  const [userLoc, setUserLoc] = useState("");

  // database references
  const [inventory, setInventory] = useState([]);
  const [product, setProductLines] = useState([]);
  const [materials, setMaterials] = useState([]);

  // search input
  const [formData, setFormData] = useState("");
  const [formProdData, setFormProdData] = useState("");
  const [invPage, setInvPage] = useState(0);
  const [prodPage, setProdPage] = useState(0);

  const NUM_OF_ITEMS_IN_A_PAGE = 15;

  const onInvSearchChange = (e) => setFormData(e.target.value);
  const onProdSearchChange = (e) => setFormProdData(e.target.value);
  const [inventoryView, updateInventoryView] = useState(false);
  const [productlineView, updateProductlineView] = useState(false);


  // Toggle product line modal
  const toggleAddModal = () => {setAddModal(!addModal);}
  const toggleCreateModal = () => setCreateModal(!createModal);
  
  // add new product line modal
  const [addModal, setAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdType, setNewProdType] = useState("final");
  const [prodMatList, setProdMatList] = useState([{ matName: "Leather", matQuantity: 1 }]);
  const [unstableAddInputsValidation, setUnstableAddInputValidation] = useState({prodName: false, quantities:[true]});
  const [addErrorMessages, setAddErrorMessages] = useState({prodName: "Cannot have an empty product name", quantities:[""]});
  const [disabledAddNewProd, setDisableAddNewProd] = useState(true);

  // create product modals
  const [createModal, setCreateModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodType, setProdType] = useState("");
  const [prodQuant, setProdQuant] = useState(1);
  const [unstableCreateInputsValidation, setUnstableCreateInputValidation] = useState({quantity:true});
  const [createErrorMessages, setCreateErrorMessages] = useState({quantity:""});
  const [disabledCreateNewProd, setDisableCreateNewProd] = useState(false);
  const [createProdOutputHTML, setCreateProdOutputHTML] = useState([]);
  const [hideCreateBtns, setHiddenCreateBtns] = useState(false);
  const [hideLoading, setHiddenLoading] = useState(true);

  // Interact with the machines
  const MINUTES_TO_FINISH = 5;

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
    setNewProdType("final");
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
          type: newProdType,
          material: list
         },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      ).then(() => {
        updateProductlineView(!productlineView);
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
  const initCreateModal = (name, type) => {
    toggleCreateModal();
    setProdName(name);
    setProdType(type);
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

    /**
     * The main function to create the product.
     */
    const main = async () => {
      setHiddenCreateBtns(true);
      setHiddenLoading(false);

      try {
        // Get all available machine at the user's location.
        const availMachines = await returnAvailableMachines();
        console.log(availMachines);
  
        // Check if there are enough machines to make the products.
        if (prodQuant > availMachines.length) {
          const allMachines = await returnAllMachines();
          const nextAvailable = await returnNextAvailable(allMachines);
          setCreateProdOutputHTML(createNoMachineHTML(availMachines.length, nextAvailable));
          return;
        }
  
        // Get the materials to create the product.
        const materialList = await returnProductLine();
        const invalids = await returnInvalidMaterials(materialList);
        console.log(invalids);
  
        // Check if there is are materials with not enough quantity to make the products.
        if (invalids.length > 0){
          setCreateProdOutputHTML(createInvalidHTML(invalids));
          return;
        }
        
        // Start the process to create the product by removing from inventory and adding it to production machines. Indicate that it was successful.
        removeFromInventory(materialList);
        addToMachines(availMachines, prodName, prodType, prodQuant, userLoc);
        setCreateProdOutputHTML(createSuccessHTML());

      } finally {
        setHiddenLoading(true);
        updateInventoryView(!inventoryView);
      }
    }

    /**
     * Returns the finish_time of the machine that has an item and the smallest finish_time.
     * 
     * @param {Array} allMachines an array of all the production machines
     * @returns the smallest finish_time
     */
    const returnNextAvailable = (allMachines) => {
      let nextAvailable = null;
      allMachines.forEach(machine => {
        if (machine['item'] != '') {
          if (nextAvailable == null){
            nextAvailable = new Date(machine['finish_time']);
          } 
          const machineDate = new Date(machine['finish_time']);
          if (machineDate.valueOf() < nextAvailable.valueOf()) {
            nextAvailable = machineDate;
          }
        }
      });
      return nextAvailable;
    }

    /**
     * Loops through each material, which is an array composed of name and quantity, and determines if there is enough 
     * of that material in inventory to create the desired number of products. Returns an array containing the materials 
     * that did not have enough and the amount in inventory.
     * 
     * @param {Array} allMaterials an array of all materials needed to construct a product
     * @returns an array of materials that do not have enough quantity in inventory
     */
    const returnInvalidMaterials = async (allMaterials) => {
      let invalids = [];
      for (let index = 0; index < allMaterials.length; index++) {
        const material = allMaterials[index];
        const name = material[0];
        const num = material[1];
        const inInventory = await returnQuantityInInventory(name);
        
        if (inInventory < num * prodQuant){
          invalids = [...invalids, {name:name, quantNeed:num * prodQuant, quantHave:inInventory}];
        }
      }
      return invalids;
    }

    /**
     * Removes all the materials from inventory. Each material is composed of its name and the quantity to be removed.
     * 
     * @param {Array} materialList the materials to be removes from inventory 
     */
    const removeFromInventory = (materialList) => {
      materialList.forEach(material => {
        const name = material[0];
        const num = material[1];
        const quantity = num * prodQuant;
        decrementInventory(name, userLoc, quantity);
      });
    }

    /**
     * Adds the items to the production machines.
     * 
     * @param {Array} availableMachines the list of available production machines at the user's location
     * @param {String} name the name of the item to be produced
     * @param {String} type the type of the item
     * @param {BigInteger} quantity the number of items
     */
    const addToMachines = (availableMachines, name, type, quantity) => {
      for (let index = 0; index < quantity; index++) {
        const machine = availableMachines[index];
        addItemToMachine(machine['_id'], name, type)
      }
      
    }

    /**
     * Creates an array of HTML elements to indicate that there are not enough machines available.
     * 
     * @param {BigInteger} available the number of available machines
     * @param {Date} nextAvailTime the date of the next available machine
     * @returns An array of HTML elements
     */
    const createNoMachineHTML = (available, nextAvailTime) => {
      const html = [<FormGroup><Button className='btn-danger' disabled>There are not enough machines available at your location ({userLoc}). There are {available} available,
      the next available machine is at {nextAvailTime.toString()}.</Button></FormGroup>];
      return html;
    }

    /**
     * Creates an array of HTML elements to indicate that there are not enough of some materials available.
     * 
     * @param {Array} invalids list of materials with not enough quantity in inventory
     * @returns An array of HTML elements
     */
    const createInvalidHTML = (invalids) => {
      let html = [];
      invalids.forEach(element => {
        const {name, quantNeed, quantHave} = element;
        //const material = element['name'];
        //const need = element[''];
        //const have = element[2];
        html = [...html, <FormGroup><Button className='btn-danger' disabled>Don't have enough of <label className='text-indigo strong'>{name}</label> to 
        make {prodQuant} {prodName} at your location ({userLoc}).<br/>Requires {quantNeed}, but only {quantHave} in inventory.</Button></FormGroup>];
      });
      return html
    }

    /**
     * Creates an array of HTML elements to indicate that the creation of the material was successful.
     * 
     * @returns An array of HTML elements
     */
    const createSuccessHTML = () => {
      const html = [<FormGroup><Button className='btn-success' disabled>Successfully creating {prodQuant} <label className='text-indigo strong'>{prodName}</label> in 
      production machines at {userLoc}.</Button></FormGroup>];
      return html;
    }

    main();
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
  }, [formData, formProdData, productlineView, inventoryView]);

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
        setUserLoc(user.location);
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

  const returnAllMachines = () => {
    const response = axios.post("/api/machine/location",
      {
        location: userLoc
      },
      {
        headers: {
          "x-auth-token": userToken,
        },
      }
    ).then((response) => {
        return response.data;
      }
    ).catch((err) => console.log("Error", err));

    return response;
  }

  const returnAvailableMachines = () => {
    const response = axios.post("/api/machine/available",
      {
        location: userLoc
      },
      {
        headers: {
          "x-auth-token": userToken,
        },
      }
    ).then((response) => {
        return response.data;
      }
    ).catch((err) => console.log("Error", err));
    return response;
  }


  const returnProductLine = () => {
    // Get materials for product.
    const respoonse = axios.post("/api/product_line", 
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
        const productLineMat = response.data[0]['material'];
        return productLineMat;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
    return respoonse;
  }

  const returnQuantityInInventory = (name) => {
    const inInventory = axios.post("/api/inventory/location", 
    { 
      name: name,
      location: userLoc
    },
    {
      headers: {
      "x-auth-token": userToken,
      },
    }).then((response) => {
      if (response.data) {
        const material = response.data;
        const inInventory = (material.length == 0 ? 0 : material[0]['quantity']);
        return inInventory;
      }
    }).catch(function (error) {
      console.log(error);
    });
    return inInventory;
  }

  const decrementInventory = async (name, location, quantity) => {
    await axios.put("/api/inventory/decrement", 
    { 
      name: name,
      quantity: quantity,
      location: location
    },
    {
      headers: {
      "x-auth-token": userToken,
      },
    }).catch(function (error) {
      console.log(error);
    });
  }

  const addItemToMachine = async (machine_key, item, type) => {
    const final = new Date();
    final.setMinutes(new Date().getMinutes() + MINUTES_TO_FINISH);

    await axios.put("/api/machine/add",
    {
      _id:machine_key,
      item:item,
      type:type,
      finish_time:final.toISOString(),
    },
    {
      headers: {
        "x-auth-token": userToken,
      },
    }).catch((err) => console.log("Error", err)); 
  }




  /**
   * Checks if the machines are finished producing the part. Removes it from the 
   */
  const checkProductionFinished = () => {
    const main = () => {
      /*
      For each machine:
        if machine.hasItem AND machine.finish_time.valueOf() < new Date().valueOF():
          addToQuality();
          removeItemFromMachine();
      */
      addToQuality();
      removeItemFromMachine();
    }

    const addToQuality = async (product) => {
      const name = product[0];
      const type = product[1];
      const location = product[2];
      await axios.post("/api/quality/add", 
      { 
        name: name,
        type: type,
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
    
    const removeItemFromMachine = async (key) => {
      const final = new Date();
      final.setMinutes(new Date().getMinutes() + 5);
  
      await axios.put("/api/machine/remove",
      {
        _id:key,
      },
      {
        headers: {
          "x-auth-token": userToken,
        },
      }).catch((err) => console.log("Error", err));
    }
  }
  

  /* -------------------------
   * Returns the HTML code for the productino tab.
   * -------------------------
   */
  return (
    <>
      <ProductionHeader />
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
                        onChange={(e) => {onInvSearchChange(e); setInvPage(0);}}
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
                  {inventory.slice(invPage * NUM_OF_ITEMS_IN_A_PAGE, (invPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((m) => (
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
                    <PaginationItem className={invPage - 1 < 0 ? "disabled" : "active" }>
                      <PaginationLink
                        href=""
                        onClick={() => setInvPage(invPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(Array(Math.ceil(inventory.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                    .slice(invPage - 1 < 0 ? invPage : invPage - 2 < 0 ? invPage-1: invPage-2 , invPage + 1 >= inventory.length / NUM_OF_ITEMS_IN_A_PAGE ? invPage+2 : invPage+3 )
                    .map((idx) => (
                      <PaginationItem className={idx == invPage ? "active" : "" }>
                        <PaginationLink
                          href=""
                          onClick={() => setInvPage(idx)}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem className={invPage + 1 >= inventory.length / NUM_OF_ITEMS_IN_A_PAGE ? "disabled" : "active" }>
                      <PaginationLink
                        href=""
                        onClick={() => setInvPage(invPage + 1)}
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
                        onChange={(e) => {onProdSearchChange(e); setProdPage(0);}}
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
                  {product.slice(prodPage * NUM_OF_ITEMS_IN_A_PAGE, (prodPage + 1) * NUM_OF_ITEMS_IN_A_PAGE).map((m) => (
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
                            initCreateModal(m.name, m.type);
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
                    <PaginationItem className={prodPage - 1 < 0 ? "disabled" : "active" }>
                      <PaginationLink
                        href=""
                        onClick={() => setProdPage(prodPage-1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(Array(Math.ceil(product.length / NUM_OF_ITEMS_IN_A_PAGE)).keys())
                    .slice(prodPage - 1 < 0 ? prodPage : prodPage - 2 < 0 ? prodPage-1: prodPage-2 , prodPage + 1 >= product.length / NUM_OF_ITEMS_IN_A_PAGE ? prodPage+2 : prodPage+3 )
                    .map((idx) => (
                      <PaginationItem className={idx == prodPage ? "active" : "" }>
                        <PaginationLink
                          href=""
                          onClick={() => setProdPage(idx)}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem className={prodPage + 1 >= product.length / NUM_OF_ITEMS_IN_A_PAGE ? "disabled" : "active" }>
                      <PaginationLink
                        href=""
                        onClick={() => setProdPage(prodPage+1)}
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
                <label>
                  <span className="text-muted">Product Type</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input
                    type="select"
                    name="prodType"
                    required
                    onChange={(e) => {setNewProdType(e.target.value);}}
                  >
                    <option>final</option>
                    <option>part</option>
                  </Input>
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
                  <Input disabled type="text" name="location" value={userLoc} />
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
