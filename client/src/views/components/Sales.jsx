/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint no-console: ["error", { allow: ["error"] }] */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
// reactstrap components
import {
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
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from 'reactstrap';

// core components
import FinanceHeader from '../../components/Headers/FinanceHeader';




const Sales = () => {
  const [sales,setSales] = useState([]);
  const [updated,setUpdated] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [salesData,setSalesData] = useState({
    name:"",
    quantity:0,
    purchaser:"",
    location:"",
    value:0,
    date:""
  });
  const { name, quantity, purchaser, location, value, date } = salesData;
  const onDelete = async(_id) => {

    const salesId = {
      _id,

    };
    const body = JSON.stringify(salesId);
    try {
      await axios
        .post('/api/sales/delete', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(setUpdated(!updated));
    } catch (err) {
      console.error(err);
    }

  }
  const [modal, setModal] = useState(false);
  const onChangeSalesData = (e) => {
    setSalesData({
      ...salesData,
      [e.target.name]:e.target.value
    });
  };
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      
      
        await axios
          .get('/api/sales', {
            headers: {
              'x-auth-token': userToken,
            },
          })
          .then((response) => {
            if (response.data) {
              setSales(response.data);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      
    };
    lookup();
  }, [updated]);

  const addSale = async () =>{
    if (
      name === ''
      || quantity === 0
      || location === ''
      || value === 0
      || date === ''
      ||purchaser ===''

    ) {
      // eslint-disable-next-line no-alert
      alert('Please Enter Data Into All Fields');
    } else {
    const body = JSON.stringify(salesData);
    console.log("hello");
    try {
      await axios
        .post('/api/sales/add', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        });
    } catch (err) {
      console.error(err);
    }

    setUpdated(!updated);
  }
  }

  


  function closeModal() {
    setModal(!modal);
  }

  return (
    <>
      <FinanceHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Sales</h2>
                <Button className="mt-4"
                        color="primary"
                        onClick={() => {
                          closeModal();
                        }}
                >
                  Add Sales Order
                </Button>
                <Button className="mt-4 float-right"
                        color="danger"
                >
                  Export to PDF
                </Button>
                <Modal
                    isOpen={modal}
                    changeStatus={closeModal}
                >
                  <ModalHeader changeStatus={closeModal}>
                    Fill In The Form Below
                  </ModalHeader>
                  <ModalBody>
                    <Form className="form">
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="NAME"
                              name="name"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="number"
                              placeholder="QUANTITY  (please use scroller on right)"
                              name="quantity"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="Purchaser"
                              name="purchaser"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="text"
                              placeholder="Location"
                              name="location"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="number"
                              placeholder="Net Value"
                              name="value"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Input
                              type="date"
                              placeholder="Date"
                              name="date"
                              onChange = {(e) => onChangeSalesData(e)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button color="primary" onClick = {(e) => { addSale(); closeModal();}}>
                          Add Sales Order
                        </Button>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={closeModal}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">Receipt ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Location</th>
                  <th scope="col">Purchaser</th>
                  <th scope="col">Net Value</th>
                  <th scope="col">Date</th>
                  <th scope="col"></th>
                </tr>
                </thead>

                <tbody style={{overflow:"auto"}}>
                  {sales.map((t) => (
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
                      <td>{t.purchaser}</td>
                      <td>{t.location}</td>
                      <td>{t.value}</td>
                      <td>{t.date.substr(0,10)}</td>
                      <td className="text-right" >
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
                              onClick={() => onDelete(t._id)}
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

export default Sales;