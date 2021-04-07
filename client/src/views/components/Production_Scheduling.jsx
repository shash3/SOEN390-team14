/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'

import axios from 'axios'
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Media,
  Table,
  Container,
  Row,
  ButtonGroup,
  Button,
  Input,
  Form,
  Label,
} from 'reactstrap'

// core components
import Tooltip from '@material-ui/core/Tooltip'
import { Bar } from 'react-chartjs-2'
import { FormGroup } from '@material-ui/core'
import ProductionHeader from '../../components/Headers/productionHeader.jsx'

const ProductionScheduling = () => {
  const userToken = JSON.parse(localStorage.getItem('user'))

  const [userLocation, setUserLocation] = useState('')
  const [finalProducts, setFinalProducts] = useState([])
  const [machines, setMachines] = useState([])
  const [machineView, updateMachineView] = useState(false)

  const months = [
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
  const [graphLinks, setGraphLinks] = useState(['year'])
  const [planningYears, setPlanningYears] = useState([])
  const [graphYear, setGraphYear] = useState(new Date().getUTCFullYear())
  const [graphMonth, setGraphMonth] = useState(months[new Date().getUTCMonth()])
  const [graphItem, setGraphItem] = useState('')
  const [graphMachineKey, setGraphMachineKey] = useState('')

  const [graphHeader, setGraphHeader] = useState(<></>)
  const [graphData, setGraphData] = useState({})

  const MINUTES_TO_FINISH = 5

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
          },
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
          },
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
          },
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
          },
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
          await updateMachineLog(
            machine._id,
            machine.item,
            new Date(),
            userLocation,
          )
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

  /* -----------------------
   * Functions for interacting with machines.
   * -----------------------
   */

  /**
   * Get the machines at the user's location.
   */
  const getMachines = async () => {
    const response = await axios
      .post(
        '/api/machine/location',
        {
          location: userLocation,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        },
      )
      .catch((err) => console.error('Error', err))
    if (response && response.data) {
      const newMachines = response.data
      setMachines(newMachines)
    }
  }

  /**
   * Add a new machine to the user's location.
   */
  const addNewMachine = async () => {
    await axios
      .post(
        '/api/machine/add',
        {
          location: userLocation,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        },
      )
      .catch((err) => console.error('Error', err))
    updateMachineView(!machineView)
  }

  /**
   * Delete a machine from the user's location with the id.
   *
   * @param {Object} id the unique key of the machine
   */
  const deleteMachine = async (id) => {
    await axios
      .post(
        '/api/machine/delete',
        {
          _id: id,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        },
      )
      .catch((err) => console.error('Error', err))
    updateMachineView(!machineView)
  }

  /**
   * Add a part or product to the machine to commence production.
   * The item will complete being produced after a set number of minutes.
   *
   * @param {Object} key the unique key of the machine
   * @param {String} item the name of the item to add
   * @param {String} type the type of the item
   */
  const addItemToMachine = async (key, item, type) => {
    const final = new Date()
    final.setMinutes(new Date().getMinutes() + MINUTES_TO_FINISH)

    await axios
      .put(
        '/api/machine/add',
        {
          _id: key,
          item,
          type,
          finishTime: final.toISOString(),
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        },
      )
      .then(() => {
        getMachines()
      })
      .catch((err) => console.error('Error', err))
  }

  /**
   * Aborts the machine process and removes the item from the machine.
   *
   * @param {Object} key the unique key of the machine
   */
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
        },
      )
      .then(() => {
        getMachines()
      })
      .catch((err) => console.error('Error', err))
  }

  // Retrieve values only once.
  useEffect(() => {
    // Retrieve machine location from user
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
        setUserLocation(user.location)
      }
    }

    getUserLoc()
  }, [])

  // Retrieve machine data when the view is upated.
  useEffect(() => {
    getMachines()
  }, [userLocation, machineView])

  /* -------------------------
   * Functions for planning scheduling.
   * -------------------------
   */

  /**
   * Returns a random integer between [0, 255[.
   * @returns a random integer
   */
  const rand = () => Math.floor(Math.random() * 255)

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

  const readProductionPlanning = async () => {
    const reply = await axios
      .get('/api/planning/prod', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .catch((err) => console.error('Error', err))
    return reply.data
  }

  const getFinalProducts = async () => {
    const reply = await axios
      .post(
        '/api/product_line/type',
        {
          type: 'final',
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        },
      )
      .catch((err) => console.error('Error', err))
    return reply.data
  }

  /**
   * Gets all the years that have a planned schedule.
   *
   * @returns all the years with a planned schedule
   */
  const getPlanningYears = async () => {
    const productionPlanning = await readProductionPlanning()
    const years = Object.keys(productionPlanning)
    return years
  }

  /**
   * Returns the amount of final products planned for during a certain year at a given location for each month.
   *
   * @param {String} location the location the items were created
   * @param {BigInteger} year the year the items were created
   * @param {Array} labels the label that the data must match to
   * @param {Object} plannedProduction the production data of all machines
   * @returns an array of the amount of items created for each label
   */
  const getYearlyPlannedData = async (
    location,
    year,
    labels,
    plannedProduction,
  ) => {
    const quantitiesPlanned = []
    const plannedYearData = plannedProduction[year]
    if (plannedYearData === undefined) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    labels.forEach((month) => {
      if (
        plannedYearData[month] === undefined ||
        plannedYearData[month][location] === undefined
      ) {
        quantitiesPlanned.push(0)
        return
      }

      const plannedLocationData = plannedYearData[month][location]
      let totalQuant = 0
      finalProducts.forEach((item) => {
        const quantity = plannedLocationData[item.name]
        totalQuant += quantity === undefined ? 0 : quantity
      })

      quantitiesPlanned.push(totalQuant)
    })
    return quantitiesPlanned
  }

  /**
   * Returns the amount of final products created during a certain year at a given location for each month.
   *
   * @param {String} location the location the items were created
   * @param {BigInteger} year the year the items were created
   * @param {Array} labels the label that the data must match to
   * @param {Object} machinesLog the production data of all machines
   * @returns an array of the amount of items created for each label
   */
  const getYearlyActualData = async (location, year, labels, machinesLog) => {
    const quantitiesCreated = []
    const machineYearData = machinesLog[year]
    if (machineYearData === undefined) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    labels.forEach((month) => {
      if (
        machineYearData[month] === undefined ||
        machineYearData[month][location] === undefined
      ) {
        quantitiesCreated.push(0)
        return
      }

      const machineLocationData = machineYearData[month][location]
      let totalQuant = 0
      Object.keys(machineLocationData).forEach((machineKey) => {
        const machine = machineLocationData[machineKey]

        finalProducts.forEach((item) => {
          const machineItems = machine.items
          if (
            !(
              machineItems === undefined ||
              machineItems[item.name] === undefined
            )
          ) {
            const quantity = machineItems[item.name]
            totalQuant += quantity === undefined ? 0 : quantity
          }
        })
      })

      quantitiesCreated.push(totalQuant)
    })
    return quantitiesCreated
  }

  /**
   * Returns the graph data for the scheduling of production over a year at a location.
   *
   * @param {String} location the location to the items were created.
   * @param {BigInteger} year the year the items were creted.
   * @returns the graph data for the scheduling of production
   */
  const getYearlyScheduling = async (location, year) => {
    const productionPlanning = await readProductionPlanning()
    const machinesLog = await readMachineLog()

    const labels = months
    const plannedYearlyData = await getYearlyPlannedData(
      location,
      year,
      labels,
      productionPlanning,
    )
    const createdYearlyData = await getYearlyActualData(
      location,
      year,
      labels,
      machinesLog,
    )
    const plannedColor = `rgb(${rand()}, ${rand()}, ${rand()})`
    const actualColor = `rgb(${rand()}, ${rand()}, ${rand()})`
    const datasets = [
      {
        type: 'line',
        label: 'Planned Trend Line',
        borderColor: plannedColor,
        borderWidth: 2,
        fill: false,
        data: plannedYearlyData,
      },
      {
        type: 'line',
        label: 'Created Trend Line',
        borderColor: actualColor,
        borderWidth: 2,
        fill: false,
        data: createdYearlyData,
      },
      {
        label: 'Items Planned Monthly',
        backgroundColor: plannedColor,
        data: plannedYearlyData,
      },
      {
        label: 'Items Created Monthly',
        backgroundColor: actualColor,
        data: createdYearlyData,
      },
    ]

    return {
      labels,
      datasets,
    }
  }

  /**
   * Returns the item names that a month plans to produce.
   *
   * @returns the labels for selecting a month
   */
  const getMonthlyLabel = async () => {
    const itemNames = []
    finalProducts.forEach((product) => {
      itemNames.push(product.name)
    })
    return itemNames
  }

  /**
   * Returns the amount of final products planned during a certain year and month at a given location for each final product.
   *
   * @param {String} location the location the items were created
   * @param {BigInteger} year the year the items were created
   * @param {String} month the month the items were created
   * @param {Array} labels the label that the data must match to
   * @param {Object} plannedProduction the production data of all machines
   * @returns an array of the amount of items planned for each label
   */
  const getMonthlyPlanned = async (
    location,
    year,
    month,
    labels,
    plannedProduction,
  ) => {
    if (
      plannedProduction[year] === undefined ||
      plannedProduction[year][month] === undefined ||
      plannedProduction[year][month][location] === undefined
    ) {
      return Array(labels.length).fill(0, 0, labels.length)
    }
    const productionPlan = plannedProduction[year][month][location]

    const quantitiesPlanned = []
    labels.forEach((item) => {
      const quantity = productionPlan[item]
      quantitiesPlanned.push(quantity === undefined ? 0 : quantity)
    })
    return quantitiesPlanned
  }

  /**
   * Returns the amount of final products created during a certain year and month at a given location for each final product.
   *
   * @param {String} location the location the items were created
   * @param {BigInteger} year the year the items were created
   * @param {String} month the month the items were created
   * @param {Array} labels the label that the data must match to
   * @param {Object} machinesLog the production data of all machines
   * @returns an array of the amount of items created for each label
   */
  const getMonthlyActual = async (
    location,
    year,
    month,
    labels,
    machinesLog,
  ) => {
    if (
      machinesLog[year] === undefined ||
      machinesLog[year][month] === undefined ||
      machinesLog[year][month][location] === undefined
    ) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    const machineOperations = machinesLog[year][month][location]
    const quantitiesCreated = []
    labels.forEach((item) => {
      let totalQuant = 0
      Object.keys(machineOperations).forEach((machineKey) => {
        const machineItems = machineOperations[machineKey].items
        if (!(machineItems === undefined || machineItems[item] === undefined)) {
          const quantity = machineItems[item]

          console.log(quantity)
          totalQuant += quantity
        }
      })

      quantitiesCreated.push(totalQuant)
    })
    return quantitiesCreated
  }

  /**
   * Returns the graph data for the scheduling of production over a year and month at a location.
   *
   * @param {String} location the location to the items were created.
   * @param {BigInteger} year the year the items were creted.
   * @param {String} month the month the items were created
   * @returns the graph data for the scheduling of production
   */
  const getMonthlyScheduling = async (location, year, month) => {
    const productionPlanning = await readProductionPlanning()
    const machinesLog = await readMachineLog()

    const monthlyLabel = await getMonthlyLabel()
    const monthlyPlannedData = await getMonthlyPlanned(
      location,
      year,
      month,
      monthlyLabel,
      productionPlanning,
    )
    const monthlyCreatedData = await getMonthlyActual(
      location,
      year,
      month,
      monthlyLabel,
      machinesLog,
    )
    const datasets = [
      {
        label: 'Total Items Planned',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: monthlyPlannedData,
      },
      {
        label: 'Total Items Created',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: monthlyCreatedData,
      },
    ]

    return {
      labels: monthlyLabel,
      datasets,
    }
  }

  /**
   * Returns the machine keys in a location that plan to produce during a year and month.
   *
   * @param {String} location the location the items were created
   * @param {BigInteger} year the year the items were created
   * @param {String} month the month the items were created
   * @param {Object} machinesLog the production data of all machines
   * @returns the labels for selecting a machine
   */
  const getItemLabel = async (location, year, month, machinesLog) => {
    const persistentMachineKeys = []
    machines.forEach((machine) => {
      persistentMachineKeys.push(machine._id)
    })

    if (
      !(
        machinesLog[year] === undefined ||
        machinesLog[year][month] === undefined ||
        machinesLog[year][month][location] === undefined
      )
    ) {
      const machineOperations = machinesLog[year][month][location]
      Object.keys(machineOperations).forEach((key) => {
        if (!persistentMachineKeys.includes(key)) {
          persistentMachineKeys.push(key)
        }
      })
    }

    return persistentMachineKeys
  }

  /**
   * Returns the amount of a final product created certain year and month at a given location for each machine.
   *
   * @param {String} location the location the item was created
   * @param {BigInteger} year the year the item was created
   * @param {String} month the month the item was created
   * @param {String} item the item name that was created
   * @param {Array} labels the label that the data must match to
   * @param {Object} machinesLog the production data of all machines
   * @returns an array of the amount of an item created for each label
   */
  const getItemsData = async (
    location,
    year,
    month,
    item,
    labels,
    machinesLog,
  ) => {
    if (
      machinesLog[year] === undefined ||
      machinesLog[year][month] === undefined ||
      machinesLog[year][month][location] === undefined
    ) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    const machineOperations = machinesLog[year][month][location]
    const quantitiesCreated = []
    labels.forEach((machineKey) => {
      if (
        machineOperations[machineKey] === undefined ||
        machineOperations[machineKey].items === undefined ||
        machineOperations[machineKey].items[item] === undefined
      ) {
        quantitiesCreated.push(0)
        return
      }

      const quantity = machineOperations[machineKey].items[item]
      quantitiesCreated.push(quantity)
    })

    return quantitiesCreated
  }

  /**
   * Returns the graph data for the scheduling of an item's production over a year and month at a location.
   *
   * @param {String} location the location to the item was created.
   * @param {BigInteger} year the year the item was creted.
   * @param {String} month the month the item was created
   * @param {String} item the item name that was created
   * @returns the graph data for the scheduling of production
   */
  const getItemScheduling = async (location, year, month, item) => {
    const machinesLog = await readMachineLog()
    const itemLabel = await getItemLabel(location, year, month, machinesLog)
    const itemData = await getItemsData(
      location,
      year,
      month,
      item,
      itemLabel,
      machinesLog,
    )
    const datasets = [
      {
        label: 'Total Items Created In Machine',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: itemData,
      },
    ]

    return {
      labels: itemLabel,
      datasets,
    }
  }

  const getAllMachineLabels = async (location, year, month, machinesLog) => {
    const persistentMachineKeys = []
    machines.forEach((machine) => {
      persistentMachineKeys.push(machine._id)
    })

    if (
      !(
        machinesLog[year] === undefined ||
        machinesLog[year][month] === undefined ||
        machinesLog[year][month][location] === undefined
      )
    ) {
      const machineOperations = machinesLog[year][month][location]
      const loggedMachineKeys = Object.keys(machineOperations)
      loggedMachineKeys.forEach((key) => {
        if (!persistentMachineKeys.includes(key)) {
          persistentMachineKeys.push(key)
        }
      })
    }
    return persistentMachineKeys
  }

  const getAllMachineData = async (
    location,
    year,
    month,
    labels,
    machinesLog,
  ) => {
    if (
      machinesLog[year] === undefined ||
      machinesLog[year][month] === undefined ||
      machinesLog[year][month][location] === undefined
    ) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    const machineOperations = machinesLog[year][month][location]
    const quantitiesCreated = []
    labels.forEach((machineKey) => {
      let totalQuant = 0
      if (
        machineOperations[machineKey] === undefined ||
        machineOperations[machineKey].items === undefined
      ) {
        quantitiesCreated.push(0)
        return
      }

      const machineItems = machineOperations[machineKey].items
      finalProducts.forEach((itemName) => {
        const quantity = machineItems[itemName.name]
        totalQuant += quantity === undefined ? 0 : quantity
      })
      quantitiesCreated.push(totalQuant)
    })

    return quantitiesCreated
  }

  const getAllMachineScheduling = async (location, year, month) => {
    const machinesLog = await readMachineLog()
    const allMachinesLabel = await getAllMachineLabels(
      location,
      year,
      month,
      machinesLog,
    )
    const allMachineData = await getAllMachineData(
      location,
      year,
      month,
      allMachinesLabel,
      machinesLog,
    )

    const datasets = [
      {
        label: 'Total Items Created Per Machine',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: allMachineData,
      },
    ]
    return {
      labels: allMachinesLabel,
      datasets,
    }
  }

  const getMachineItemsLabel = async () => {
    const itemNames = []
    finalProducts.forEach((product) => {
      itemNames.push(product.name)
    })
    return itemNames
  }

  const getMachineItemsData = async (
    location,
    year,
    month,
    machine,
    labels,
    machinesLog,
  ) => {
    if (
      machinesLog[year] === undefined ||
      machinesLog[year][month] === undefined ||
      machinesLog[year][month][location] === undefined ||
      machinesLog[year][month][location][machine] === undefined ||
      machinesLog[year][month][location][machine].items === undefined
    ) {
      return Array(labels.length).fill(0, 0, labels.length)
    }

    const machineItems = machinesLog[year][month][location][machine].items
    const quantitiesCreated = []
    labels.forEach((itemName) => {
      const quantity = machineItems[itemName]
      quantitiesCreated.push(quantity === undefined ? 0 : quantity)
    })

    return quantitiesCreated
  }

  const getMachineItemScheduling = async (location, year, month, machine) => {
    const machinesLog = await readMachineLog()
    const machineItemsLabel = await getMachineItemsLabel(
      location,
      year,
      month,
      machine,
      machinesLog,
    )
    const machineItemsData = await getMachineItemsData(
      location,
      year,
      month,
      machine,
      machineItemsLabel,
      machinesLog,
    )

    const datasets = [
      {
        label: 'Total Amount Created by Machine',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: machineItemsData,
      },
    ]
    return {
      labels: machineItemsLabel,
      datasets,
    }
  }

  const selectedElementOnGraph = (element) => {
    if (!element.length) {
      return
    }
    const { _datasetIndex: datasetIndex, _index: index } = element[0]
    const datasetName = graphData.datasets[datasetIndex].label
    const label = graphData.labels[index]

    switch (datasetName) {
      case 'Items Created Monthly':
        setGraphMonth(label)
        setGraphLinks([...graphLinks, 'month'])
        break
      case 'Total Items Created':
      case 'Total Amount Created by Machine':
        setGraphItem(label)
        setGraphLinks([...graphLinks, 'item'])
        break
      case 'Total Items Created In Machine':
      case 'Total Items Created Per Machine':
        setGraphMachineKey(label)
        setGraphLinks([...graphLinks, 'machineItem'])
        break
      default:
        break
    }
  }

  const selectHomeGraph = () => {
    if (graphLinks.length > 1) {
      setGraphLinks(graphLinks.slice(0, 1))
    }
  }

  const selectBackGraph = () => {
    if (graphLinks.length > 1) {
      setGraphLinks(graphLinks.slice(0, -1))
    }
  }

  const getGraphHeader = (currentGraph) => {
    let html = <></>
    if (currentGraph === 'month') {
      html = (
        <Label className="ml-2 text-center">
          Schedule of items for {graphMonth}, {graphYear}
        </Label>
      )
    } else if (currentGraph === 'item') {
      html = (
        <Label className="ml-2 text-center">
          Machine Breakdown of the {graphItem} Item for {graphMonth},{' '}
          {graphYear}
        </Label>
      )
    } else if (currentGraph === 'machine') {
      html = (
        <Label className="ml-2 text-center">
          Machine Breakdown of all items for {graphMonth}, {graphYear}
        </Label>
      )
    } else if (currentGraph === 'machineItem') {
      html = (
        <Label className="ml-2 text-center">
          Item Breakdown for Machine "{graphMachineKey}" for {graphMonth},{' '}
          {graphYear}
        </Label>
      )
    }
    return html
  }

  useEffect(async () => {
    setFinalProducts(await getFinalProducts())
    setPlanningYears(await getPlanningYears())
  }, [])

  useEffect(async () => {
    if (userLocation === '') {
      return
    }
    const graphDisplay = graphLinks[graphLinks.length - 1]
    setGraphHeader(getGraphHeader(graphDisplay))
    if (graphDisplay === 'year') {
      setGraphData(await getYearlyScheduling(userLocation, graphYear))
    } else if (graphDisplay === 'month') {
      setGraphData(
        await getMonthlyScheduling(userLocation, graphYear, graphMonth),
      )
    } else if (graphDisplay === 'item') {
      setGraphData(
        await getItemScheduling(userLocation, graphYear, graphMonth, graphItem),
      )
    } else if (graphDisplay === 'machine') {
      setGraphData(
        await getAllMachineScheduling(userLocation, graphYear, graphMonth),
      )
    } else if (graphDisplay === 'machineItem') {
      setGraphData(
        await getMachineItemScheduling(
          userLocation,
          graphYear,
          graphMonth,
          graphMachineKey,
        ),
      )
    }
  }, [graphYear, graphLinks, machineView, userLocation])

  /* -------------------------
   * Returns the HTML code for the productino tab.
   * -------------------------
   */
  return (
    <>
      <ProductionHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Form>
          <Card className="shadow">
            <CardHeader className="bg-transparent text-center">
              <h1 className=" mb-0">
                Machine Planning For Location: {userLocation}
              </h1>
            </CardHeader>
            <CardHeader>
              <ButtonGroup>
                {graphLinks[graphLinks.length - 1] === 'year' ? (
                  <FormGroup>
                    <Label className="text-center">Select a year</Label>
                    <Input
                      type="select"
                      name="year"
                      value={graphYear}
                      onChange={(e) => setGraphYear(e.target.value)}
                    >
                      {planningYears.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </Input>
                  </FormGroup>
                ) : (
                  <div>
                    <Tooltip
                      title="Return to year graph"
                      arrow
                      placement="top-start"
                      enterDelay={750}
                    >
                      <Button
                        className="mr-2"
                        color="secondary"
                        onClick={() => selectHomeGraph()}
                      >
                        Home
                      </Button>
                    </Tooltip>
                    <Tooltip
                      title="Return to previous graph"
                      arrow
                      placement="top-start"
                      enterDelay={750}
                    >
                      <Button
                        className="ml-2"
                        color="secondary"
                        onClick={() => selectBackGraph()}
                      >
                        &lt; Back
                      </Button>
                    </Tooltip>
                    {graphHeader}
                  </div>
                )}
              </ButtonGroup>
              <Button
                className="float-right"
                color="info"
                onClick={() => {
                  setGraphLinks([...graphLinks, 'machine'])
                }}
              >
                Go To Machine Schedule
              </Button>
            </CardHeader>
            <CardBody>
              <Bar
                className="form-control"
                data={graphData}
                getElementAtEvent={(e) => {
                  selectedElementOnGraph(e)
                }}
              />
            </CardBody>
          </Card>
        </Form>

        <Form>
          <ButtonGroup className="my-3">
            <Tooltip
              title="Create a new machine at your location"
              arrow
              placement="top-start"
              enterDelay={750}
            >
              <Button color="secondary" onClick={() => addNewMachine()}>
                Create New Machine
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Form>

        {machines.map((m, i) => (
          <div key={m._id}>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h2 className="mb-0">Machine #{i + 1}</h2>
                    <Badge color="" className="badge-dot mr-6">
                      <i
                        className={m.item === '' ? 'bg-success' : 'bg-danger'}
                      />
                      {m.item === '' ? 'Available' : 'Unavailable'}
                    </Badge>
                    <Tooltip
                      title="Remove this machine at your location"
                      arrow
                      placement="top-start"
                      enterDelay={750}
                    >
                      <Button
                        color="danger"
                        onClick={() => deleteMachine(m._id)}
                        hidden={m.item !== ''}
                      >
                        Destroy Machine
                      </Button>
                    </Tooltip>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Location</th>
                        <th scope="col">
                          {m.item === '' ? '' : 'Product Name'}
                        </th>
                        <th scope="col">
                          {m.item === '' ? '' : 'Date Finished'}
                        </th>
                      </tr>
                      <tr>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.location}</span>
                            </Media>
                          </Media>
                        </td>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {m.item === '' ? '' : m.item}
                              </span>
                            </Media>
                          </Media>
                        </td>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">
                                {m.item === ''
                                  ? ''
                                  : new Date(
                                      m.finish_time.toString(),
                                    ).toString()}
                              </span>
                            </Media>
                          </Media>
                        </td>
                      </tr>
                    </thead>
                  </Table>
                  <CardFooter className="py-2 pb-3">
                    <ButtonGroup className="px-3">
                      <Button
                        className="mt-4"
                        color="primary"
                        onClick={() =>
                          addItemToMachine(m._id, 'Saddle', 'part')
                        }
                      >
                        Add Saddle (testing)
                      </Button>
                    </ButtonGroup>
                    <ButtonGroup className="px-3">
                      <Tooltip
                        title="Remove item from this machine. This will destroy all the materials needed to create this item"
                        arrow
                        placement="top-start"
                        enterDelay={750}
                      >
                        <Button
                          className="mt-4"
                          color="primary"
                          onClick={() => removeItemFromMachine(m._id)}
                          hidden={m.item === ''}
                        >
                          Abort Process
                        </Button>
                      </Tooltip>
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </div>
            </Row>
            <br />
            <br />
          </div>
        ))}
      </Container>
    </>
  )
}

export default ProductionScheduling
