const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Transportation = require("../../../models/Transportation");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//Change Status



// Retrieve all shipments
router.get("/", auth, async (req, res) => {
  try {
    const transportation = await Transportation.find();
    console.log(transportation);
    res.json(transportation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific shipments by name
router.post("/", auth, async (req, res) => {
    const { name } = req.body;
    try {
      const transportation = await Transportation.find({ name })
      res.json(transportation);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// add new shipments
router.post("/add", auth, async (req, res) => {
  const {name, quantity, location, destination, status } = req.body;
  
  transportation = new Transportation({
    name,
    quantity,
    location,
    destination,
    status,
    packagingStatus: false
  });
  
  await transportation.save();
  res.send(true);
});
router.post("/delete",auth,async (req,res) =>{
  
const {_id}= req.body;


await Transportation.deleteOne({_id:_id});
res.send(true);
});

router.post("/changeStatus", auth, async (req,res)=>{
  const{
    _id,
    status
  } = req.body;
  console.log(_id);
  console.log(status);
 
 await Transportation.updateOne({_id:_id},{$set:{status:status}});
 res.send(true);

});
router.post("/sendShipment", auth, async (req,res)=>{
  const{
    _id,
    status
  } = req.body;
  console.log(_id);
  console.log(status);
 
 await Transportation.updateOne({_id:_id},{$set:{status:status}});
 res.send(true);

});

module.exports = router;
