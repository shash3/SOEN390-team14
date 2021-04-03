/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
  ButtonGroup,
  Button,
} from 'reactstrap'
// core components
import Tooltip from '@material-ui/core/Tooltip'
import {exportToJsonExcel} from '../../variables/export'
import Header from '../../components/Headers/Header.jsx'

const QualityAssurance = () => {
  const userToken = JSON.parse(localStorage.getItem('user'))
  const [userLocation, setUserLoc] = useState('')

  // Quality database data
  const [dirtyQualityData, setDirtyQualityData] = useState([])
  const [searchQualityData, setSearchQualityData] = useState([])
  const [updatedQualityIndicies, setUpdatedQualityIndicies] = useState([])

  // Search input
  const [qualityFormSearch, setQualityFormSearch] = useState('')
  const [updateSearch, setUpdateSearch] = useState(false)
  const [qualPage, setQualPage] = useState(0)
  const [qualityMessages, setQualityMessages] = useState(<></>)

  const NUM_OF_ITEMS_IN_A_PAGE = 15

  /* ---------------------------
  * Functions To Refresh Production Machines
  * ---------------------------
  */

  const [refreshMachine, setRefreshMachine] = useState(false)
  /**
  * Set a timer to refresh every few seconds.
  */
  useEffect(() => {
    let refresh = true
    setInterval(() => {
      setRefreshMachine(refresh)
      refresh = !refresh
    }, 1000 * 15)
  }, [])

  /**
  * Checks if the machines are finished producing the part. Removes it from the machine and adds it to quality assurance.
  */
  useEffect(async () => {
    const returnUnavailableMachines = () => {
      const reply = axios
        .post(
          '/api/machine/unavailable',
          {
            location: userLocation,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .then((response) => response.data)
        .catch((err) => console.error('Error', err))
      return reply
    }

    const readMachineLog = async () => {
      const reply = await axios
        .get('/api/machine/json', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err))
      return reply.data
    }

    const writeMachineLog = async (qualityJson) => {
      await axios
        .post(
          '/api/machine/json',
          {
            data: qualityJson,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((error) => {
          console.error(error)
        })
    }

    const updateMachineLog = async (machineKey, item, date, location) => {
      const machinesLog = await readMachineLog()
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      const year = date.getUTCFullYear()
      const month = monthNames[date.getUTCMonth()]

      if (machinesLog[year] === undefined) {
        machinesLog[year] = {}
      }
      const machineYear = machinesLog[year]

      if (machineYear[month] === undefined) {
        machineYear[month] = {}
      }
      const machineMonth = machineYear[month]

      if (machineMonth[location] === undefined) {
        machineMonth[location] = {}
      }
      const machineLocation = machineMonth[location]

      if (machineLocation[machineKey] === undefined) {
        machineLocation[machineKey] = {
          items: {},
          minutesLogged: 0,
        }
      }
      const machineItems = machineLocation[machineKey].items

      if (machineItems[item] === undefined) {
        machineItems[item] = 0
      }

      machineItems[item] += 1
      machineLocation[machineKey].minutesLogged += 5

      writeMachineLog(machinesLog)
    }

    const addToQuality = async (name, type, location) => {
      await axios
        .post(
          '/api/quality/add',
          {
            name,
            type,
            location,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((error) => {
          console.error(error)
        })
    }

    const removeItemFromMachine = async (key) => {
      await axios
        .put(
          '/api/machine/remove',
          {
            _id: key,
          },
          {
            headers: {
              'x-auth-token': userToken,
            },
          }
        )
        .catch((err) => console.error('Error', err))
    }

    const main = async () => {
      if (userLocation === undefined) {
        return
      }
      let updated = 0
      const unavailMachines = await returnUnavailableMachines()
      for (let index = 0; index < unavailMachines.length; index += 1) {
        const machine = unavailMachines[index]
        if (new Date(machine.finish_time).valueOf() < new Date().valueOf()) {
          await updateMachineLog(machine._id, machine.item, new Date(), userLocation)
          await addToQuality(machine.item, machine.type, userLocation)
          await removeItemFromMachine(machine._id)
          updated += 1
        }
      }
      if (updated > 0) {
        updateMachineView(!machineView)
      }
    }

    main()
  }, [refreshMachine])

  /* ------------------------
  * Functions that deal with logging
  * ------------------------
  */

  const readQualityLog = async () => {
    const qualityReply = await axios
      .get('/api/quality/json', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .catch((err) => console.error('Error', err))
    return qualityReply.data
  }

  const writeQualityLog = async (qualityJson) => {
    await axios
      .post(
        '/api/quality/json',
        {
          data: qualityJson,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }
      )
      .catch((error) => {
        console.error(error)
      })
  }

  const addQualityToLog = async (qualityLog, name, quality) => {
    const qualityLogJson = qualityLog
    if (qualityLogJson[name] === undefined) {
      qualityLogJson[name] = {
        good: 0,
        faulty: 0,
        total: 0,
      }
    }
    const itemQual = qualityLogJson[name]

    switch (quality) {
    case 'Good':
      itemQual.good += 1
      itemQual.total += 1
      break
    case 'Faulty':
      itemQual.faulty += 1
      itemQual.total += 1
      break
    default:
      break
    }
    return qualityLogJson
  }

  /* ------------------------
  * Function that interact with database backend
  * ------------------------
  */

  useEffect(() => {
  // Retrieve product line location from user
    const getUserLoc = async () => {
      const response = await axios
        .get('/api/auth', {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err))
      if (response && response.data) {
        const user = response.data
        setUserLoc(user.location)
      }
    }
    getUserLoc()
  }, [])

  /**
  * Retrieve all items in inventory with the specified name and location.
  * It should return an array containing only 1 element based on the database conditions.
  *
  * @param {String} name the name of the item
  * @param {String} location the location of the item
  * @returns
  */
  const getInventoryItems = async (name, location) => {
    let material = []
    await axios
      .post(
        '/api/inventory/location',
        {
          name,
          location,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }
      )
      .then((response) => {
        if (response.data) {
          material = response.data
        }
      })
      .catch((error) => {
        console.error(error)
      })
    return material
  }

  /**
  * Puts an item into inventory based on its name and location.
  * If the item did not exist, then it is added as a new element.
  * If the item already eisted, then the item is found in the database and only its quantity is
  * updated.
  *
  * @param {String} name the name of the item
  * @param {String} type the type of the item (raw, part, final)
  * @param {String} location the location of the item
  * @param {BigInteger} quantity the quantity of the item
  */
  const putInventoryItem = async (name, type, location, quantity) => {
    await axios
      .put(
        '/api/inventory/superUpdate',
        {
          name,
          type,
          location,
          quantity,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }
      )
      .catch((error) => {
        console.error(error)
      })
  }

  /**
  * Gets all the quality data from the database.
  */
  const getQualityData = async () => {
  // Update the view from database
    await axios
      .post(
        '/api/quality/location',
        {
          location: userLocation,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }
      )
      .then((response) => {
        setDirtyQualityData(response.data)
        setUpdatedQualityIndicies(new Array(response.data.length).fill(false))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  /**
  * Remove a quality product from the quality database by its key.
  *
  * @param {String} key the unique key that identifies a quality product
  */
  const removeQualityProduct = async (key) => {
    await axios
      .post(
        '/api/quality/delete',
        {
          _id: key,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }
      )
      .catch((error) => {
        console.error(error)
      })
  }

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
    for (let index = 0; index < dirtyQualityData.length; index += 1) {
      const element = dirtyQualityData[index]
      if (element._id === product._id) {
        const prod = product
        prod.quality = value
        dirtyQualityData.splice(index, 1, prod)
        updatedQualityIndicies.splice(index, 1, true)
        setUpdateSearch(!updateSearch)
        break
      }
    }
  }

  /**
  * Updates the message for the quality table to the appropriate topic.
  *
  * @param {BigInteger} numOfChanges the number of changes made ot the quality tab
  */
  const updateQualityMessages = (numOfChanges) => {
    if (numOfChanges > 0) {
      const html = (
        <FormGroup>
          <ButtonGroup className="">
            <Button className="btn-info disabled">
       Successfully updated the quality of {numOfChanges} products.
            </Button>
            <Button
              onClick={() => setQualityMessages(<></>)}
              className="close btn-danger"
            >
       &nbsp;X&nbsp;
            </Button>
          </ButtonGroup>
        </FormGroup>
      )
      setQualityMessages(html)
    } else if (numOfChanges === 0) {
      const html = (
        <FormGroup>
          <ButtonGroup className="">
            <Button className="btn-info disabled">
       No updates have been made to the table.
            </Button>
            <Button
              onClick={() => setQualityMessages(<></>)}
              className="close btn-danger"
            >
       &nbsp;X&nbsp;
            </Button>
          </ButtonGroup>
        </FormGroup>
      )

      setQualityMessages(html)
    } else if (numOfChanges < 0) {
      const html = (
        <FormGroup>
          <ButtonGroup className="">
            <Button className="btn-info disabled">Cancelled any changes made.</Button>
            <Button
              onClick={() => setQualityMessages(<></>)}
              className="close btn-danger"
            >
       &nbsp;X&nbsp;
            </Button>
          </ButtonGroup>
        </FormGroup>
      )
      setQualityMessages(html)
    }
  }

  /**
  * Adds or updates the product to the database.
  *
  * @param {Array} product the product to add to inventory
  */
  const addProductToInventory = async (product) => {
    const { name, type, location } = product

    const material = await getInventoryItems(name, location)
    const inInventory = material.length === 0 ? 0 : material[0].quantity

    await putInventoryItem(name, type, location, inInventory + 1)
  }

  /**
  * Updates the quality table to remove any items with quality good or faulty.
  * If an item is good then it is added to the inventory database.
  */
  const updateQualityTable = async () => {
    let qualityLogJson = await readQualityLog()

    let qualityChanges = 0
    for (let index = 0; index < dirtyQualityData.length; index += 1) {
      const product = dirtyQualityData[index]
      if (updatedQualityIndicies[index] && product.quality !== 'None') {
        switch (product.quality) {
        case 'Good':
          await addProductToInventory(product)
          removeQualityProduct(product._id)
          qualityChanges += 1
          break
        case 'Faulty':
          removeQualityProduct(product._id)
          qualityChanges += 1
          break
        default:
          break
        }
      }
      qualityLogJson = await addQualityToLog(
        qualityLogJson,
        product.name,
        product.quality
      )
      // End of for loop
    }

    // Update the quality table view
    getQualityData()
    setUpdateSearch(!updateSearch)
    updateQualityMessages(qualityChanges)
    writeQualityLog(qualityLogJson)
  }

  /**
  * Removes any changes done to the quality table.
  */
  const cancelChanges = () => {
  // Update the quality table view
    getQualityData()
    setUpdateSearch(!updateSearch)
    updateQualityMessages(-1)
  }

  /**
  * Get quality information when searches are updated.
  */
  useEffect(() => {
  // retrieve quality information
    const qualityLookUp = async () => {
      if (qualityFormSearch === '') {
        setSearchQualityData(dirtyQualityData)
      } else {
        let searchResults = []
        dirtyQualityData.forEach((element) => {
          const { name } = element
          if (name.search(new RegExp(`^${qualityFormSearch}`, 'i')) >= 0) {
            searchResults = [...searchResults, element]
          }
        })
        setSearchQualityData(searchResults)
      }
    }
    qualityLookUp()
  }, [qualityFormSearch, dirtyQualityData, updateSearch])

  /**
  * Initialize the quality information from the database.
  */
  useEffect(() => {
    getQualityData()
  }, [userLocation])

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
                <Form>
                  <h2 className="mb-0 d-inline">Quality Parts</h2>
                  <Tooltip
                    title="Export quality table to a file"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                  >
                    <Button
                      className="float-right"
                      color="danger"
                      onClick={() => exportToJsonExcel('Quality Parts', searchQualityData)}
                    >
           Export
                    </Button>
                  </Tooltip>
                </Form>
                <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-sm-flex ml-lg-auto">
                  <FormGroup className="mt-3">
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
                        title="Search item name in quality table"
                        arrow
                        placement="top-start"
                        enterDelay={750}
                      >
                        <Input
                          placeholder="Search"
                          type="text"
                          onChange={(e) => {
                            setQualityFormSearch(e.target.value)
                            setQualPage(0)
                          }}
                        />
                      </Tooltip>
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
                    <th scope="col"> </th>
                  </tr>
                </thead>
                <tbody>
                  {searchQualityData
                    .slice(
                      qualPage * NUM_OF_ITEMS_IN_A_PAGE,
                      (qualPage + 1) * NUM_OF_ITEMS_IN_A_PAGE
                    )
                    .map((m) => (
                      <tr key={m._id} value={m.name}>
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
                            <Tooltip
                              title={`Change ${m.name} quality`}
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
                              <Tooltip
                                title={`Change ${m.name} quality to None`}
                                arrow
                                placement="top-start"
                                enterDelay={750}
                              >
                                <DropdownItem onClick={() => changeProductQuality(m, 'None')}>
                 None
                                </DropdownItem>
                              </Tooltip>
                              <Tooltip
                                title={`Change ${m.name} quality to Good`}
                                arrow
                                placement="top-start"
                                enterDelay={750}
                              >
                                <DropdownItem onClick={() => changeProductQuality(m, 'Good')}>
                 Good
                                </DropdownItem>
                              </Tooltip>
                              <Tooltip
                                title={`Change ${m.name} quality to Faulty`}
                                arrow
                                placement="top-start"
                                enterDelay={750}
                              >
                                <DropdownItem onClick={() => changeProductQuality(m, 'Faulty')}>
                 Faulty
                                </DropdownItem>
                              </Tooltip>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <ButtonGroup className="mb-2">
                  <Tooltip
                    title="Apply the changes made to the quality of all items"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                  >
                    <Button
                      className="btn-success"
                      onClick={() => {
                        updateQualityTable()
                      }}
                    >
           Apply
                    </Button>
                  </Tooltip>
                  <div className="mx-2" />
                  <Tooltip
                    title="Cancel the changes made to the quality of all items"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                  >
                    <Button
                      className="btn-warning"
                      onClick={() => {
                        cancelChanges()
                      }}
                    >
           Cancel
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                {qualityMessages}
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={qualPage - 1 < 0 ? 'disabled' : 'active'}>
                      <PaginationLink
                        href=""
                        onClick={() => setQualPage(qualPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>

                    {Array.from(
                      Array(
                        Math.ceil(searchQualityData.length / NUM_OF_ITEMS_IN_A_PAGE)
                      ).keys()
                    )
                      .slice(
                        qualPage - 1 < 0
                          ? qualPage
                          : qualPage - 2 < 0
                            ? qualPage - 1
                            : qualPage - 2,
                        qualPage + 1 >= searchQualityData.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? qualPage + 2
                          : qualPage + 3
                      )
                      .map((idx) => (
                        <PaginationItem
                          key={idx}
                          className={idx === qualPage ? 'active' : ''}
                        >
                          <PaginationLink href="" onClick={() => setQualPage(idx)}>
                            {idx + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    <PaginationItem
                      className={
                        qualPage + 1 >= searchQualityData.length / NUM_OF_ITEMS_IN_A_PAGE
                          ? 'disabled'
                          : 'active'
                      }
                    >
                      <PaginationLink href="" onClick={() => setQualPage(qualPage + 1)}>
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
  )
}

export default QualityAssurance
