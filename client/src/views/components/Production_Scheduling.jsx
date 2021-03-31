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
  CardFooter,
  Media,
  Table,
  Container,
  Row,
  ButtonGroup,
  Button,
  Form,
} from 'reactstrap';

// core components
import Tooltip from '@material-ui/core/Tooltip';
import ProductionHeader from '../../components/Headers/productionHeader.jsx';

const ProductionScheduling = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));

  const [userLocation, setUserLocation] = useState('');
  const [machines, setMachines] = useState([]);
  const [machineView, updateMachineView] = useState(false);

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

  /**
   * Functions for interacting with machines.
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
   * Returns the HTML code for the productino tab.
   * -------------------------
   */
  return (
    <>
      <ProductionHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
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
