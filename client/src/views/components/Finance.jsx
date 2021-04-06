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
import {Bar, Doughnut} from "react-chartjs-2";
import {
  chartOptions,
  parseOptions,
  chartAnnualProfits,
  chartAnnualSales,
  chartTotalCosts,
  chartTotalProfits,
} from '../../variables/charts';
import {Link} from "react-router-dom";



const Finance = () => {
  const userToken = JSON.parse(localStorage.getItem('user'));
  const [displayYear,setDisplayYear] = useState('');
  const [displayMonth,setDisplayMonth] = useState('');
  const [planFormData, setPlanFormData] = useState({
    year:0,
    month:'',
    location: '',
    item: '',
    quantity: 0,
    salesGoal: 0
  });
  const [operationalMinutes,setOperationalMinutes] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyProcurements,setMonthlyProcurements] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlySales, setMonthlySales] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [montlyCosts, setMonthlyCosts] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ])
  const [prodPlans,setProdPlans] = useState({});
  const [salesPlans,setSalesPlans] = useState({});
  const [prodActual,setProdActual] = useState({});
  const [salesActual,setSalesActual] = useState({});
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
  ];

  const onChangeForm = (e) => {
    setPlanFormData({
      ...planFormData,
      [e.target.name]: e.target.value,
    });
  };
  // Holds all Locations
  const [allLoc, setAllLoc] = useState([]);

  // Get all plant locations
  const getAllLoc = async () => {
    const response = await axios
        .get('/api/locations')
        .catch((err) => console.error('Error', err));
    if (response.data) {
      setAllLoc(response.data);
    }
  };

  // Get global variables for the charts
  if (Chart) {
    parseOptions(Chart, chartOptions());
  };

 const getOperationLog = () => {

   var i;
   console.log(prodActual);
   const updatedOperationalMinutes = operationalMinutes;
   if(prodActual[displayYear]==undefined){
   
   return;
   }
  
  for(i = 0;i<12;i++){
    var monthSum = 0;
    if(prodActual[displayYear][monthNames[i]] == undefined)
    continue;
    for(let plantName in prodActual[displayYear][monthNames[i]]){
      var plantSum = 0;
      var plant = prodActual[displayYear][monthNames[i]][plantName];
      for(let machineName in plant ){
        var machine = plant[machineName];
        plantSum += machine['minutesLogged'];
        
      }
      monthSum += plantSum;
    }
    updatedOperationalMinutes[i] = monthSum;
   
  }
  console.log(updatedOperationalMinutes);
  setOperationalMinutes(updatedOperationalMinutes);

 }

useEffect(() => {
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
      
      await axios
    .get('/api/planning/prodActual', {
      headers: {
        'x-auth-token': userToken,
      },
    }).then((response) => {
   
      setProdActual(response.data)}).catch((error)=>{
        console.error(error);
      });
      
      await axios
    .get('/api/planning/salesActual', {
      headers: {
        'x-auth-token': userToken,
      },
    }).then((response) => {
     
      setSalesActual(response.data)}).catch((error)=>{
        console.error(error);
      });
      
  };
  lookup(); 

  
  },[]);


  // use effect to get all bike types
  useEffect(async () =>
    {setAllBikes(await getAllBikes())} , []
  );

  // Holds all final bike types
  const[allBikes, setAllBikes] = useState([]);

  // Get all final bikes
  const getAllBikes = async () => {
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
            }
        )
        .catch((err) => console.error('Error', err))
    console.log(reply.data)
    return reply.data
  };

  const addNewPlan = async () => {
    console.log(planFormData);
    const{year, month, location, item, quantity, salesGoal} = planFormData;
    if(prodPlans[year]==undefined){
      prodPlans[year]={};
    }
    if(prodPlans[year][month]==undefined){
      prodPlans[year][month] = {};
    }
    if(prodPlans[year][month][location] == undefined){
      prodPlans[year][month][location] = {};
    }
    if(salesPlans[year]==undefined){
      salesPlans[year]={};
    }
    prodPlans[year][month][location][item]= quantity;
    salesPlans[year][month] = salesGoal;
    await axios
    .post("/api/planning/addPlanProd",{
      data:prodPlans,
    },{
      headers: {
        'x-auth-token': userToken,
      },
    });
    await axios
    .post("/api/planning/addPlanSales",{
      data:salesPlans,
    },{
      headers: {
        'x-auth-token': userToken,
      },
    });
  }

 

  // Change Between Tables
  const [viewSales, setViewSales] = useState(false);

  function closeViewSales() {
    setViewSales(!viewSales);
  };

  const [graphTitle, setGraphTitle] = useState("Annual Profits")
  const [graphData, setGraphData] = useState(chartAnnualProfits.data);
  const [graphOptions, setGraphOptions] = useState(chartAnnualProfits.options);

  useEffect(()=> {
    getAllLoc();
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
          <Button onClick = {getOperationLog}></Button>
          {/* Dark table */}
          <Row className="mt-5">
            <div className="col">
              <Card className="bg-default shadow">
                <CardHeader className="bg-transparent border-0">
                  <h3 className="text-white mb-2">Welcome to Finance!</h3>
                </CardHeader>
                <Row className="mb-2 ml-2 mr-2 mt-2">
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className=" mb-0">{graphTitle}</h1>
                      </CardHeader>
                      <CardBody>
                        <Form className="form">
                          <FormGroup>
                            <InputGroup>
                              <div>
                                <Input
                                    placeholder='Year'
                                    type='number'
                                    min={1000}
                                    max={9999}
                                    defaultValue={2021}
                                />
                              </div>
                            </InputGroup>
                          </FormGroup>
                          <Button color="default">
                            Update Year
                          </Button>
                        </Form>
                        <Button
                            className="mt-2 mb-3"
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
                      </CardHeader>
                      <CardBody>
                        <Form className="form">
                        <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Year</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="number"
                                  name="year"
                                  required
                                  min={1000}
                                  max={9999}
                                  defaultValue={2021}
                                  onChange = {(e) => onChangeForm(e)}
                              >
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Month</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="select"
                                  name="month"
                                  required
                                  onChange = {(e) => onChangeForm(e)}
                              >
                                {[...monthNames].map((m) => (
                                    <option>{m}</option>
                                ))}
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Location</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="select"
                                  name="location"
                                  required
                                  onChange = {(e) => onChangeForm(e)}
                              >
                                {[...allLoc].map((m) => (
                                    <option key={m._id}>{m.location}</option>
                                ))}
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Set Product</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="select"
                                  name="item"
                                  required
                                  onChange = {(e) => onChangeForm(e)}
                              >
                                {[...allBikes].map((t) => (
                                    <option key={t._id}>{t.name}</option>
                                ))}
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Set Amount</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="number"
                                  name="quantity"
                                  required
                                  onChange = {(e) => onChangeForm(e)}
                              >
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Sales Goal</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Input
                                  type="number"
                                  name="salesGoal"
                                  required
                                  onChange = {(e) => onChangeForm(e)}
                              >
                              </Input>
                            </InputGroup>
                          </FormGroup>
                          <div className="text-center">
                            <Button color="primary" onClick={addNewPlan}>
                              Update Monthly Goals
                            </Button>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className=" mb-0">Monthly Breakdown</h1>
                      </CardHeader>
                      <CardBody className="text-center">
                        <h2 className="mb-4">Total Profits</h2>
                        <div className="chart mb-3">
                          <Bar data={chartTotalProfits.data}
                               options={chartTotalProfits.options}
                          />
                        </div>
                        <h2 className="mb-4">Sales</h2>
                        <Row className="mb-5">
                          <Col>
                            <Card className="card-stats bg-light mb-4 mb-xl-0">
                              <CardBody>
                                <Row>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape bg-white rounded-circle shadow">
                                      <i className="fas fa-dollar-sign"></i>
                                    </div>
                                  </Col>
                                  <div className="col">
                                    <div className="row">
                                      <span className="h2 font-weight-bold mb-0">
                                        <h2 className="text-dark">Total $ Amount</h2>
                                      </span>
                                    </div>
                                    <div className="row">
                                      <h2 className="text-dark">100</h2>
                                    </div>
                                  </div>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col>
                            <Card className="card-stats mb-4 mb-xl-0 bg-light" >
                              <CardBody>
                                <Row>
                                  <Col className="col-auto">
                                    <div className="icon icon-shape bg-white rounded-circle shadow">
                                      <i className="fas fa-bicycle"></i>
                                    </div>
                                  </Col>
                                  <div className="col">
                                    <div className="row">
                                      <span className=" font-weight-bold mb-0">
                                        <h2 className="text-dark">Total # of Bikes</h2>
                                      </span>
                                    </div>
                                    <div className="row">
                                      <h2 className="text-dark">100</h2>
                                    </div>
                                  </div>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                        <h2 className="mb-4">Costs</h2>
                        <div className="chart mb-3">
                          <Doughnut data={chartTotalCosts.data}
                                    options={chartTotalCosts.options}
                          />
                        </div>
                      </CardBody>
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
