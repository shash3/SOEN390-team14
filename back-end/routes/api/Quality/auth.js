const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Quality = require("../../../models/Quality");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all quality data
router.get("/", auth, async (req, res) => {
  try {
    const quality = await Quality.find();
    res.json(quality);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific quality data by name
router.post("/", auth, async (req, res) => {
    const { name } = req.body;
 
    try {
      const quality = await Quality.find({ name })
      res.json(quality);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// Retrieve specific quality data by name and location
router.post("/location", auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    const quality = await Quality.find({ name, location })
    res.json(quality);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// add quality data
router.post("/add", async (req, res) => {
  const { name, type, location } = req.body;
  quality = new Quality({
    name:name,
    type: type,
    location:location,
    quality:"None",
  });
  await quality.save();
  res.json();
});

module.exports = router;
