const express = require("express");

const router = express.Router();
const Procurement = require("../../../models/Procurement");
const Sales = require("../../../models/Sales");
const auth = require("../../../middleware/auth");
const fs = require('fs');

const prodPlanFile = './logs/plannedProduction.json';
const salesPlanFile = './logs/plannedSales.json';
const prodActualFile = '/logs/machineOperations.json';
const salesActualFile = './logs/salesLog.json';



router.get("/prod", auth, async (req,res) =>{
try{
    fs.readFile(prodPlanFile, 'utf8', (err, data) => {
        if (data === undefined) {
          data = '{}';
        }
        res.send(JSON.parse(data));       
      });
}
catch (err) {
     
        console.error(err.message);
        res.status(500).send("Server Error");
}
})
router.get("/sales", auth, async (req,res) =>{
    try{
        fs.readFile(salesPlanFile, 'utf8', (err, data) => {
            if (data === undefined) {
              data = '{}';
            }
            res.send(JSON.parse(data));       
          });
    }
    catch (err) {
         
            console.error(err.message);
            res.status(500).send("Server Error");
    }
})
router.get("/prodActual", auth, async (req,res) =>{
    try{
        fs.readFile(salesActualFile, 'utf8', (err, data) => {
            if (data === undefined) {
              data = '{}';
            }
            res.send(JSON.parse(data));       
          });
    }
    catch (err) {
         
            console.error(err.message);
            res.status(500).send("Server Error");
    }
})    
router.get("/salesActual", auth, async (req,res) =>{
    try{
        fs.readFile(salesActualFile, 'utf8', (err, data) => {
            if (data === undefined) {
              data = '{}';
            }
            res.send(JSON.parse(data));       
          });
    }
    catch (err) {
         
            console.error(err.message);
            res.status(500).send("Server Error");
    }
})    
router.post("/addPlanProd", auth, async (req,res) => {
   
        const { data } = req.body;
        const dataStr = JSON.stringify(data, null, 2);
        try {
          fs.writeFile(prodPlanFile, dataStr, 'utf8', () => {});
          res.send(true);
        } catch (err) {
          console.error(err.message);
          res.status(500).send("Server Error");
        }
  
});  

router.post("/addPlanSales", auth, async (req,res) => {
   
    const { data } = req.body;
    const dataStr = JSON.stringify(data, null, 2);
    try {
      fs.writeFile(salesPlanFile, dataStr, 'utf8', () => {});
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }

});  
        

module.exports = router;