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
import { useLoading, Oval } from "@agney/react-loading";

const Production = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));

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
  const [updateProdSearch, setUpdateProdSearch] = useState(false);

  // Toggle product line modal
  const toggleAddModal = () => {
    setAddModal(!addModal);
  };
  const toggleCreateModal = () => setCreateModal(!createModal);

  // Toggle Transfer modal
  const toggleTransferModal = () => {
    setTransferModal(!transferModal);
  };

  // add new product line modal
  const [addModal, setAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdType, setNewProdType] = useState("final");
  const [prodMatList, setProdMatList] = useState([
    { matName: "Leather", matQuantity: 1 },
  ]);
  const [
    unstableAddInputsValidation,
    setUnstableAddInputValidation,
  ] = useState({ prodName: false, quantities: [true] });
  const [addErrorMessages, setAddErrorMessages] = useState({
    prodName: "Cannot have an empty product name",
    quantities: [""],
  });
  const [disabledAddNewProd, setDisableAddNewProd] = useState(true);

  // Transfer product
  const [transferModal, setTransferModal] = useState(false);
  const [disabledTransferModal, setDisableTransferModal] = useState(false);
  const [allLoc, setAllLoc] = useState([]);
  const [notCurLoc, setNotCurLoc] = useState([]);

  // create product modals
  const [createModal, setCreateModal] = useState(false);
  const [prodName, setProdName] = useState("");
  const [prodType, setProdType] = useState("");
  const [prodLoc, setProdLoc] = useState("");
  const [prodQuant, setProdQuant] = useState(1);
  const [
    unstableCreateInputsValidation,
    setUnstableCreateInputValidation,
  ] = useState({ quantity: true });
  const [createErrorMessages, setCreateErrorMessages] = useState({
    quantity: "",
  });
  const [disabledCreateNewProd, setDisableCreateNewProd] = useState(false);
  const [createProdOutputHTML, setCreateProdOutputHTML] = useState([]);
  const [hideCreateBtns, setHiddenCreateBtns] = useState(false);
  const [hideLoading, setHiddenLoading] = useState(true);

  // Loading Circle
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval color="#11cdef" width="50px" />,
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
    setUnstableAddInputValidation({ prodName: false, quantities: [true] });
    setAddErrorMessages({
      prodName: "Cannot have an empty product name",
      quantities: [""],
    });
    setDisableAddNewProd(true);
  };

  /**
   *
   * Initialize the transfer modal
   */
  const initTranferModal = () => {
    toggleTransferModal();
    setDisableTransferModal(true);
  };

  /**
   * Update the new product line name.
   *
   * @param {Event} e the triggered event
   */
  const onNewProdChange = (e) => {
    setNewProdName(e.target.value);
  };

  /**
   * Updates the adding product line modal's material value based on the events target.
   *
   * @param {Event} e the triggered event
   * @param {Number} index the material element's index in the modal
   */
  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    let title = name;
    if (name.includes("matQuantity")) {
      let splt = name.split("_");
      title = splt[0];
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
    const matInputs = [...inputs["quantities"]];
    matInputs.splice(index, 1);
    inputs["quantities"] = matInputs;
    setUnstableAddInputValidation(inputs);

    let messages = addErrorMessages;
    const matMess = [...messages["quantities"]];
    matMess.splice(index, 1);
    messages["quantities"] = matMess;
    setAddErrorMessages(messages);
  };
  /**
   * Adds a new material element to the adding product line modal in the last position with default values.
   */
  const addMaterial = () => {
    setProdMatList([...prodMatList, { matName: "Leather", matQuantity: 1 }]);

    let inputs = unstableAddInputsValidation;
    inputs["quantities"] = [...inputs["quantities"], true];
    setUnstableAddInputValidation(inputs);

    let messages = addErrorMessages;
    messages["quantities"] = [...messages["quantities"], ""];
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
    if (name == "prodName") {
      if (value.trim() == "") {
        valid = false;
        message = "Cannot have an empty product name";
      }
      product.forEach((prod) => {
        if (value.trim().toLowerCase() == prod.name.trim().toLowerCase()) {
          valid = false;
          message = "Cannot have two products with the same name";
          return;
        }
      });
      inputs[name] = valid;
      messages[name] = message;

      // Target is a quantity input
    } else {
      if (isNaN(value)) {
        valid = false;
        message = "Must be a number";
      } else if (value < 1) {
        valid = false;
        message = "Must be greater or equal to 1";
      }

      let idx = Number(name.split("_")[1]);
      inputs["quantities"][idx] = valid;
      messages["quantities"][idx] = message;
    }

    // Disable add new product line if all inputs are not valid.
    let isDisabled = !inputs["prodName"];
    inputs["quantities"].forEach((validQuant) => {
      if (!validQuant) {
        isDisabled = true;
      }
    });

    setDisableAddNewProd(isDisabled);
    setUnstableAddInputValidation(inputs);
    setAddErrorMessages(messages);
  };

  /**
   * Adds the new product defined in the modal to the database.
   *
   * @param {Event} e the triggered event.
   */
  const addProduct = async (e) => {
    let list = [];
    let names = [];
    for (let index = 0; index < prodMatList.length; index++) {
      const element = prodMatList[index];
      const idx = inArray(element["matName"], names);
      if (idx < 0) {
        names.push(element["matName"]);
        list = [...list, [element["matName"], element["matQuantity"]]];
      } else {
        list[idx] = [
          list[idx][0],
          parseInt(list[idx][1]) + parseInt(element["matQuantity"]),
        ];
      }
    }

    await axios
      .post(
        "/api/product_line/add",
        { name: newProdName, type: newProdType, material: list },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      )
      .then(() => {
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
  const initCreateModal = (name, type) => {
    toggleCreateModal();
    setProdName(name);
    setProdType(type);
    setProdQuant(1);
    setUnstableCreateInputValidation({ quantity: true });
    setCreateErrorMessages({ quantity: "" });
    setDisableCreateNewProd(false);
    setCreateProdOutputHTML([]);
    setHiddenCreateBtns(false);
  };

  /**
   * Update the product quantity of creating a product.
   *
   * @param {Event} e the triggered event
   */
  const onProdQuantChange = (e) => {
    setProdQuant(e.target.value);
  };

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
    if (name == "quantity") {
      if (isNaN(value)) {
        valid = false;
        message = "Must be a number";
      } else if (value < 1) {
        valid = false;
        message = "Must be greater or equal to 1";
      }
      inputs[name] = valid;
      messages[name] = message;
    }

    // Disable add new product line if all inputs are not valid.
    let isDisabled = !inputs["quantity"];

    setDisableCreateNewProd(isDisabled);
    setUnstableCreateInputValidation(inputs);
    setCreateErrorMessages(messages);
  };

  /**
   * Creating product from product line.
   */
  const createProduct = async () => {
    setHiddenCreateBtns(true);
    setHiddenLoading(false);

    // Get materials for product.
    let productLineMat;
    await axios
      .post(
        "/api/product_line",
        {
          name: prodName,
        },
        {
          headers: {
            "x-auth-token": userToken,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          productLineMat = response.data[0]["material"];
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    // Get each material from inventory
    let invalids = [];
    let allMaterials = [];
    productLineMat.forEach((element) => {
      const name = element[0];
      const num = element[1];

      axios
        .post(
          "/api/inventory/location",
          {
            name: name,
            location: prodLoc,
          },
          {
            headers: {
              "x-auth-token": userToken,
            },
          }
        )
        .then((response) => {
          if (response.data) {
            const material = response.data;
            const inInventory =
              material.length == 0 ? 0 : material[0]["quantity"];
            allMaterials = [...allMaterials, [name, num, inInventory]];
            if (inInventory < num * prodQuant) {
              invalids = [...invalids, [name, num * prodQuant, inInventory]];
            }

            // For the last material only, update the html output
            if (productLineMat[productLineMat.length - 1][0] == name) {
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
      if (invalids.length != 0) {
        invalids.forEach((element) => {
          const material = element[0];
          const need = element[1];
          const have = element[2];
          html = [
            ...html,
            <FormGroup>
              <Button className="btn-danger" disabled>
                Don't have enough of{" "}
                <label className="text-indigo strong">{material}</label> to make{" "}
                {prodQuant} {prodName} at your location ({prodLoc}).
                <br />
                Requires {need}, but only {have} in inventory.
              </Button>
            </FormGroup>,
          ];
        });
      } else {
        // Uncomment when inventory and quality is complete
        removeFromInventory(allMaterials);
        for (let index = 0; index < prodQuant; index++) {
          addToQuality([prodName, prodType, prodLoc]);
        }
        html = [
          <FormGroup>
            <Button className="btn-success" disabled>
              Successfully created {prodQuant}{" "}
              <label className="text-indigo strong">{prodName}</label> in{" "}
              {prodLoc}.
            </Button>
          </FormGroup>,
        ];
      }
      setHiddenLoading(true);
      setCreateProdOutputHTML(html);
    };

    const removeFromInventory = async (materials) => {
      await materials.forEach((element) => {
        const name = element[0];
        const numNeeded = element[1] * prodQuant;
        const inInventory = element[2];
        const loc = prodLoc;
        const newQuantity = inInventory - numNeeded;
        axios
          .put(
            "/api/inventory/superUpdate",
            {
              name: name,
              quantity: newQuantity,
              location: loc,
            },
            {
              headers: {
                "x-auth-token": userToken,
              },
            }
          )
          .catch(function (error) {
            console.log(error);
          });
      });
    };

    const addToQuality = async (product) => {
      const name = product[0];
      const type = product[1];
      const location = product[2];
      await axios
        .post(
          "/api/quality/add",
          {
            name: name,
            type: type,
            location: location,
          },
          {
            headers: {
              "x-auth-token": userToken,
            },
          }
        )
        .then((response) => {
          if (response.data) {
            materials = response.data[0]["material"];
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
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
          name: { $regex: "^" + formData, $options: "i" },
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
          name: { $regex: "^" + formProdData, $options: "i" },
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
    };
    getProdLoc();

    // Retrieve all possible plant location
    const getAllLoc = async (prodLoc) => {
      const response = await axios
        .get("/api/locations")
        .catch((err) => console.log("Error", err));
      if (response.data) {
        setAllLoc(response.data);
      }
    };
    getAllLoc();


    // Get all materials
    const getMaterialList = () => {
      axios
        .get("/api/material", {
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

  useEffect(() => {
    // All Locations that are not the users
    const getNotCurLoc = async () => {
     setNotCurLoc([]);
      if( prodLoc !== "")
     allLoc.forEach((loc) => {
       if (loc.location !== prodLoc) {
         setNotCurLoc(notCurLoc => [...notCurLoc, loc.location])
       } 
     });
   };
   getNotCurLoc();
     }, [allLoc, prodLoc]);  
     

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
                        onChange={(e) => {
                          onInvSearchChange(e);
                          setInvPage(0);
                        }}
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
                          initTranferModal();
                        }}
                      >
                        Transfer
                      </Button>
                      <Button
                        outline
                        color="primary"
                        onClick={() => {
                          //TODO: order from this tab or redirect to procurement tab
                        }}
                      >
                        Order
                      </Button>
                    </ButtonGroup>
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
                  {inventory
                    .slice(
                      invPage * NUM_OF_ITEMS_IN_A_PAGE,
                      (invPage + 1) * NUM_OF_ITEMS_IN_A_PAGE
                    )
                    .map((m) => (
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
                    <PaginationItem
                      className={invPage - 1 < 0 ? "disabled" : "active"}
                    >
                      <PaginationLink
                        href=""
                        onClick={() => setInvPage(invPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(
                      Array(
                        Math.ceil(inventory.length / NUM_OF_ITEMS_IN_A_PAGE)
                      ).keys()
                    )
                      .slice(
                        invPage - 1 < 0
                          ? invPage
                          : invPage - 2 < 0
                          ? invPage - 1
                          : invPage - 2,
                        invPage + 1 >= inventory.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? invPage + 2
                          : invPage + 3
                      )
                      .map((idx) => (
                        <PaginationItem
                          className={idx == invPage ? "active" : ""}
                        >
                          <PaginationLink
                            href=""
                            onClick={() => setInvPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem
                      className={
                        invPage + 1 >= inventory.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? "disabled"
                          : "active"
                      }
                    >
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
                        onChange={(e) => {
                          onProdSearchChange(e);
                          setProdPage(0);
                        }}
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
                  {product
                    .slice(
                      prodPage * NUM_OF_ITEMS_IN_A_PAGE,
                      (prodPage + 1) * NUM_OF_ITEMS_IN_A_PAGE
                    )
                    .map((m) => (
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
                    <PaginationItem
                      className={prodPage - 1 < 0 ? "disabled" : "active"}
                    >
                      <PaginationLink
                        href=""
                        onClick={() => setProdPage(prodPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(
                      Array(
                        Math.ceil(product.length / NUM_OF_ITEMS_IN_A_PAGE)
                      ).keys()
                    )
                      .slice(
                        prodPage - 1 < 0
                          ? prodPage
                          : prodPage - 2 < 0
                          ? prodPage - 1
                          : prodPage - 2,
                        prodPage + 1 >= product.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? prodPage + 2
                          : prodPage + 3
                      )
                      .map((idx) => (
                        <PaginationItem
                          className={idx == prodPage ? "active" : ""}
                        >
                          <PaginationLink
                            href=""
                            onClick={() => setProdPage(idx)}
                          >
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem
                      className={
                        prodPage + 1 >= product.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? "disabled"
                          : "active"
                      }
                    >
                      <PaginationLink
                        href=""
                        onClick={() => setProdPage(prodPage + 1)}
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
                    invalid={!unstableAddInputsValidation["prodName"]}
                    type="text"
                    name="prodName"
                    required
                    onChange={(e) => {
                      onNewProdChange(e);
                      validateUnstableAddInputs(e);
                    }}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">
                    Error: {addErrorMessages["prodName"]}
                  </FormFeedback>
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
                    onChange={(e) => {
                      setNewProdType(e.target.value);
                    }}
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
                        invalid={!unstableAddInputsValidation["quantities"][i]}
                        onChange={(e) => {
                          handleMaterialChange(e, i);
                          validateUnstableAddInputs(e);
                        }}
                      />
                      <FormFeedback className="invalid-tooltip" type="invalid">
                        Error: {addErrorMessages["quantities"][i]}
                      </FormFeedback>
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
                    onChange={(e) => {
                      onProdQuantChange(e);
                      validateUnstableCreateInputs(e);
                    }}
                    invalid={!unstableCreateInputsValidation["quantity"]}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">
                    Error: {createErrorMessages["quantity"]}
                  </FormFeedback>
                </InputGroup>
              </FormGroup>
              {createProdOutputHTML.map((m) => m)}
            </Form>
          </ModalBody>
          <ModalFooter>
            <FormGroup hidden={hideLoading}>
              <section {...containerProps}>{indicatorEl}</section>
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
              hidden={hideCreateBtns}
              color="secondary"
              onClick={toggleCreateModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/** Modal For Transfering Product*/}
      <div>
        <Modal isOpen={transferModal} toggle={toggleTransferModal}>
          <ModalHeader toggle={toggleTransferModal}>
            Transfer Products
          </ModalHeader>
          <ModalBody>
            <Form className="form" name="addProductForm">
              <FormGroup>
                <label>
                  <span className="text-muted">Your Location</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input disabled type="text" name="location" value={prodLoc} />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <label>
                  <span className="text-muted">Desired Location</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input
                    type="select"
                    name="location"
                    required
                    onChange={(e) => {
                      setNewProdType(e.target.value);
                    }}
                  >
                    {[...notCurLoc].map((m) => (
                      <option>{m}</option>
                    ))}
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
                        invalid={!unstableAddInputsValidation["quantities"][i]}
                        onChange={(e) => {
                          handleMaterialChange(e, i);
                          validateUnstableAddInputs(e);
                        }}
                      />
                      <FormFeedback className="invalid-tooltip" type="invalid">
                        Error: {addErrorMessages["quantities"][i]}
                      </FormFeedback>
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
              disabled={disabledTransferModal}
              color="primary"
              onClick={(e) => {
                //addProduct(e);
                // TODO send info to Transpo tab 
              }}
            >
              Confirm
            </Button>
            <Button color="secondary" onClick={toggleTransferModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Production;
