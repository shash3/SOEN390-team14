const express = require("express");

const router = express.Router();
const Material = require("../../../models/Material");
const auth = require("../../../middleware/auth");

// Retrieve all materials
router.get("/", auth, async (req, res) => {
  try {
    const material = await Material.find();
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Retrieve specific materials by name
router.post("/", auth, async (req, res) => {
  const { name } = req.body;
  try {
    const material = await Material.find({ name })
    res.json(material);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// add new material
router.post("/add", async (req, res) => {
  const { name, type } = req.body;
  const material = new Material({
    name,
    type,
  });
  await material.save();
  res.json("added");
});

module.exports = router;
