/* eslint-disable no-undef */
const express = require('express')

const router = express.Router()
const fs = require('fs')
const Machine = require('../../../models/Machine')
const auth = require('../../../middleware/auth')

// Retrieve all machines
router.get('/', auth, async (req, res) => {
  try {
    const machine = await Machine.find()
    res.json(machine)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific machine by key
router.post('/', auth, async (req, res) => {
  const { _id } = req.body
  try {
    const product = await Machine.find({ _id })
    res.json(product)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve all machines in a location
router.post('/location', auth, async (req, res) => {
  const { location } = req.body
  try {
    const machine = await Machine.find({ location })
    res.json(machine)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve in use machines in a location
router.post('/unavailable', auth, async (req, res) => {
  const { location } = req.body
  try {
    const machine = await Machine.find({ location, item: { $regex: '.' } })
    res.json(machine)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve available machines in a location
router.post('/available', auth, async (req, res) => {
  const { location } = req.body
  try {
    const machine = await Machine.find({ location, item: '' })
    res.json(machine)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Add a new machine
router.post('/add', async (req, res) => {
  const { location } = req.body
  const machine = new Machine({
    location,
    item: '',
    type: '',
  })
  await machine.save()
  res.json('saved')
})

// Delete a machine
router.post('/delete', async (req, res) => {
  const { _id } = req.body
  try {
    await Machine.deleteOne({ _id })
    res.json('deleted')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

// Add item to machine
router.put('/add', async (req, res) => {
  const { _id, item, type, finishTime } = req.body
  try {
    machine = await Machine.find({ _id }).updateOne({
      item,
      type,
      finish_time: finishTime,
    })
    res.json('updated')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Remove item from machine
router.put('/remove', async (req, res) => {
  const { _id } = req.body
  try {
    machine = await Machine.find({ _id }).updateOne({ item: '', type: '' })
    res.json('updated')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

const machineTrackFile = './logs/machineOperations.json'
// Get the log file for machine
router.get('/json', auth, async (req, res) => {
  try {
    fs.readFile(machineTrackFile, 'utf8', (err, data) => {
      let jsonData = data
      if (jsonData === undefined) {
        jsonData = '{}'
      }
      res.send(JSON.parse(jsonData))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Write the log file for machine
router.post('/json', auth, (req, res) => {
  const { data } = req.body
  const dataStr = JSON.stringify(data, null, 2)
  try {
    fs.writeFile(machineTrackFile, dataStr, 'utf8', () => {})
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
