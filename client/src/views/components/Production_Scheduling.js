import React, { useState, useEffect } from "react";

import axios from "axios";
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
} from "reactstrap";

// core components
import ProductionHeader from "components/Headers/productionHeader.js";

const Production_Scheduling = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));

  const [userLocation, setUserLocation] = useState("");
  const [machines, setMachines] = useState([]);

  const NUM_OF_COLS = 2;

  // Retrieve product line location from user
  const getMachines = async () => {
    const response = await axios.post("/api/machine/location",
    {
      location: userLocation
    },
    {
      headers: {
        "x-auth-token": userToken,
      },
    })
    .catch((err) => console.log("Error", err));
    if (response && response.data) {
      var machines = response.data;
      setMachines(machines);
    }
  };


  const addItemToMachine = async (key, item) => {
    const final = new Date();
    final.setMinutes(new Date().getMinutes() + 5);

    await axios.put("/api/machine/add",
    {
      _id:key,
      item:item,
      finish_time:final.toISOString(),
    },
    {
      headers: {
        "x-auth-token": userToken,
      },
    })
    .then((response) =>{
      getMachines();
    })
    .catch((err) => console.log("Error", err)); 
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
    })
    .then((response) =>{
      getMachines();
    })
    .catch((err) => console.log("Error", err));
    
  }




  // Retrieve values only once.
  useEffect( () => {
    // Retrieve product line location from user
    const getUserLoc = async () => {
      const response = await axios.get("/api/auth", 
      {
        headers: {
          "x-auth-token": userToken,
        },
      })
      .catch((err) => console.log("Error", err));
      
      if (response && response.data) {
        var user = response.data;
        setUserLocation(user.location);
        
      }
    };

     getUserLoc();
  }, []);


    // Retrieve values only once.
    useEffect( () => {
      
      getMachines();
    }, [userLocation]);

  /* -------------------------
   * Returns the HTML code for the productino tab.
   * -------------------------
   */
  return (
    <>
      <ProductionHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {machines.map((m, i) => (
          <div>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h2 className="mb-0">Machine #{i+1}</h2>
                    <Badge color="" className="badge-dot mr-4">
                      <i className={m.item == "" ? "bg-success" : "bg-danger"} />
                      {m.item == "" ? "Available" : "Unavailable"}
                    </Badge>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Location</th>
                        <th scope="col">{m.item == "" ? "" :"Product Name"}</th>
                        <th scope="col">{m.item == "" ? "" :"Date Finished"}</th>
                        <th scope="col" />
                      </tr>
                      <tr key={"Machine #" + (i+1)}>
                        <td scope="row">
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.location}</span>
                            </Media>
                          </Media>
                        </td>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.item == "" ? "" : m.item}</span>
                            </Media>
                          </Media>
                        </td>
                        <td>
                          <Media className="align-items-center">
                            <Media>
                              <span className="mb-0 text-sm">{m.item == "" ? "" : m.finish_time}</span>
                            </Media>
                          </Media>
                        </td>
                      </tr>
                    </thead>
                  </Table>
                  <CardFooter className="py-2 pb-3">
                    <ButtonGroup className='px-3'>
                      <Button 
                        className="mt-4"
                        color="primary"
                        onClick={(e) => addItemToMachine(m._id, "Saddle")}
                      >
                        Add Saddle (testing)
                      </Button>
                    </ButtonGroup>
                      
                    <ButtonGroup className='px-3'>
                      <Button 
                        className="mt-4"
                        color="primary"
                        onClick={(e) => removeItemFromMachine(m._id)}
                      >
                        Abort Process
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </div>
            </Row>
            <br/>
            <br/>
          </div>
        ))}
      </Container>

    </>
  );
};

export default Production_Scheduling;