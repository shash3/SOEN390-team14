const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Inventory = require("../../../models/Inventory");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all inventory
router.get("/", auth, async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific inventory by name
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  try {
    const inventory = await Inventory.find({ name })
    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific inventory by name and location
router.post("/location", auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    const inventory = await Inventory.find({ name, location })
    res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// add new inventory
router.post("/add", async (req, res) => {
  const { name, quantity, location } = req.body;
  inventory = new Inventory({
    name,
    quantity,
    location
  });
  await inventory.save();
});

//remove a certain quantity from inventory 
router.put("/remove", async (req,res) => {
  const {name, quantity, location} = req.body;
  try{
    const inventory = await Inventory.find({name: name , location: location}).updateOne({quantity,quantity});
    res.json("changed");
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/superUpdate", async (req, res) => {
  const {name, quantity, location} = req.body;
  
  try{
    const inv = await Inventory.find({name: name , location: location});
    if (inv.length == 0){
      inventory = new Inventory({
        name,
        quantity,
        location
      });
      await inventory.save();
    }else{
      await Inventory.find({name: name , location: location}).updateOne({quantity,quantity});
    }
      res.json("changed");
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
