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
import Tooltip from "@material-ui/core/Tooltip";



const Finance = () => {
  const colors = {
    gray: {
      100: '#f6f9fc',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#8898aa',
      700: '#525f7f',
      800: '#32325d',
      900: '#212529',
    },
    theme: {
      default: '#172b4d',
      primary: '#5e72e4',
      secondary: '#f4f5f7',
      info: '#11cdef',
      success: '#2dce89',
      danger: '#f5365c',
      warning: '#fb6340',
    },
    black: '#12263F',
    white: '#FFFFFF',
    transparent: 'transparent',
  };
  const [update,setUpdate] = useState(false);
  const [updateData,setUpdateData] = useState(false);
  const [finished, setFinished] = useState(false);
  const userToken = JSON.parse(localStorage.getItem('user'));
  const operationCostPerMinute = 0.05;
  const priceOfBicycle = 500;
  const [displayYear,setDisplayYear] = useState(2021);
  const [displayMonth,setDisplayMonth] = useState(3);
  const [planFormData, setPlanFormData] = useState({
    year:0,
    month:'',
    location: '',
    item: '',
    quantity: 0,
    salesGoal: 0
  });
  const [display,setDisplay] = useState({
    year: 2021,
    month: 3
  })
  const [operationalMinutes,setOperationalMinutes] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyProcurements,setMonthlyProcurements] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlySales, setMonthlySales] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlySalesPlans, setMonthlySalesPlans] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyCosts, setMonthlyCosts] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyCostsPlan, setMonthlyCostsPlan] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyProfits, setMonthlyProfits] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ]);
  const [monthlyProfitsPlan, setMonthlyProfitsPlan] = useState([
    0,0,0,0,0,0,0,0,0,0,0,0
  ])
  
  const [prodPlans,setProdPlans] = useState({});
  const [salesPlans,setSalesPlans] = useState({});
  const [prodActual,setProdActual] = useState({});
  const [salesActual,setSalesActual] = useState([]);
  const [procurement,setProcurement] = useState([]);
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
  const onChangeDisplay = (e) => {
    setDisplay({
      ...display,
      [e.target.name]:e.target.value,
    })
  }
  useEffect(() => {
    var proc;
    var saleA;
    var prodP;
    var prodA;
    var salesP;

    const lookup1 = async() => {
      await axios
      .get('/api/procurement', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then((response) => {
        if (response.data) {
           proc = response.data;
          setProcurement(response.data);
        }
      })
      .catch((error) => {
       console.log("errorrrr");
        console.error(error);
      });
      await axios
      .get('/api/sales', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then((response) => {
        if (response.data) {
           saleA = response.data;
          setSalesActual(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      await axios
      .get('/api/planning/prod', {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => {
         prodP = response.data;
        setProdPlans(response.data)}).catch((error)=>{
          console.error(error);
        });
        
        await axios
      .get('/api/planning/sales', {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => {
         salesP = response.data;
        setSalesPlans(response.data)}).catch((error)=>{
          console.error(error);
        }); 
        
        await axios
      .get('/api/planning/prodActual', {
        headers: {
          'x-auth-token': userToken,
        },
      }).then((response) => {
         prodA= response.data;
        setProdActual(response.data)}).catch((error)=>{
          console.error(error);
        });
        console.log(prodA);
       
        var operMin = getOperationLog(prodA);
        console.log(proc);
        var procLog = getProcurementLog(proc);
        console.log(operMin);
        console.log(procLog);
        var monthC = getMonthlyCosts(operMin,procLog);
        console.log(prodP);
        var monthCP = getMonthlyCostsPlan(prodP);
        console.log(salesP);
        var monthSP = getMonthlySalesPlan(salesP)
        console.log(saleA);
        var salesLog = getSalesLog(saleA);
         getMonthlyProfitsPlan(monthSP,monthCP);
         getMonthlyProfits(salesLog,monthC);

        
        
    };
    
    const lookup = async() => {
      await axios
      .get('/api/procurement', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then((response) => {
        if (response.data) {
          setProcurement(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
      await axios
      .get('/api/sales', {
        headers: {
          'x-auth-token': userToken,
        },
      })
      .then((response) => {
        if (response.data) {
          setSalesActual(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
        
    };
    
    lookup1(); 
    
    

    },[updateData,displayYear]);

    const getOperationLog = (prodActual) => {
    
      var i;
     var displayYear1 = 2021;
    
     
      const updatedOperationalMinutes = [0,0,0,0,0,0,0,0,0,0,0,0];
      if(prodActual[displayYear]==undefined){
      
      return updatedOperationalMinutes;
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
     
     setOperationalMinutes(updatedOperationalMinutes);
     return updatedOperationalMinutes;
   
    };

    const getProcurementLog = (procurement) => {
      var updatedProcurements = [];
      var procurementsInYear = [];
      procurement.forEach( p => {
        
        
        if(new Date(p.date).getFullYear() == displayYear)
        {
       
          procurementsInYear.push(p);
        }
      });
      for( var i = 0 ;i<12;i++){
        var monthSum = 0;
       procurementsInYear.forEach( p => {
       
       if(new Date(p.date).getMonth() == i)
       {
         
         monthSum += p.value;
        
       }
     });
     updatedProcurements[i] = monthSum;
   }
     setMonthlyProcurements(updatedProcurements);
     return updatedProcurements;
    };
 
      const getMonthlyCosts = (operationalMinutes,monthlyProcurements) => {
    
  
    
         
        
         var updatedMonthlyCosts = [];
         for(var i = 0; i<12 ; i++){
          var c = (operationalMinutes[i] * operationCostPerMinute) + monthlyProcurements[i];
          updatedMonthlyCosts.push(c);
         }
         setMonthlyCosts(updatedMonthlyCosts);
         return updatedMonthlyCosts;
       };
      
  
      
      
    
      const getMonthlyCostsPlan = (prodPlans) => {
        var i;
       var displayYear1 = 2021;
        const updatedMonthlyCostsPlan = [0,0,0,0,0,0,0,0,0,0,0,0];
        if(prodPlans[displayYear]==undefined){
        
        return updatedMonthlyCostsPlan;
        }
       
       for(i = 0;i<12;i++){
         var monthSum = 0;
         if(prodPlans[displayYear][monthNames[i]] == undefined)
         continue;
         for(let plantName in prodPlans[displayYear][monthNames[i]]){
           var plantSum = 0;
           var plant = prodPlans[displayYear][monthNames[i]][plantName];
           for(let itemName in plant ){
             plantSum += plant[itemName];
             
           }
           monthSum += plantSum;
         }
         updatedMonthlyCostsPlan[i] = monthSum*45*operationCostPerMinute+monthSum*100;
        
       }
       
       setMonthlyCostsPlan(updatedMonthlyCostsPlan);
       return updatedMonthlyCostsPlan;
     
    
      };
    
    


      const getMonthlySalesPlan = (salesPlans) => {
        
        var i;
       var displayYear1 = 2021;
        const updatedSalesPlan =[0,0,0,0,0,0,0,0,0,0,0,0];
        if(salesPlans[displayYear]==undefined){
        
        return updatedSalesPlan;
        }
       
       for(i = 0;i<12;i++){
         
         if(salesPlans[displayYear][monthNames[i]] == undefined)
         continue;
        
           updatedSalesPlan[i] = salesPlans[displayYear][monthNames[i]];
         
        
       }
      
       setMonthlySalesPlans(updatedSalesPlan);
       return updatedSalesPlan;
     
      };
 
     
      const getSalesLog = (salesActual) => {
        var salesInYear = [];
        var updatedSales = [];
        salesActual.forEach( p => {
          
          
          if(new Date(p.date).getFullYear() == displayYear)
          {
            
            salesInYear.push(p);
          }
        });
        for( var i = 0 ;i<12;i++){
          var monthSum = 0;
         salesInYear.forEach( p => {
         
         if(new Date(p.date).getMonth() == i)
         {
           
           monthSum += p.value;
          
         }
       });
       updatedSales[i] = monthSum;
     }
       setMonthlySales(updatedSales);
       return updatedSales;
       
      };
     

    
      const getMonthlyProfitsPlan = (monthlySalesPlans,monthlyCostsPlan) =>{
       
        var updatedMonthlyProfitsPlan = [];
        for ( var i = 0; i < 12 ; i++){
          var p = monthlySalesPlans[i] - monthlyCostsPlan[i];
          updatedMonthlyProfitsPlan.push(p);
        }
        setMonthlyProfitsPlan(updatedMonthlyProfitsPlan);
      }
    
    
      const getMonthlyProfits = (monthlySales,monthlyCosts) =>{
        var updatedMonthlyProfits = [];
        for ( var i = 0; i < 12 ; i++){
          var p = monthlySales[i] - monthlyCosts[i];
          updatedMonthlyProfits.push(p);
        }
        setMonthlyProfits(updatedMonthlyProfits);
      }
    

   

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

    return reply.data
  };

  const addNewPlan = async () => {
    
    const{year, month, location, item, quantity, salesGoal} = planFormData;
    if(year==0||
      month==''||
      location == ''||
      item == ''||
      quantity == 0 ||
      salesGoal == 0 
      )
      {
        window.alert("invalid input");
        return;
      }
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
    prodPlans[year][month][location][item]= parseInt(quantity);
   
    salesPlans[year][month] = parseInt(salesGoal)*priceOfBicycle;
    
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
    setUpdateData(!updateData);
    setPlanFormData({
      year:0,
      month:'',
      location: '',
      item: '',
      quantity: 0,
      salesGoal: 0
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
      setGraphData({
        labels: monthNames,
        datasets : [
          {
            label:'Expected Sales',
            data:monthlySalesPlans,
            backgroundColor:'#11cdef'
           
          },
          {
            label:'Actual Sales',
            data:monthlySales,
          },
        ],
    
      });
      setGraphOptions(chartAnnualSales.options);
      setGraphTitle("Annual Sales");
    }
    else
    {
      setGraphData({
        labels: monthNames,
        datasets : [
          {
            label:'Expected Profits',
            data:monthlyProfitsPlan,
            backgroundColor:'#11cdef'
           
          },
          {
            label:'Realized Profits',
            data:monthlyProfits,
          },
        ],
    
      });
      setGraphOptions(chartAnnualProfits.options);
      setGraphTitle("Annual Profits");
    }
    console.log("hello00");
  },
  [viewSales,monthlySalesPlans,monthlyProfitsPlan,monthlySales,monthlyProfits,displayYear]
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
                  <h3 className="text-white mb-2">Welcome to Finance!</h3>
                </CardHeader>
                <Row className="mb-2 ml-2 mr-2 mt-2">
                  <Col className="">
                    <Card className="shadow">
                      <CardHeader className="bg-transparent text-center">
                        <h1 className=" mb-0">{graphTitle}</h1>
                      </CardHeader>
                      <CardBody>
                        <Form className="form" >
                          <FormGroup>
                            <InputGroup>
                              <div>
                                <Tooltip
                                    title="Enter the Year you want displayed"
                                    arrow
                                    placement="top-start"
                                    enterDelay={750}
                                >
                                  <Input
                                      placeholder='Year'
                                      type='number'
                                      min={1000}
                                      max={9999}
                                      name = {'year'}
                                      defaultValue={displayYear}
                                      onChange = {(e) => onChangeDisplay(e)}


                                  />
                                </Tooltip>
                              </div>
                            </InputGroup>
                          </FormGroup>
                        </Form>
                        <Tooltip
                            title="Click to Toggle between Sales and Profits Graphs"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                        >
                          <Button
                              className="mt-2 mb-3"
                              color="default"
                              onClick={() => {
                                closeViewSales();
                              }}
                          >
                            Toggle Graph
                          </Button>
                        </Tooltip>
                        <Tooltip
                            title="Click here to update the year to the selected year"
                            arrow
                            placement="top-start"
                            enterDelay={750}
                        >
                          <Button
                              className="mt-2 mb-3"
                              color="default"
                              onClick={() => {
                               setDisplayYear(display.year);
                              }}
                          >
                            Update Year
                          </Button>
                        </Tooltip>
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
                              <Tooltip
                                  title="Enter the Year you want to plan"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="number"
                                    name="year"
                                    required
                                    min={1000}
                                    max={9999}
                                    defaultValue = {0}

                                    onChange = {(e) => onChangeForm(e)}
                                >
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Month</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Tooltip
                                  title="Enter the Month you want to plan"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="select"
                                    name="month"
                                    required
                                    onChange = {(e) => onChangeForm(e)}
                                > <option>Select a Month</option>
                                  {[...monthNames].map((m) => (
                                      <option>{m}</option>
                                  ))}
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Location</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Tooltip
                                  title="Enter the Plant you want to plan at"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="select"
                                    name="location"
                                    required
                                    onChange = {(e) => onChangeForm(e)}
                                > <option>Select a Location</option>
                                  {[...allLoc].map((m) => (
                                      <option key={m._id}>{m.location}</option>
                                  ))}
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Set Product</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Tooltip
                                  title="Enter the Product you want to plan with"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="select"
                                    name="item"
                                    required
                                    onChange = {(e) => onChangeForm(e)}
                                > <option>Select a Product</option>
                                  {[...allBikes].map((t) => (
                                      <option key={t._id}>{t.name}</option>
                                  ))}
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Set Amount</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Tooltip
                                  title="Set the amount of the products you wish to plan for"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="number"
                                    name="quantity"
                                    required
                                    onChange = {(e) => onChangeForm(e)}
                                >
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <FormGroup className="mb-3">
                            <label>
                              <span className="text-muted">Sales Goal</span>
                            </label>
                            <InputGroup className="input-group-alternative">
                              <Tooltip
                                  title="Enter the Sale goal for the selected products"
                                  arrow
                                  placement="top-start"
                                  enterDelay={750}
                              >
                                <Input
                                    type="number"
                                    name="salesGoal"
                                    required
                                    onChange = {(e) => onChangeForm(e)}
                                >
                                </Input>
                              </Tooltip>
                            </InputGroup>
                          </FormGroup>
                          <div className="text-center">
                            <Button color="primary" type = "submit"  onClick={addNewPlan}>
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
                        <h1 className=" mb-0">Monthly Breakdown for {monthNames[displayMonth]}</h1>
                      </CardHeader>
                      <CardBody className="text-center">
                        <h2 className="mb-4">Total Profits</h2>
                        <div className="chart mb-3">
                          <Bar data={{
                                      labels: ['Sales', 'Costs', 'Profits'],
                                      datasets: [
                                       {
                                        data: [monthlySales[displayMonth], monthlyCosts[displayMonth], monthlyProfits[displayMonth]],
                                        backgroundColor: [
                                        colors.theme.success,
                                        colors.theme.danger,
                                        colors.theme.info,
                                         ],
                                       },
                                               ],
                                     }}
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
                                      <h2 className="text-dark">{monthlySales[displayMonth]}</h2>
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
                                      <h2 className="text-dark">{Math.round(monthlySales[displayMonth]/500)}</h2>
                                    </div>
                                  </div>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                        <h2 className="mb-4">Costs</h2>
                        <div className="chart mb-3">
                          <Doughnut data={{
    labels: ['Operational Costs', 'Procurement Costs'],
    datasets: [{
      data: [operationalMinutes[displayMonth]*0.05,monthlyProcurements[displayMonth]],
      backgroundColor: [
        colors.theme.info,
        colors.theme.primary,
      ],
      hoverOffset: 4
    },],
  }}
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
