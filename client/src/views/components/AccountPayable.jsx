/* eslint-disable new-cap */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'

import axios from 'axios'
// reactstrap components
import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Form,
  FormGroup,
  InputGroup,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from 'reactstrap'
// core components
import Tooltip from '@material-ui/core/Tooltip'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { exportToJsonExcel } from '../../variables/export'
import FinanceHeader from '../../components/Headers/FinanceHeader.jsx'

const AccountPayable = () => {
  const exportToPDF = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      html: '#apunpaid-table',
    })
    doc.save('AP Unpaid.pdf')
  }

  const exportToPDF2 = () => {
    const doc = new jsPDF()
    autoTable(doc, {
      html: '#appaid-table',
    })
    doc.save('AP paid.pdf')
  }

  const [payables, setPayables] = useState([])
  const [payablesP, setPayablesP] = useState([])
  const userToken = JSON.parse(localStorage.getItem('user'))
  const [updated, setUpdated] = useState(false)
  useEffect(() => {
    // retrieve information
    const lookup = async () => {
      await axios
        .get('/api/procurement/payables', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setPayables(response.data)
          }
        })
        .catch((error) => {
          console.error(error)
        })

      await axios
        .get('/api/procurement/payablesP', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .then((response) => {
          if (response.data) {
            setPayablesP(response.data)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    lookup()
  }, [updated])

  const onDelete = async (_id) => {
    const salesId = {
      _id,
    }
    const body = JSON.stringify(salesId)
    try {
      await axios
        .post('/api/procurement/delete', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(setUpdated(!updated))
    } catch (err) {
      console.error(err)
    }
  }
  const onSetPaid = async (_id) => {
    const salesId = {
      _id,
    }
    const body = JSON.stringify(salesId)
    try {
      await axios
        .post('/api/procurement/setPaid', body, {
          headers: {
            'x-auth-token': userToken,
            'Content-Type': 'application/json',
          },
        })
        .then(setUpdated(!updated))
    } catch (err) {
      console.error(err)
    }
  }

  const [modal, setModal] = useState(false)

  function closeModal() {
    setModal(!modal)
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
                <h2 className="mb-0">Accounts Payable</h2>
                <Tooltip
                  title="Click to create a new AR receipt"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4"
                    color="primary"
                    onClick={() => {
                      closeModal()
                    }}
                  >
                    Add AR Receipt
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Export to PDF"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4 float-right"
                    color="danger"
                    onClick={() => exportToPDF()}
                  >
                    Export to PDF
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Click to export to XLSX"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4 float-right"
                    color="success"
                    onClick={() =>
                      exportToJsonExcel('AP Unpaid Receipts', payables)
                    }
                  >
                    Export to XLSX
                  </Button>
                </Tooltip>
                <Modal isOpen={modal} changeStatus={closeModal}>
                  <ModalHeader changeStatus={closeModal}>
                    Fill In The Form Below
                  </ModalHeader>
                  <ModalBody>
                    <Form className="form">
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                            title="Enter a date for when the receipt was created"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                          >
                            <Input type="date" placeholder="Date" name="date" />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup>
                          <Tooltip
                            title="Enter the status of the receipt"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                          >
                            <Input
                              type="text"
                              placeholder="Status"
                              name="status"
                            />
                          </Tooltip>
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Tooltip
                          title="Click here to create the AR receipt"
                          arrow
                          placement="top-start"
                          enterDelay={750}
                        >
                          <Button color="primary">Add AR Receipt</Button>
                        </Tooltip>
                      </div>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Tooltip
                      title="Cancel the creation of the receipt"
                      arrow
                      placement="top-start"
                      enterDelay={750}
                    >
                      <Button color="secondary" onClick={closeModal}>
                        Cancel
                      </Button>
                    </Tooltip>
                  </ModalFooter>
                </Modal>
              </CardHeader>
              <Table
                id="apunpaid-table"
                className="align-items-center table-flush mb-6"
                responsive
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody style={{ overflow: 'auto' }}>
                  {payables.map((t) => (
                    <tr key={t._id} value={t.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{t._id}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{t.date.substr(0, 10)}</td>
                      <td>{t.value}</td>
                      <td>{t.paid ? 'Paid' : 'Not Paid'} </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <Tooltip
                            title="More Options"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                          >
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
                          </Tooltip>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onSetPaid(t._id)}
                            >
                              Set To Paid
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
        <br />
        <br />
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h2 className="mb-0">Paid Accounts Payable</h2>
                <Tooltip
                  title="Export to PDF"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4 float-right"
                    color="danger"
                    onClick={() => exportToPDF2()}
                  >
                    Export to PDF
                  </Button>
                </Tooltip>
                <Tooltip
                  title="Click to export to XLSX"
                  arrow
                  placement="top-start"
                  enterDelay={750}
                >
                  <Button
                    className="mt-4 float-right"
                    color="success"
                    onClick={() =>
                      exportToJsonExcel('AP Paid Receipts', payablesP)
                    }
                  >
                    Export to XLSX
                  </Button>
                </Tooltip>
              </CardHeader>
              <Table
                id="appaid-table"
                className="align-items-center table-flush mb-6"
                responsive
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Invoice ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody style={{ overflow: 'auto' }}>
                  {payablesP.map((t) => (
                    <tr key={t._id} value={t.name}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{t._id}</span>
                          </Media>
                        </Media>
                      </th>

                      <td>{t.date.substr(0, 10)}</td>
                      <td>{t.value}</td>
                      <td>{t.paid ? 'Paid' : 'Not Paid'} </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <Tooltip
                            title="More Options"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                          >
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
                          </Tooltip>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                              href="#pablo"
                              onClick={() => onDelete(t._id)}
                            >
                              Delete
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
  )
}

export default AccountPayable
