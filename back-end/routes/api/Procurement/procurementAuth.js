const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Procurement = require("../../../models/Procurement");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");


router.get("/", auth, async(req,res) => {
    try {
        const procurement = await Procurement.find();
        res.json(procurement);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
})

router.post("/delete",auth,async (req,res) =>{
  
    const {_id}= req.body;
    
    
    await Procurement.deleteOne({_id:_id});
    res.send(true);
    });

router.post("/add", auth, async (req, res) => {
    const {name, quantity, supplier, destination, value, date } = req.body;

    console.log("hello");
    procurement = new Procurement({
     name,
     quantity,
     supplier,
     destination,
     value,
     date
    });
    
    await procurement.save();
    res.send(true);
  });

  module.exports = router;