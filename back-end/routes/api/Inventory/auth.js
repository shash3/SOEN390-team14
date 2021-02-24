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

// add new material
router.post("/add", async (req, res) => {
  const { name, quantity, location } = req.body;
  inventory = new Inventory({
    name,
    quantity,
    location
  });
  await inventory.save();
});

module.exports = router;
