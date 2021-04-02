const express = require("express");

const router = express.Router();
const Procurement = require("../../../models/Procurement");
const Sales = require("../../../models/Sales");
const auth = require("../../../middleware/auth");
const fs = require('fs');

const prodPlanFile = './logs/plannedProduction.json';
const salesPlanFile = './logs/plannedSales.json';



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

module.exports = router;