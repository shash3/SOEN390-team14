import React, {useEffect, useState} from 'react';
import axios from 'axios';

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button, Col, CardBody, FormGroup, InputGroup, Input, Form,
} from 'reactstrap';
// core components
import FinanceHeader from '../../components/Headers/FinanceHeader.jsx';
import Chart from 'chart.js';
import {Bar} from "react-chartjs-2";
import {
  chartOptions,
  parseOptions,
  chartAnnualProfits,
  chartAnnualSales,
} from '../../variables/charts';

const Finance = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [prodPlans,setProdPlans] = useState({});
  const [salesPlans,setSalesPlans] = useState({});
  if (Chart) {
    parseOptions(Chart, chartOptions());
  }



  const lookup = async() => {
    await axios
    .get('/api/planning/prod', {
      headers: {
        'x-auth-token': userToken,
      },
    }).then((response) => {
      setProdPlans(response.data)}).catch((error)=>{
        console.error(error);
      });

      await axios
    .get('/api/planning/sales', {
      headers: {
        'x-auth-token': userToken,
      },
    }).then((response) => {
      setSalesPlans(response.data)}).catch((error)=>{
        console.error(error);
      }); 
      
  };
 

  // Change Between Tables
  const [viewSales, setViewSales] = useState(false);

  function closeViewSales() {
    setViewSales(!viewSales);
  };

  const [graphTitle, setGraphTitle] = useState("Annual Profits")
  const [graphData, setGraphData] = useState(chartAnnualProfits.data);
  const [graphOptions, setGraphOptions] = useState(chartAnnualProfits.options);

  useEffect(()=> {
    if(viewSales){
      setGraphData(chartAnnualSales.data);
      setGraphOptions(chartAnnualSales.options);
      setGraphTitle("Annual Sales");
    }
    else
    {
      setGraphData(chartAnnualProfits.data);
      setGraphOptions(chartAnnualProfits.options);
      setGraphTitle("Annual Profits");
    }
  },
  [viewSales]
  );

  return (
      <>
        <FinanceHeader/>
        {/* Page content */}
        <Container className="mt--7" fluid>
          {/* Dark table */}
          <Row className="mt-5">
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-0">Welcome to Finance!</h3>
                </CardHeader>
                <Row className="mb-2 ml-2 mr-2 mt-2">
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className=" mb-0">{graphTitle}</h1>
                      </CardHeader>
                      <CardBody>
                        <Button
                            className="mt-4 mb-3"
                            color="default"
                            onClick={() => {
                              closeViewSales();
                            }}
                        >
                          Toggle Graph
                        </Button>
                              <div className="chart mb-3">
                                <Bar data={graphData}
                                     options={graphOptions}
                                />
                              </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row className="mb-2 ml-2 mr-2 mt-2">
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className="mb-3">Monthly Planning</h1>
                        <Form className="form">
                          <FormGroup>
                            <InputGroup>
                              <Input
                                  type="test"
                                  placeholder="Expected Sales"
                                  name="expectedSales"
                              />
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <InputGroup>
                              <Input
                                  type="test"
                                  placeholder="Expected Procurement Costs"
                                  name="expectedProcurementCosts"
                              />
                            </InputGroup>
                          </FormGroup>
                          <FormGroup>
                            <InputGroup>
                              <Input
                                  type="test"
                                  placeholder="Expected Operating Costs"
                                  name="expectedOperatingCosts"
                              />
                            </InputGroup>
                          </FormGroup>
                          <p>Projected Profits</p>
                          <div className="text-center">
                            <Button color="primary">
                              Change Monthly Goal
                            </Button>
                          </div>
                        </Form>
                      </CardHeader>
                    </Card>
                  </Col>
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className=" mb-0">Monthly Breakdown</h1>
                        <p>Total Sales/Cost/Profit</p>
                        <p>Sales: Dollar Amount/# Bikes Sold</p>
                        <p>Cost: Operational Costs+Hours/Procurement Costs</p>
                      </CardHeader>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </div>
          </Row>
        </Container>
      </>
  );
};
export default Finance;
