import React, { useState, useEffect } from "react";

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
  Label,
} from "reactstrap";

// core components
import Header from "components/Headers/Header.js";

const Production_Scheduling = (props) => {
  const userToken = JSON.parse(localStorage.getItem("user"));

  const [machines, setMachines] = useState([]);

  const NUM_OF_COLS = 2;

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
        setUserLocation(user.location);
      }
    };
    getProdLoc();

    // Retrieve product line location from user
    const getMachines = async () => {
      const response = await axios.get("/api/location",
      {
        location: u
      },
      {
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
    getMachines();
  }, []);


  /* -------------------------
   * Returns the HTML code for the productino tab.
   * -------------------------
   */
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>

        {machines.map((m, i) => (
          <div className='row'>
            
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <h2 className="mb-0">Machine #{i}</h2>
                  </CardHeader>

                  <Media className="align-items-center">
                    <Media>
                      <span className="mb-0 text-sm">{m.location}</span>
                    </Media>
                  </Media>
                  <Media className="align-items-center">
                    <Media>
                      <span className="mb-0 text-sm">{m.item}</span>
                    </Media>
                  </Media>
                  <Media className="align-items-center">
                    <Media>
                      <span className="mb-0 text-sm">{m.date}</span>
                    </Media>
                  </Media>
                  <Badge color="" className="badge-dot mr-4">
                    <i className={m.item == "" ? "bg-success" : "bg-danger"} />
                    {m.item == "" ? "Available" : "Unavailable"}
                  </Badge>

                  <CardFooter className="py-4">
    
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
