import React, {useEffect, useState} from 'react';

// reactstrap components
import {
  Card,
  CardHeader,
  Container,
  Row,
  Button, Col, CardBody,
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

  if (Chart) {
    parseOptions(Chart, chartOptions());
  }

  // Change Between Tables
  const [viewSales, setViewSales] = useState(false);

  function closeViewSales() {
    setViewSales(!viewSales);
  };

  const [graphData, setGraphData] = useState(chartAnnualProfits.data);
  const [graphOptions, setGraphOptions] = useState(chartAnnualProfits.options);

  useEffect(()=> {
    if(viewSales){
      setGraphData(chartAnnualSales.data);
      setGraphOptions(chartAnnualSales.options);
    }
    else
    {
      setGraphData(chartAnnualProfits.data);
      setGraphOptions(chartAnnualProfits.options);
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
                        <h1 className=" mb-0">Annual Goals and Statistics</h1>
                      </CardHeader>
                      <CardBody>
                        <Button
                            className="mt-4"
                            color="default"
                            onClick={() => {
                              closeViewSales();
                            }}
                        >
                          Toggle Graph
                        </Button>
                              <div className="chart">
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
                        <h1 className=" mb-0">Monthly Planning</h1>
                        <p>Expected Sales  "Entered"</p>
                        <p>Expected Procurement Costs  "Entered"</p>
                        <p>Expected operating costs "Entered"</p>
                        <p>Calculated profits "Calculated"</p>
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
