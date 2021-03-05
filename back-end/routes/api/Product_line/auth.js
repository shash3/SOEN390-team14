const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Product_line = require("../../../models/Product_line");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Retrieve all product lines
router.get("/", auth, async (req, res) => {
  try {
    const product = await Product_line.find();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific product lines by name
router.post("/", auth, async (req, res) => {
    const { name } = req.body;
 
    try {
      const product = await Product_line.find({ name })
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

// add new product line
router.post("/add", async (req, res) => {
  const { name, material } = req.body;
  product = new Product_line({
    name,
    material
  });
  await product.save();
});

module.exports = router;
