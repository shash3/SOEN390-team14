const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Machine = require("../../../models/machine");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all machines
router.get("/", auth, async (req, res) => {
  try {
    const machine = await Machine.find();
    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve all machines in a location
router.get("/location", auth, async (req, res) => {
  const { location } = req.body;
  try {
    const machine = await Machine.find({location});
    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific machine by key
router.post("/", auth, async (req, res) => {
  const { _id } = req.body;

  try {
    const product = await Machine.find({ _id })
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// add new machine
router.post("/add", async (req, res) => {
  const { location } = req.body;
  machine = new Machine({
    location: location,
    item:""
  });
  await machine.save();
  res.json();
});

//remove a machine
router.delete("/", async (req,res) => {
  const {_id} = req.body;
  try{
    await Inventory.deleteOne({_id})
    res.json("deleted");
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// add item to machine
router.put("/add", async (req, res) => {
  const { _id, item, date } = req.body;
  try{
    const inventory = await Inventory.find({_id: _id}).updateOne({item, date});
    res.json('updated');
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// remove item from machine
router.put("/remove", async (req, res) => {
  const { _id } = req.body;
  try{
    const inventory = await Inventory.find({_id: _id}).updateOne({item:""});
    res.json('updated');
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;
