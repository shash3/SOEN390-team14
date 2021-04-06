const express = require('express')

const router = express.Router()
const Location = require('../../../models/Location')
const writeToFile = require('../../../variables/logWriter')
const User = require('../../../models/User')

// Retrieve all locations
router.get('/', async (req, res) => {
  try {
    const location = await Location.find()
    res.json(location)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// add a new location
router.post('/add', async (req, res) => {
  const { location } = req.body
  const locations = new Location({
    location,
  })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a new location ${location}`
  writeToFile(date, action, user._id)
  await locations.save()
  res.json('added')
})

module.exports = router
