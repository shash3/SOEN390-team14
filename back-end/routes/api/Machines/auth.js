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

// Retrieve specific machine by key
router.post("/", auth, async (req, res) => {
  const { _id } = req.body;

  try {
    const product = await Machine.find({ _id });
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve all machines in a location
router.post("/location", auth, async (req, res) => {
  const { location } = req.body;
  try {
    const machine = await Machine.find({location});
    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve in use machines in a location
router.post("/unavailable", auth, async (req, res) => {
  const { location} = req.body;
  try {
    const machine = await Machine.find({location:location, item:{$regex:"."}});
    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve available machines in a location
router.post("/available", auth, async (req, res) => {
  const { location } = req.body;
  try {
    const machine = await Machine.find({location:location, item:""});
    res.json(machine);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add a new machine
router.post("/add", async (req, res) => {
  const { location } = req.body;
  machine = new Machine({
    location: location,
    item:"",
    type:""
  });
  await machine.save();
  res.json('saved');
});

// Delete a machine
router.post("/delete", async (req,res) => {
  const {_id} = req.body;
  try{
    await Machine.deleteOne({_id:_id});
    res.json('deleted');
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// Add item to machine
router.put("/add", async (req, res) => {
  const { _id, item, type, finish_time } = req.body;
  try{
    const machine = await Machine.find({_id: _id}).updateOne({item:item, type:type, finish_time:finish_time});
    res.json('updated');
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// Remove item from machine
router.put("/remove", async (req, res) => {
  const { _id } = req.body;
  try{
    const machine = await Machine.find({_id: _id}).updateOne({item:"",type:""});
    res.json('updated');
  } catch(err){
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
