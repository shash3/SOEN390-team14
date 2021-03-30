const express = require("express");

const router = express.Router();
const Quality = require("../../../models/Quality");
const auth = require("../../../middleware/auth");

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

// Retrieve specific quality data by location
router.post("/location", auth, async (req, res) => {
  const { location } = req.body;
  try {
    const quality = await Quality.find({ location })
    res.json(quality);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// add quality data
router.post("/add", async (req, res) => {
  const { name, type, location } = req.body;
  const quality = new Quality({
    name,
    type,
    location,
    quality:"None",
  });
  await quality.save();
  res.json("added");
});

// delete 
router.post("/delete", auth, async (req, res) => {
  const { _id } = req.body;
  try {
    await Quality.deleteOne({ _id });
    const quality = await Quality.find();
    res.json(quality);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
