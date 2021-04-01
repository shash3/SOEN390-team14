/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';

import axios from 'axios';
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
} from 'reactstrap';

// core components
import Tooltip from '@material-ui/core/Tooltip';
import { Bar } from "react-chartjs-2";
import ProductionHeader from '../../components/Headers/productionHeader.jsx';

const ProductionScheduling = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));

  const [userLocation, setUserLocation] = useState('');
  const [machines, setMachines] = useState([]);
  const [machineView, updateMachineView] = useState(false);

  const [displayYearGraph, setDisplayYearGraph] = useState(true);
  const [planningYears, setPlanningYears] = useState([]);
  const [graphYear, setGraphYear] = useState(new Date().getUTCFullYear());
  const [graphMonth, setGraphMonth] = useState('');
  const [graphData, setGraphData] = useState({});

  const MINUTES_TO_FINISH = 5;

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
          location: userLocation,
        },
        {
          headers: {
            'x-auth-token': userToken,
          },
        }).then((response) => response.data).catch((err) => console.error('Error', err));
      return reply;
    };

    const readMachineLog = async () => {
      const reply = await axios.get('/api/machine/json', {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((err) => console.error('Error', err));
      return reply.data;
    };
  
    const writeMachineLog = async (qualityJson) => {
      await axios.post('/api/machine/json', {
        data: qualityJson,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((error) => { console.error(error); });
    };

    const updateMachineLog = async (machineKey, item, date, location) => {
      const machinesLog = await readMachineLog();
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const year = date.getUTCFullYear();
      const month = monthNames[date.getUTCMonth()];
      
      if (machinesLog[year] === undefined) {
        machinesLog[year] = {};
      }
      const machineYear = machinesLog[year];
      
      if (machineYear[month] === undefined) {
        machineYear[month] = {};
      }
      const machineMonth = machineYear[month];

      if (machineMonth[location] === undefined) {
        machineMonth[location] = {};
      }
      const machineLocation = machineMonth[location];

      if (machineLocation[machineKey] === undefined) {
        machineLocation[machineKey] = {
          'items': {},
          'minutesLogged' : 0,
        };
      }
      const machineItems = machineLocation[machineKey].items;

      if (machineItems[item] === undefined) {
        machineItems[item] = 0;
      } 

      machineItems[item] += 1;
      machineLocation[machineKey].minutesLogged += 5;

      writeMachineLog(machinesLog);
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
      if (userLocation === undefined) {
        return;
      }
      let updated = 0;
      const unavailMachines = await returnUnavailableMachines();
      for (let index = 0; index < unavailMachines.length; index += 1) {
        const machine = unavailMachines[index];
        if ((new Date(machine.finish_time)).valueOf() < (new Date()).valueOf()) {
          await updateMachineLog(machine._id, machine.item, new Date(), userLocation);
          await addToQuality(machine.item, machine.type, userLocation);
          await removeItemFromMachine(machine._id);
          updated += 1;
        }
      }
      if (updated > 0) {
        updateMachineView(!machineView);
      }
    };

    main();
  }, [refreshMachine]);

  /* -----------------------
   * Functions for interacting with machines.
   * -----------------------
   */

  /**
   * Get the machines at the user's location.
   */
  const getMachines = async () => {
    const response = await axios.post('/api/machine/location',
      {
        location: userLocation,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .catch((err) => console.error('Error', err));
    if (response && response.data) {
      const newMachines = response.data;
      setMachines(newMachines);
    }
  };

  /**
   * Add a new machine to the user's location.
   */
  const addNewMachine = async () => {
    await axios.post('/api/machine/add',
      {
        location: userLocation,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((err) => console.error('Error', err));
    updateMachineView(!machineView);
  };

  /**
   * Delete a machine from the user's location with the id.
   *
   * @param {Object} id the unique key of the machine
   */
  const deleteMachine = async (id) => {
    await axios.post('/api/machine/delete',
      {
        _id: id,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      }).catch((err) => console.error('Error', err));
    updateMachineView(!machineView);
  };

  /**
   * Add a part or product to the machine to commence production.
   * The item will complete being produced after a set number of minutes.
   *
   * @param {Object} key the unique key of the machine
   * @param {String} item the name of the item to add
   * @param {String} type the type of the item
   */
  const addItemToMachine = async (key, item, type) => {
    const final = new Date();
    final.setMinutes(new Date().getMinutes() + MINUTES_TO_FINISH);

    await axios.put('/api/machine/add',
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
      })
      .then(() => {
        getMachines();
      })
      .catch((err) => console.error('Error', err));
  };

  /**
   * Aborts the machine process and removes the item from the machine.
   *
   * @param {Object} key the unique key of the machine
   */
  const removeItemFromMachine = async (key) => {
    await axios.put('/api/machine/remove',
      {
        _id: key,
      },
      {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then(() => {
        getMachines();
      })
      .catch((err) => console.error('Error', err));
  };

  // Retrieve values only once.
  useEffect(() => {
    // Retrieve machine location from user
    const getUserLoc = async () => {
      const response = await axios.get('/api/auth',
        {
          headers: {
            'x-auth-token': userToken,
          },
        })
        .catch((err) => console.error('Error', err));

      if (response && response.data) {
        const user = response.data;
        setUserLocation(user.location);
      }
    };

    getUserLoc();
  }, []);

  // Retrieve machine data when the view is upated.
  useEffect(() => {
    getMachines();
  }, [userLocation, machineView]);


  
  /* -------------------------
   * Functions for planning scheduling.
   * -------------------------
   */

  const readMachineLog = async () => {
    const reply = await axios.get('/api/machine/json', {
      headers: {
        'x-auth-token': userToken,
      },
    }).catch((err) => console.error('Error', err));
    return reply.data;
  };

  const rand = () => Math.floor(Math.random() * 255);

  /**
   * Gets all the years that have a planned schedule.
   * 
   * @returns all the years with a planned schedule
   */
  const getPlanningYears = () => {
    const years = [2020, 2021];
    return years;
  }

  /**
   * Get the yearly data of the production plant.
   * 
   * @param {BigInteger} year the year to get data of
   * @param {String} location the location to get data of
   * @returns 
   */
  const getYearlyData = async (year, location) => {
    const yearlyData = [rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()];
    return yearlyData;
  };

  const getYearlyScheduling = async (year, location) => {
    const labels = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const yearlyData = await getYearlyData(year, location);
    const datasets = [
      {
        label: 'Bikes Created',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: yearlyData,
      },
      {
        type: 'line',
        label: 'Trend Line',
        borderColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        borderWidth: 2,
        fill: false,
        data: yearlyData,
      }
    ];

    return {
      labels,
      datasets
    };
  };
  
  const getMonthlyLabel = async (year, month, location) => {
    const plan = '';
    return ['Saddle', 'Leather', 'Bike'];
  }

  const getMonthlyPlanned = async (label, year, month, location) => {
    const plan = '';
    const quantitiesPlanned = []
    label.forEach(item => {
      try {
        quantitiesPlanned.push(10);
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('undefined')){
          quantitiesPlanned.push(0);
        }
      }
    });
    return quantitiesPlanned;
  };

  const getMonthlyCreated = async (label, year, month, location) => {
    const machinesLog = await readMachineLog();
    try {
      const machineOperations = machinesLog[year][month][location];
      const quantitiesCreated = []
      for (let index = 0; index < label.length; index += 1) {
        const item = label[index];
        try {
          let totalQuant = 0;
          for (const machineKey in machineOperations) {
            const quantity = machineOperations[machineKey].items[item];
            totalQuant += (quantity === undefined ? 0 : quantity);
          }
          quantitiesCreated.push(totalQuant);
        } catch (error) {
          if (error.name === 'TypeError' && error.message.includes('undefined')){
            quantitiesCreated.push(0);
          }
        }
      };
      return quantitiesCreated;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('undefined')){
        return [0];
      }
      throw error;
    }
  };

  const getMonthlyScheduling = async (year, month, location) => {
    const monthlyLabel = await getMonthlyLabel(year, month, location);
    const monthlyPlannedData = await getMonthlyPlanned(monthlyLabel, year, month, location);
    const monthlyCreatedData = await getMonthlyCreated(monthlyLabel, year, month, location);
    const datasets = [
      {
        label: 'Planned',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: monthlyPlannedData,
      },
      {
        label: 'Created',
        backgroundColor: `rgb(${rand()}, ${rand()}, ${rand()})`,
        data: monthlyCreatedData,
      }
    ];

    return {
      labels: monthlyLabel,
      datasets
    };
  }


  const selectedElementOnGraph = element => {
    if (!element.length) {
      return;
    }

    const { _datasetIndex: datasetIndex, _index: index } = element[0]
    const datasetName = graphData.datasets[datasetIndex].label;
    if (datasetName === 'Trend Line') {
      return;
    }
    if (datasetName === 'Bikes Created') {
      const month = graphData.labels[index];
      setGraphMonth(month);
      setDisplayYearGraph(!displayYearGraph);
    }
  };
  
  useEffect(() => {
    setPlanningYears(getPlanningYears());
  }, []);
  
  useEffect(async () => {
    if (displayYearGraph){
      setGraphData(await getYearlyScheduling(graphYear, userLocation));
    } else {
      setGraphData(await getMonthlyScheduling(graphYear, graphMonth, userLocation))
    }
  }, [graphYear, displayYearGraph]);

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
              <h1 className=" mb-0">Machine Planning For Location: {userLocation}</h1>
            </CardHeader>
            <CardBody>
              { displayYearGraph ?
                <div>
                  <Label>
                    Select a year
                  </Label>
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
                </div>
                :
                <div>
                  <Tooltip
                    title="Return to yearly scheduling"
                    arrow
                    placement="top-start"
                    enterDelay={750}
                  >
                    <Button
                      color="secondary"
                      onClick={() => setDisplayYearGraph(!displayYearGraph)}
                    >
                      &lt; Back
                    </Button>
                  </Tooltip>
                  <Label
                    className="ml-2"
                  >
                    Schedule for {graphMonth}, {graphYear}
                  </Label>
                </div>
                
              }
              <Bar
                data={graphData}
                options={{}}
                getElementAtEvent={(e) => {selectedElementOnGraph(e)}}
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
              <Button
                color="secondary"
                onClick={() => addNewMachine()}
              >
                Create New Machine
              </Button>
            </Tooltip>
          </ButtonGroup>
        </Form>

        {machines.map((m, i) => (
          <div>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h2 className="mb-0">
                      Machine #
                      {i + 1}
                    </h2>
                    <Badge color="" className="badge-dot mr-6">
                      <i className={m.item === '' ? 'bg-success' : 'bg-danger'} />
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
                        <th scope="col">{m.item === '' ? '' : 'Product Name'}</th>
                        <th scope="col">{m.item === '' ? '' : 'Date Finished'}</th>
                      </tr>
                      <tr key={`Machine #${i + 1}`}>
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
                              <span className="mb-0 text-sm">{m.item === '' ? '' : m.item}</span>
                            </Media>
                          </Media>
                        </td>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.item === '' ? '' : new Date(m.finish_time.toString()).toString()}</span>
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
                        onClick={() => addItemToMachine(m._id, 'Saddle', 'part')}
                      >
                        Add Saddle (testing)
                      </Button>
                    </ButtonGroup>

                    <ButtonGroup className="px-3">
                      <Tooltip
                        title="Remove item from this machine. This will destroy all the materials needed to created this item"
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
  );
};

export default ProductionScheduling;
