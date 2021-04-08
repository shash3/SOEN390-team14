const express = require('express')

const router = express.Router()
const Procurement = require('../../../models/Procurement')
const auth = require('../../../middleware/auth')
const writeToFile = require('../../../variables/logWriter')
const User = require('../../../models/User')

router.get('/', auth, async (req, res) => {
  try {
    console.log('hello')
    const procurement = await Procurement.find()
    res.json(procurement)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.post('/delete', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `delete procurement by id ${_id}`
  writeToFile(date, action, user._id)
  await Procurement.deleteOne({ _id })
  res.send(true)
})

router.post('/add', auth, async (req, res) => {
  const { name, quantity, supplier, destination, value, date } = req.body
  const procurement = new Procurement({
    name,
    quantity,
    supplier,
    destination,
    value,
    date,
    paid: false,
  })
  const today = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a procurement of item ${name}, quantity ${quantity} from ${supplier} to ${destination} of value ${value}`
  writeToFile(today, action, user._id)
  await procurement.save()
  res.send(true)
})

router.get('/payables', auth, async (req, res) => {
  try {
    const payables = await Procurement.find({ paid: false })
    res.json(payables)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.get('/payablesP', auth, async (req, res) => {
  try {
    const payablesP = await Procurement.find({ paid: true })
    res.json(payablesP)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.post('/setPaid', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `set paid status of invoice ${_id} to true`
  writeToFile(date, action, user._id)
  await Procurement.updateOne({ _id }, { $set: { paid: true } })
  res.send(true)
})

module.exports = router
