const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Location = require("../../../models/Location");

//Retrieve all locations
router.get("/", async(req, res) => {
    try{
        const location = await Location.find();
        res.json(location);
    } catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//add a new location
router.post("/add", async (req, res) => {
    const { location } = req.body;
    locations = new Location({
      location : location
    });
    await locations.save();
    res.json('added');
  });

  module.exports = router;