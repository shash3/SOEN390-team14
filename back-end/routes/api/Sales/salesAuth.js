const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Sales = require("../../../models/Sales");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");


router.get("/", auth, async(req,res) => {
    try {
        const sales = await Sales.find();
        res.json(sales);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
})

router.post("/add", auth, async (req, res) => {
    const {name, quantity, purchaser, location, value, date } = req.body;

    console.log("hello");
    sales = new Sales({
     name,
     quantity,
     purchaser,
     location,
     value,
     date
    });
    
    await sales.save();
    res.send(true);
  });

  module.exports = router;