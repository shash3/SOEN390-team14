/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
  Table,
  Container,
  Row,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormFeedback,
} from 'reactstrap';

// core components
import { inArray } from 'jquery';
import { useLoading, Oval } from '@agney/react-loading';
import Tooltip from '@material-ui/core/Tooltip';
import ProductionHeader from '../../components/Headers/productionHeader.jsx';

const Production = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [userLoc, setUserLoc] = useState('');

  // database references
  const [inventory, setInventory] = useState([]);
  const [product, setProductLines] = useState([]);
  const [materials, setMaterials] = useState([]);

  // search input
  const [formData, setFormData] = useState('');
  const [formProdData, setFormProdData] = useState('');
  const [invPage, setInvPage] = useState(0);
  const [prodPage, setProdPage] = useState(0);

  const NUM_OF_ITEMS_IN_A_PAGE = 15;

  const onInvSearchChange = (e) => setFormData(e.target.value);
  const onProdSearchChange = (e) => setFormProdData(e.target.value);
  const [inventoryView, updateInventoryView] = useState(false);
  const [productlineView, updateProductlineView] = useState(false);

  // Add new product line modal
  const [addModal, setAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdType, setNewProdType] = useState('final');
  const [disabledAddNewProd, setDisableAddNewProd] = useState(true);

  // Shared between new product line & transfer product
  const [materialList, setMaterialList] = useState([{ matName: '', matQuantity: 1 }]);
  const [unstableInputValidation, setUnstableInputValidation] = useState({ prodName: false, quantities: [true] });
  const [errorMessages, setErrorMessages] = useState({ prodName: 'Cannot have an empty product name', quantities: [''] });

  // Transfer product
  const [transferModal, setTransferModal] = useState(false);
  const [allLoc, setAllLoc] = useState([]);
  const [notCurLoc, setNotCurLoc] = useState([]);
  const [locRetrieval, setLocRetrieval] = useState('');
  const [disabledTransferButton, setDisableTransferButton] = useState(false);
  const [createTransferOutputHTML, setCreateTransferOutputHTML] = useState([]);

  // Shared between create product & transfer product
  const [hideConfirmBtns, setHiddenConfirmBtns] = useState(false);
  const [hideLoading, setHiddenLoading] = useState(true);

  // create product modals
  const [createModal, setCreateModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodType, setProdType] = useState('');
  const [prodQuant, setProdQuant] = useState(1);
  const [unstableCreateInputsValidation, setUnstableCreateInputValidation] = useState({ quantity: true });
  const [createErrorMessages, setCreateErrorMessages] = useState({ quantity: '' });
  const [disabledCreateNewProd, setDisableCreateNewProd] = useState(false);
  const [createProdOutputHTML, setCreateProdOutputHTML] = useState([]);

  // Loading Circle
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Oval color="#11cdef" width="50px" />,
  });

  // Toggle product line modal
  const toggleAddModal = () => {
    setAddModal(!addModal);
  };
  const toggleCreateModal = () => setCreateModal(!createModal);

  // Toggle Transfer modal
  const toggleTransferModal = () => {
    setTransferModal(!transferModal);
  };

  /* ---------------------------
   * Functions To Refresh Production Machines
   * ---------------------------
   */

  const [refreshMachine, setRefreshMachine] = useState(false);
  /**
   * Set a timer to refresh every few seconds.
   */
  useEffect(() => {
    let refresh = true;
    setInterval(() => { setRefreshMachine(refresh); refresh = !refresh; }, 1000 * 15);
  }, []);

  /**
   * Checks if the machines are finished producing the part. Removes it from the machine and adds it to quality assurance.
   */
  useEffect(async () => {
    const returnUnavailableMachines = () => {
      const reply = axios.post('/api/machine/unavailable',
        {
          location: userLoc,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }).then((response) => response.data).catch((err) => console.error('Error', err));
      return reply;
    };

    const addToQuality = async (name, type, location) => {
      await axios.post('/api/quality/add',
        {
          name,
          type,
          location,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }).catch((error) => {
        console.error(error);
      });
    };

    const removeItemFromMachine = async (key) => {
      await axios.put('/api/machine/remove',
        {
          _id: key,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }).catch((err) => console.error('Error', err));
    };

    const main = async () => {
      if (userLoc === undefined) {
        return;
      }
      const machines = await returnUnavailableMachines();
      for (let index = 0; index < machines.length; index += 1) {
        const machine = machines[index];
        if ((new Date(machine.finish_time)).valueOf() < (new Date()).valueOf()) {
          await addToQuality(machine.item, machine.type, userLoc);
          await removeItemFromMachine(machine._id);
        }
      }
    };

    main();
  }, [refreshMachine]);

  /* -------------------------
   * Functions that retrieve information from databases.
   * -------------------------
   */

  // get inventory information when searches are updated.
  useEffect(() => {
    // retrieve inventory information
    const invLookup = async () => {
      if (formData === '') {
        await axios
          .get('/api/inventory', {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setInventory(response.data);
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
          .post('/api/inventory', body, {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setInventory(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    invLookup();

    // retrieve production line information
    const prodLookup = async () => {
      if (formProdData === '') {
        await axios
          .get('/api/product_line', {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setProductLines(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        const body = {
          name: { $regex: `^${formProdData}`, $options: 'i' },
        };
        await axios
          .post('/api/product_line', body, {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setProductLines(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    prodLookup();
  }, [formData, formProdData, productlineView, inventoryView]);

  // Retrieve values only once.
  useEffect(() => {
    // Retrieve product line location from user
    const getUserLoc = async () => {
      const response = await axios
        .get('/api/auth', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err));
      if (response && response.data) {
        const user = response.data;
        setUserLoc(user.location);
      }
    };
    getUserLoc();

    // Retrieve all possible plant location
    const getAllLoc = async () => {
      const response = await axios
        .get('/api/locations')
        .catch((err) => console.error('Error', err));
      if (response.data) {
        setAllLoc(response.data);
      }
    };
    getAllLoc();

    // Get all materials
    const getMaterialList = () => {
      axios
        .get('/api/material', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setMaterials(response.data);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getMaterialList();
  }, []);

  useEffect(() => {
    // All Locations that are not the users
    const getNotCurLoc = async () => {
      setNotCurLoc([]);
      if (userLoc !== '') {
        allLoc.forEach((loc) => {
          if (loc.location !== userLoc) {
            setNotCurLoc((notLoc) => [...notLoc, loc.location]);
          }
        });
      }
    };
    getNotCurLoc();
  }, [allLoc, userLoc]);

  /**
   * Returns all production machines at the location.
   *
   * @param {String} location the location of the machines
   * @returns all production machines
   */
  const returnAllMachines = (location) => {
    const reply = axios.post('/api/machine/location',
      {
        location,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => response.data).catch((err) => console.error('Error', err));

    return reply;
  };

  /**
   * Returns available production machines at the location.
   *
   * @param {String} location the location of the machines
   * @returns available production machines
   */
  const returnAvailableMachines = (location) => {
    const reply = axios.post('/api/machine/available',
      {
        location,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => response.data).catch((err) => console.error('Error', err));
    return reply;
  };

  /**
   * Returns an array of materials from a product line. Each material is a tuple made up of the name and the quantity.
   *
   * @param {String} productName the name of the product line
   * @returns the materials for the product line
   */
  const returnProductLine = (productName) => {
    // Get materials for product.
    const reply = axios.post('/api/product_line',
      {
        name: productName,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then((response) => {
        if (response.data) {
          const productLineMat = response.data[0].material;
          return productLineMat;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return reply;
  };

  /**
   * Returns the quantity of an item at a location in inventory. If the item does not exist, then it returns 0.
   *
   * @param {String} name the name of the item in inventory
   * @param {String} location the location of the item
   * @returns the quantity of the item
   */
  const returnQuantityInInventory = (name, location) => {
    const reply = axios.post('/api/inventory/location',
      {
        name,
        location,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => {
      if (response.data) {
        const material = response.data;
        const inInventory = (material.length === 0 ? 0 : material[0].quantity);
        return inInventory;
      }
    }).catch((error) => {
      console.error(error);
    });
    return reply;
  };

  /**
   * Decrements a given quantity of items at a location from inventory.
   *
   * @param {String} name the name of the item
   * @param {String} location the location of the item
   * @param {BigInteger} quantity the number of items to remove
   */
  const decrementInventory = async (name, location, quantity) => {
    await axios.put('/api/inventory/decrement',
      {
        name,
        quantity,
        location,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((error) => {
      console.error(error);
    });
  };

  /**
   * Adds an item into the machine. The item will be complete to be added to quality assurance after "MINUTE_TO_FINISH" is done.
   *
   * @param {String} machineKey the key for the product machine
   * @param {String} item name of the item to add
   * @param {String} type the type of item
   */
  const addItemToMachine = async (machineKey, item, type) => {
    const MINUTES_TO_FINISH = 5;
    const final = new Date();
    final.setMinutes(new Date().getMinutes() + MINUTES_TO_FINISH);

    await axios.put('/api/machine/add',
      {
        _id: machineKey,
        item,
        type,
        finish_time: final.toISOString(),
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((err) => console.error('Error', err));
  };

  /**
   * Creates a product line and adds it to the database.
   *
   * @param {String} name the name of the item
   * @param {String} type the type of item
   * @param {Array} material the array containing the material name and quantity
   */
  const addProductLine = async (name, type, material) => {
    await axios
      .post('/api/product_line/add',
        { name, type, material },
        {
          headers: {
            'x-auth-token': userToken,
          },
        })
      .catch((err) => console.error('Error', err));
  };

  /**
   * Adds a shipment request to the transportation department.
   *
   * @param {String} name the name of the material
   * @param {BigInteger} quantity the quantity of the material
   * @param {String} type the type of item
   * @param {String} location the origin location
   * @param {String} destination the destination location
   */
  const addTransportationShipment = async (name, quantity, type, location, destination) => {
    await axios
      .post('/api/transportation/add',
        {
          name, quantity, type, location, destination, status: 'Awaiting Pickup',
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }).catch((err) => console.error('Error', err));
  };

  /* ---------------------------
   * Functions for both new product line and transfer product.
   * ---------------------------
   */

  /**
     * Updates the adding product line modal's material value based on the events target.
     *
     * @param {Event} e the triggered event
     * @param {Number} index the material element's index in the modal
     */
  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    let title = name;
    if (name.includes('matQuantity')) {
      const splt = name.split('_');
      [title] = splt;
    }
    const list = [...materialList];
    list[index][title] = value;
    setMaterialList(list);
  };

  /**
   * Removes a material element from the adding product line modal.
   *
   * @param {Number} index the material element's index in the modal
   */
  const removeMaterial = (index) => {
    const list = [...materialList];
    list.splice(index, 1);
    setMaterialList(list);

    const inputs = unstableInputValidation;
    const matInputs = [...inputs.quantities];
    matInputs.splice(index, 1);
    inputs.quantities = matInputs;
    setUnstableInputValidation(inputs);

    const messages = errorMessages;
    const matMess = [...messages.quantities];
    matMess.splice(index, 1);
    messages.quantities = matMess;
    setErrorMessages(messages);
  };

  /**
   * Adds a new material element to the adding product line modal in the last position with default values.
   */
  const addMaterial = () => {
    setMaterialList([...materialList, { matName: materials[0].name, matQuantity: 1 }]);

    const inputs = unstableInputValidation;
    inputs.quantities = [...inputs.quantities, true];
    setUnstableInputValidation(inputs);

    const messages = errorMessages;
    messages.quantities = [...messages.quantities, ''];
    setErrorMessages(messages);
  };

  /**
   * Sets the validity and error message if the input is invalid.
   *
   * @param {Event} e the triggered event
   * @returns if all inputs are valid
   */
  const setValidityErrors = (e) => {
    const { name } = e.target;
    const { value } = e.target;

    let valid = true;
    let message = '';

    // Target is a product name input
    if (name === 'prodName') {
      if (value.trim() === '') {
        valid = false;
        message = 'Cannot have an empty product name';
      }
      product.forEach((prod) => {
        if (value.trim().toLowerCase() === prod.name.trim().toLowerCase()) {
          valid = false;
          message = 'Cannot have two products with the same name';
        }
      });
      materials.forEach((mat) => {
        if (value.trim().toLowerCase() === mat.name.trim().toLowerCase()) {
          valid = false;
          message = 'Cannot have a product with the same name as a raw material';
        }
      });
      unstableInputValidation[name] = valid;
      errorMessages[name] = message;
    // Target is a quantity input
    } else {
      if (Number.isNaN(value)) {
        valid = false;
        message = 'Must be a number';
      } else if (value < 1) {
        valid = false;
        message = 'Must be greater or equal to 1';
      }

      const idx = Number(name.split('_')[1]);
      unstableInputValidation.quantities[idx] = valid;
      errorMessages.quantities[idx] = message;
    }
  };

  /**
   * Returns whether all the unstable inputs are valid.
   *
   * @returns true if all the inputs are valid; false otherwise
   */
  const returnIsUnstableInputValid = () => {
    // Disable add new product line if all inputs are not valid.
    let valid = unstableInputValidation.prodName;
    unstableInputValidation.quantities.forEach((validQuant) => {
      if (!validQuant) {
        valid = false;
      }
    });
    return valid;
  };

  /**
   * Compacts an array of tuple of 2 elements so that there are no two tuples with the same first element.
   *
   * @param {Array} looseList an array of tuples of 2 elements.
   * @returns an array without duplicate keys
   */
  const returnCompactMaterialList = (looseList) => {
    let compactList = [];
    const names = [];
    for (let index = 0; index < looseList.length; index += 1) {
      const element = looseList[index];
      const idx = inArray(element.matName, names);
      if (idx < 0) {
        names.push(element.matName);
        compactList = [...compactList, [element.matName, element.matQuantity]];
      } else {
        const newQuantity = parseInt(compactList[idx][1], 10) + parseInt(element.matQuantity, 10);
        compactList[idx] = [compactList[idx][0], newQuantity];
      }
    }
    return compactList;
  };

  /* -------------------------
   * Functions dealing with the adding a new product line.
   * --------------------------
   */

  /**
   * Initialize the add product line modal with initial values.
   */
  const initAddModal = () => {
    toggleAddModal();
    setNewProdName('');
    setNewProdType('final');
    setMaterialList([{ matName: materials[0].name, matQuantity: 1 }]);
    setUnstableInputValidation({ prodName: false, quantities: [true] });
    setErrorMessages({ prodName: 'Cannot have an empty product name', quantities: [''] });

    setDisableAddNewProd(true);
    setHiddenLoading(true);
  };

  /**
   * Validates all the inputs that could be invalid and display an error message for adding a new product line.
   * If any of the inputs are invalid, then the submit button is disabled.
   *
   * @param {Event} e the triggered event
   */
  const validateUnstableAddInputs = (e) => {
    setValidityErrors(e);
    const disable = !returnIsUnstableInputValid();
    setDisableAddNewProd(disable);
  };

  /**
   * Adds the new product defined in the modal to the database.
   */
  const addProduct = async () => {
    const materialArr = returnCompactMaterialList(materialList);
    await addProductLine(newProdName, newProdType, materialArr);
    updateProductlineView(!productlineView);
  };

  /* -------------------------
   * Functions dealing with transfering Inventory.
   * -------------------------
   */

  /**
   * Initialize the transfer modal
   */
  const initTranferModal = () => {
    toggleTransferModal();
    setLocRetrieval(notCurLoc[0]);
    setMaterialList([{ matName: materials[0].name, matQuantity: 1 }]);
    setUnstableInputValidation({ prodName: true, quantities: [true] });
    setErrorMessages({ prodName: '', quantities: [''] });
    setDisableTransferButton(false);
    setCreateTransferOutputHTML([]);
    setHiddenConfirmBtns(false);
    setHiddenLoading(true);
  };

  /**
   * Validates all the inputs that could be invalid and display an error message for transfering materials.
   * If any of the inputs are invalid, then the submit button is disabled.
   *
   * @param {Event} e the triggered event
   */
  const validateUnstableTransferInputs = (e) => {
    setValidityErrors(e);
    const disable = !returnIsUnstableInputValid();
    setDisableTransferButton(disable);
  };

  /**
   * Adds the new product defined in the modal to the database.
   */
  const transferProducts = async () => {
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
      for (let index = 0; index < allMaterials.length; index += 1) {
        const material = allMaterials[index];
        const name = material[0];
        const num = material[1];
        const inInventory = await returnQuantityInInventory(name, locRetrieval);

        if (inInventory < num * prodQuant) {
          invalids = [...invalids, { name, quantNeed: num * prodQuant, quantHave: inInventory }];
        }
      }
      return invalids;
    };

    /**
     * Removes all the materials from inventory. Each material is composed of its name and the quantity to be removed.
     *
     * @param {Array} matList the materials to be removes from inventory
     */
    const removeFromInventory = (matList) => {
      matList.forEach((material) => {
        const name = material[0];
        const num = material[1];
        const quantity = num * prodQuant;
        decrementInventory(name, locRetrieval, quantity);
      });
    };

    /**
     * Returns the type of the item.
     *
     * @param {String} name the name of the item
     * @returns the type of the item
     */
    const returnTypeOfItem = (name) => {
      for (let index = 0; index < materials.length; index += 1) {
        const material = materials[index];
        if (material.name === name) {
          return material.type;
        }
      }
      for (let index = 0; index < product.length; index += 1) {
        const prod = product[index];
        if (prod.name === name) {
          return prod.type;
        }
      }
      return '';
    };

    /**
     * Sends a request to the transportation department for every material to be transfered.
     *
     * @param {Array} matList an array of the items and their quantities
     */
    const sendToTransportation = (matList) => {
      matList.forEach((material) => {
        const name = material[0];
        const quantity = material[1];
        const itemType = returnTypeOfItem(name);
        addTransportationShipment(name, quantity, itemType, locRetrieval, userLoc);
      });
    };

    /**
     * Creates an array of HTML elements to indicate that there are not enough of some materials available.
     *
     * @param {Array} invalids list of materials with not enough quantity in inventory
     * @returns An array of HTML elements
     */
    const createInvalidHTML = (invalids) => {
      let html = [];
      invalids.forEach((element) => {
        const { name, quantNeed, quantHave } = element;
        html = [...html,
          <FormGroup>
            <Button className="btn-danger" disabled>
              Don&apos;t have enough of
              {' '}
              <label className="text-indigo strong">{name}</label>
              {' '}
              to transfer
              {' '}
              {quantNeed}
              {' '}
              from location
              {' '}
              {locRetrieval}
              . Only
              {' '}
              {quantHave}
              {' '}
              in inventory.
            </Button>
          </FormGroup>];
      });
      return html;
    };

    /**
     * Creates an array of HTML elements to indicate that the transfer of the materials was successful.
     *
     * @returns An array of HTML elements
     */
    const createSuccessHTML = () => {
      const html = [
        <FormGroup>
          <Button className="btn-success" disabled>
            Successfully requested materials to be shipped from location
            {locRetrieval}
            {' '}
            to location
            {userLoc}
            .
          </Button>
        </FormGroup>];
      return html;
    };

    const main = async () => {
      setHiddenConfirmBtns(true);
      setHiddenLoading(false);

      try {
        // Get material list compacted and which are invalid
        const materialArr = returnCompactMaterialList(materialList);
        const invalids = await returnInvalidMaterials(materialArr);

        // Check if there is are materials with not enough quantity to make the products.
        if (invalids.length > 0) {
          setCreateTransferOutputHTML(createInvalidHTML(invalids));
          setHiddenConfirmBtns(false);
          return;
        }

        // Send the products to the transportation department and remove items from inventory. Indicate that it was successful.
        sendToTransportation(materialArr);
        removeFromInventory(materialArr);
        setCreateTransferOutputHTML(createSuccessHTML());
      } finally {
        setHiddenLoading(true);
        updateInventoryView(!inventoryView);
      }
    };

    main();
  };

  /* --------------------------
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
    setCreateErrorMessages({ quantity: '' });
    setDisableCreateNewProd(false);
    setCreateProdOutputHTML([]);
    setHiddenConfirmBtns(false);
    setHiddenLoading(true);
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
    const { name } = e.target;
    const { value } = e.target;
    const inputs = unstableCreateInputsValidation;
    const messages = createErrorMessages;

    let valid = true;
    let message = '';

    // Target is a product name input
    if (name === 'quantity') {
      if (Number.isNaN(value)) {
        valid = false;
        message = 'Must be a number';
      } else if (value < 1) {
        valid = false;
        message = 'Must be greater or equal to 1';
      }
      inputs[name] = valid;
      messages[name] = message;
    }

    // Disable add new product line if all inputs are not valid.
    const isDisabled = !inputs.quantity;

    setDisableCreateNewProd(isDisabled);
    setUnstableCreateInputValidation(inputs);
    setCreateErrorMessages(messages);
  };

  /**
   * Creating product from product line.
   */
  const createProduct = async () => {
    /**
     * Returns the finish_time of the machine that has an item and the smallest finish_time.
     *
     * @param {Array} allMachines an array of all the production machines
     * @returns the smallest finish_time
     */
    const returnNextAvailable = (allMachines) => {
      let nextAvailable = null;
      allMachines.forEach((machine) => {
        if (machine.item !== '') {
          if (nextAvailable == null) {
            nextAvailable = new Date(machine.finish_time);
          }
          const machineDate = new Date(machine.finish_time);
          if (machineDate.valueOf() < nextAvailable.valueOf()) {
            nextAvailable = machineDate;
          }
        }
      });
      return nextAvailable;
    };

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
      for (let index = 0; index < allMaterials.length; index += 1) {
        const material = allMaterials[index];
        const name = material[0];
        const num = material[1];
        const inInventory = await returnQuantityInInventory(name, userLoc);

        if (inInventory < num * prodQuant) {
          invalids = [...invalids, { name, quantNeed: num * prodQuant, quantHave: inInventory }];
        }
      }
      return invalids;
    };

    /**
     * Removes all the materials from inventory. Each material is composed of its name and the quantity to be removed.
     *
     * @param {Array} matList the materials to be removes from inventory
     */
    const removeFromInventory = (matList) => {
      matList.forEach((material) => {
        const name = material[0];
        const num = material[1];
        const quantity = num * prodQuant;
        decrementInventory(name, userLoc, quantity);
      });
    };

    /**
     * Adds the items to the production machines.
     *
     * @param {Array} availableMachines the list of available production machines at the user's location
     * @param {String} name the name of the item to be produced
     * @param {String} type the type of the item
     * @param {BigInteger} quantity the number of items
     */
    const addToMachines = (availableMachines, name, type, quantity) => {
      for (let index = 0; index < quantity; index += 1) {
        const machine = availableMachines[index];
        addItemToMachine(machine._id, name, type);
      }
    };

    /**
     * Creates an array of HTML elements to indicate that there are not enough machines available.
     *
     * @param {BigInteger} available the number of available machines
     * @param {Date} nextAvailTime the date of the next available machine
     * @returns An array of HTML elements
     */
    const createNoMachineHTML = (available, nextAvailTime) => {
      const html = [
        <FormGroup>
          <Button className="btn-danger" disabled>
            There are not enough machines available at your location (
            {userLoc}
            ).
            {nextAvailTime == null ? '' : `There are ${available} available, `
        + `the next available machine is at ${nextAvailTime.toString()}.`}
          </Button>
        </FormGroup>];
      return html;
    };

    /**
     * Creates an array of HTML elements to indicate that there are not enough of some materials available.
     *
     * @param {Array} invalids list of materials with not enough quantity in inventory
     * @returns An array of HTML elements
     */
    const createInvalidHTML = (invalids) => {
      let html = [];
      invalids.forEach((element) => {
        const { name, quantNeed, quantHave } = element;
        html = [...html,
          <FormGroup>
            <Button className="btn-danger" disabled>
              Don&apos;t have enough of
              {' '}
              <label className="text-indigo strong">{name}</label>
              {' '}
              to make
              {' '}
              {prodQuant}
              {' '}
              {prodName}
              {' '}
              at your location (
              {userLoc}
              ).
              <br />
              Requires
              {' '}
              {quantNeed}
              , but only
              {' '}
              {quantHave}
              {' '}
              in inventory.
            </Button>
          </FormGroup>];
      });
      return html;
    };

    /**
     * Creates an array of HTML elements to indicate that the creation of the material was successful.
     *
     * @returns An array of HTML elements
     */
    const createSuccessHTML = () => {
      const html = [
        <FormGroup>
          <Button className="btn-success" disabled>
            Successfully creating
            {prodQuant}
            {' '}
            <label className="text-indigo strong">{prodName}</label>
            {' '}
            in
            production machines at
            {' '}
            {userLoc}
            .
          </Button>
        </FormGroup>];
      return html;
    };

    /**
     * The main function to create the product.
     */
    const main = async () => {
      setHiddenConfirmBtns(true);
      setHiddenLoading(false);

      try {
        // Get all available machine at the user's location.
        const availMachines = await returnAvailableMachines(userLoc);

        // Check if there are enough machines to make the products.
        if (prodQuant > availMachines.length) {
          const allMachines = await returnAllMachines(userLoc);
          const nextAvailable = await returnNextAvailable(allMachines);
          setCreateProdOutputHTML(createNoMachineHTML(availMachines.length, nextAvailable));
          return;
        }

        // Get the materials to create the product.
        const matList = await returnProductLine(prodName);
        const invalids = await returnInvalidMaterials(matList);

        // Check if there is are materials with not enough quantity to make the products.
        if (invalids.length > 0) {
          setCreateProdOutputHTML(createInvalidHTML(invalids));
          return;
        }

        // Start the process to create the product by removing from inventory and adding it to production machines. Indicate that it was successful.
        addToMachines(availMachines, prodName, prodType, prodQuant, userLoc);
        removeFromInventory(materialList);
        setCreateProdOutputHTML(createSuccessHTML());
      } finally {
        setHiddenLoading(true);
        updateInventoryView(!inventoryView);
      }
    };

    main();
  };

  /* -------------------------
   * Returns the HTML code for the production tab.
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
                      style={{ backgroundColor: '#2181EC' }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Tooltip
                        title="Search item name in inventory table"
                        arrow
                        placement="top-start"
                        enterDelay={750}
                      >
                        <Input
                          placeholder="Search"
                          type="text"
                          onChange={(e) => {
                            onInvSearchChange(e);
                            setInvPage(0);
                          }}
                        />
                      </Tooltip>
                    </InputGroup>
                  </FormGroup>
                </Form>
                <Tooltip
                  title="Create a request to transfer products to your current location from another location"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4"
                    color="primary"
                    style={{ paddingRight: '0px 0px 0px 100px' }}
                    onClick={() => {
                      initTranferModal();
                    }}
                  >
                    Transfer
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Create a request to purchase products to your current location"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Link
                    to="/admin/finance-procurement"
                  >
                    <Button
                      className="mt-4"
                      color="primary"
                      style={{ paddingRight: '0px 0px 0px 100px', marginTop: '25px' }}
                    >
                      Purchase
                    </Button>
                  </Link>
                </Tooltip>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory
                    .slice(
                      invPage * NUM_OF_ITEMS_IN_A_PAGE,
                      (invPage + 1) * NUM_OF_ITEMS_IN_A_PAGE,
                    )
                    .map((m) => (
                      <tr key={m.name + m.location} value={m.name}>
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
                      className={invPage - 1 < 0 ? 'disabled' : 'active'}
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
                        Math.ceil(inventory.length / NUM_OF_ITEMS_IN_A_PAGE),
                      ).keys(),
                    )
                      .slice(
                        invPage - 1 < 0
                          ? invPage
                          : invPage - 2 < 0
                            ? invPage - 1
                            : invPage - 2,
                        invPage + 1 >= inventory.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? invPage + 2
                          : invPage + 3,
                      )
                      .map((idx) => (
                        <PaginationItem
                          key={idx}
                          className={idx === invPage ? 'active' : ''}
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
                          ? 'disabled'
                          : 'active'
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
                      style={{ backgroundColor: '#2181EC' }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Tooltip
                        title="Search item name in product line table"
                        arrow
                        placement="top-start"
                        enterDelay={750}
                      >
                        <Input
                          placeholder="Search"
                          type="text"
                          onChange={(e) => {
                            onProdSearchChange(e);
                            setProdPage(0);
                          }}
                        />
                      </Tooltip>
                    </InputGroup>
                  </FormGroup>
                </Form>
                <Tooltip
                  title="Create a new product line from a list of materials"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={() => { initAddModal(); }}
                  >
                    Add New Product Line
                  </Button>
                </Tooltip>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody>
                  {product
                    .slice(
                      prodPage * NUM_OF_ITEMS_IN_A_PAGE,
                      (prodPage + 1) * NUM_OF_ITEMS_IN_A_PAGE,
                    )
                    .map((m) => (
                      <tr key={m.name} value={m.name}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.name}</span>
                            </Media>
                          </Media>
                        </th>
                        <td className="text-right">
                          <Tooltip
                            title={`Create the product ${m.name}`}
                            arrow
                            placement="top-start"
                            enterDelay={750}
                          >
                            <Button
                              onClick={() => {
                                initCreateModal(m.name, m.type);
                              }}
                            >
                              Create
                            </Button>
                          </Tooltip>
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
                      className={prodPage - 1 < 0 ? 'disabled' : 'active'}
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
                        Math.ceil(product.length / NUM_OF_ITEMS_IN_A_PAGE),
                      ).keys(),
                    )
                      .slice(
                        prodPage - 1 < 0
                          ? prodPage
                          : prodPage - 2 < 0
                            ? prodPage - 1
                            : prodPage - 2,
                        prodPage + 1 >= product.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? prodPage + 2
                          : prodPage + 3,
                      )
                      .map((idx) => (
                        <PaginationItem
                          key={idx}
                          className={idx === prodPage ? 'active' : ''}
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
                          ? 'disabled'
                          : 'active'
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

      {/** Modal For Add Product */}
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
                    invalid={!unstableInputValidation.prodName}
                    autoComplete="off"
                    type="text"
                    name="prodName"
                    required
                    onChange={(e) => {
                      setNewProdName(e.target.value);
                      validateUnstableAddInputs(e);
                    }}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">
                    Error:
                    {' '}
                    {errorMessages.prodName}
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
                {materialList.map((x, i) => (
                  <div key={`${x.matName + i}`} className="box">
                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: '100%',
                          display: 'inline',
                          float: 'left',
                          marginRight: '20px',
                          paddingRight: '50px',
                        }}
                      >
                        Material
                        {' '}
                        {i + 1}
                      </span>
                    </label>

                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: '10%',
                          display: 'inline',
                          float: 'right',
                          marginLeft: '20px',
                        }}
                      >
                        Quantity
                      </span>
                    </label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        type="select"
                        name="matName"
                        value={x.matName}
                        onChange={(e) => handleMaterialChange(e, i)}
                      >
                        {[...materials, ...product].map((m) => (
                          <option key={m.name}>{m.name}</option>
                        ))}
                      </Input>
                      <Input
                        style={{
                          width: '10%',
                          display: 'inline',
                          float: 'right',
                          marginLeft: '20px',
                        }}
                        type="number"
                        min="1"
                        className="ml10"
                        name={`matQuantity_${i}`}
                        value={x.matQuantity}
                        invalid={!unstableInputValidation.quantities[i]}
                        onChange={(e) => {
                          handleMaterialChange(e, i);
                          validateUnstableAddInputs(e);
                        }}
                      />
                      <FormFeedback className="invalid-tooltip" type="invalid">
                        Error:
                        {' '}
                        {errorMessages.quantities[i]}
                      </FormFeedback>
                      {materialList.length !== 1 && (
                        <Button
                          color="secondary"
                          className="mr10"
                          onClick={() => { removeMaterial(i); setDisableAddNewProd(!returnIsUnstableInputValid()); }}
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
            <Tooltip
              title="There must be no errors to be able to confirm"
              arrow
              placement="top-start"
              enterDelay={750}
              disableFocusListener={!disabledAddNewProd}
              disableHoverListener={!disabledAddNewProd}
              disableTouchListener={!disabledAddNewProd}
            >
              <span>
                <Button
                  disabled={disabledAddNewProd}
                  color="primary"
                  onClick={() => {
                    addProduct();
                    toggleAddModal();
                  }}
                >
                  Confirm
                </Button>
              </span>
            </Tooltip>
            <Button color="secondary" onClick={toggleAddModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/** Modal For Create Product */}
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
                    onChange={(e) => {
                      onProdQuantChange(e);
                      validateUnstableCreateInputs(e);
                    }}
                    invalid={!unstableCreateInputsValidation.quantity}
                  />
                  <FormFeedback className="invalid-tooltip" type="invalid">
                    Error:
                    {' '}
                    {createErrorMessages.quantity}
                  </FormFeedback>
                </InputGroup>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {createProdOutputHTML.map((m, i) => <div key={`html:${i + 1}`}>{m}</div>)}
            <FormGroup hidden={hideLoading}>
              <section {...containerProps}>{indicatorEl}</section>
            </FormGroup>
            <Tooltip
              title="There must be no errors to be able to confirm"
              arrow
              placement="top-start"
              enterDelay={750}
              disableFocusListener={!disabledCreateNewProd}
              disableHoverListener={!disabledCreateNewProd}
              disableTouchListener={!disabledCreateNewProd}
            >
              <span>
                <Button
                  hidden={hideConfirmBtns}
                  disabled={disabledCreateNewProd}
                  color="primary"
                  onClick={() => {
                    createProduct();
                  }}
                >
                  Confirm
                </Button>
              </span>
            </Tooltip>
            <Button
              hidden={hideConfirmBtns}
              color="secondary"
              onClick={toggleCreateModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {/** Modal For Transfering Product */}
      <div>
        <Modal isOpen={transferModal} toggle={toggleTransferModal}>
          <ModalHeader toggle={toggleTransferModal}>
            Transfer Products
          </ModalHeader>
          <ModalBody>
            <Form className="form" name="addProductForm">
              <FormGroup>
                <label>
                  <span className="text-muted">Transfer To</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input disabled type="text" name="location" value={userLoc} />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                <label>
                  <span className="text-muted">Transfer From</span>
                </label>
                <InputGroup className="input-group-alternative">
                  <Input
                    type="select"
                    name="location"
                    required
                    onChange={(e) => {
                      setLocRetrieval(e.target.value);
                    }}
                  >
                    {[...notCurLoc].map((m) => (
                      <option key={`plant:${m}`}>{m}</option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-3">
                {materialList.map((x, i) => (
                  <div key={`${x.matName + i}`} className="box">
                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: '100%',
                          display: 'inline',
                          float: 'left',
                          marginRight: '20px',
                          paddingRight: '50px',
                        }}
                      >
                        Material
                        {' '}
                        {i + 1}
                      </span>
                    </label>

                    <label>
                      <span
                        className="text-muted"
                        style={{
                          width: '10%',
                          display: 'inline',
                          float: 'right',
                          marginLeft: '20px',
                        }}
                      >
                        Quantity
                      </span>
                    </label>
                    <InputGroup className="input-group-alternative">
                      <Input
                        type="select"
                        name="matName"
                        value={x.matName}
                        onChange={(e) => handleMaterialChange(e, i)}
                      >
                        {[...materials, ...product].map((m) => (
                          <option key={m.name}>{m.name}</option>
                        ))}
                      </Input>
                      <Input
                        style={{
                          width: '10%',
                          display: 'inline',
                          float: 'right',
                          marginLeft: '20px',
                        }}
                        type="number"
                        min="1"
                        className="ml10"
                        name={`matQuantity_${i}`}
                        value={x.matQuantity}
                        invalid={!unstableInputValidation.quantities[i]}
                        onChange={(e) => {
                          handleMaterialChange(e, i);
                          validateUnstableTransferInputs(e);
                        }}
                      />
                      <FormFeedback className="invalid-tooltip" type="invalid">
                        Error:
                        {' '}
                        {errorMessages.quantities[i]}
                      </FormFeedback>
                      {materialList.length !== 1 && (
                        <Button
                          color="secondary"
                          className="mr10"
                          onClick={() => { removeMaterial(i); setDisableTransferButton(!returnIsUnstableInputValid()); }}
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
            {createTransferOutputHTML.map((m, i) => <div key={`html:${i + 1}`}>{m}</div>)}
            <FormGroup hidden={hideLoading}>
              <section {...containerProps}>{indicatorEl}</section>
            </FormGroup>
            <Tooltip
              title="There must be no errors to be able to confirm"
              arrow
              placement="top-start"
              enterDelay={750}
              disableFocusListener={!disabledTransferButton}
              disableHoverListener={!disabledTransferButton}
              disableTouchListener={!disabledTransferButton}
            >
              <span>
                <Button
                  hidden={hideConfirmBtns}
                  disabled={disabledTransferButton}
                  color="primary"
                  onClick={() => {
                    transferProducts();
                    // TODO send info to Transpo tab
                  }}
                >
                  Confirm
                </Button>
              </span>
            </Tooltip>
            <Button
              hidden={hideConfirmBtns}
              color="secondary"
              onClick={toggleTransferModal}
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
