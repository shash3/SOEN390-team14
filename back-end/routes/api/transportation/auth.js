const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Transportation = require("../../../models/Transportation");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all materials
router.get("/", auth, async (req, res) => {
  try {
    const transportation = await Transportation.find();
    res.json(transportation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific materials by name
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

// add new material
router.post("/add", auth, async (req, res) => {
  const { name, quantity, location, destination, status } = req.body;
  material = new Material({
    name,
    quantity,
    location,
    destination,
    status,
  });
  await transportation.save();
});

module.exports = router;
