const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Material = require("../../../models/Material");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all materials
router.get("/", auth, async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific materials by name
router.post("/", auth, async (req, res) => {
    const { name } = req.body;
 
    try {
      const materials = await Material.find({ name })
      res.json(materials);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// add new material
router.post("/add", auth, async (req, res) => {
  const { name, quantity, location, quality, color } = req.body;
  material = new Material({
    name,
    quantity,
    location,
    quality,
    color,
  });
  await material.save();
});

module.exports = router;
