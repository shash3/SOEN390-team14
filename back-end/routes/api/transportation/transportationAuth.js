const express = require('express')

const router = express.Router()
const Transportation = require('../../../models/Transportation')
const User = require('../../../models/User')
const auth = require('../../../middleware/auth')
const writeToFile = require('../../../variables/logWriter')

// Retrieve all shipments
router.get('/', auth, async (req, res) => {
  try {
    const transportation = await Transportation.find({
      packagingStatus: true,
      status: { $ne: 'Completed' },
    })
    res.json(transportation)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.get('/completed', auth, async (req, res) => {
  try {
    const completed = await Transportation.find({ status: 'Completed' })
    res.json(completed)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.get('/packaging', auth, async (req, res) => {
  try {
    const packaging = await Transportation.find({ packagingStatus: false })
    res.json(packaging)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific shipments by name
router.post('/', auth, async (req, res) => {
  const { name } = req.body
  try {
    const transportation = await Transportation.find({ name })
    res.json(transportation)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// add new shipments
router.post('/add', auth, async (req, res) => {
  const { name, quantity, type, location, destination, status } = req.body
  const transportation = new Transportation({
    name,
    quantity,
    type,
    location,
    destination,
    status,
    packagingStatus: false,
  })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a new shipment of ${name}, amount: ${quantity} from ${location} to ${destination}`
  writeToFile(date, action, user._id)
  await transportation.save()
  res.send(true)
})

router.post('/addP', auth, async (req, res) => {
  const {
    name,
    quantity,
    type,
    location,
    destination,
    status,
    packagingStatus,
  } = req.body
  const transportation = new Transportation({
    name,
    quantity,
    type,
    location,
    destination,
    status,
    packagingStatus,
  })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a packaging status: ${packagingStatus}`
  writeToFile(date, action, user._id)
  await transportation.save()
  res.send(true)
})

router.post('/delete', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `deleted by id: ${_id}`
  writeToFile(date, action, user._id)
  await Transportation.deleteOne({ _id })
  res.send(true)
})

router.post('/changeStatus', auth, async (req, res) => {
  const { _id, status } = req.body
  await Transportation.updateOne({ _id }, { $set: { status } })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `changed status of ${_id} to ${status}`
  writeToFile(date, action, user._id)
  res.send(true)
})

router.post('/sendShipment', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `changed packaging status of ${_id} to true`
  writeToFile(date, action, user._id)
  await Transportation.updateOne({ _id }, { $set: { packagingStatus: true } })
  res.send(true)
})

module.exports = router
