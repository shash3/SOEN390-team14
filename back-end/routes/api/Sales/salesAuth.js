const express = require('express')

const router = express.Router()
const Sales = require('../../../models/Sales')
const auth = require('../../../middleware/auth')
const writeToFile = require('../../../variables/logWriter')
const User = require('../../../models/User')

router.get('/', auth, async (req, res) => {
  try {
    const sales = await Sales.find()
    res.json(sales)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.get('/receivables', auth, async (req, res) => {
  try {
    const receivables = await Sales.find({ paid: false })
    res.json(receivables)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.get('/receivablesP', auth, async (req, res) => {
  try {
    const receivables = await Sales.find({ paid: true })
    res.json(receivables)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

router.post('/delete', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `deleted sale by id ${_id}`
  writeToFile(date, action, user._id)
  await Sales.deleteOne({ _id })
  res.send(true)
})

router.post('/setPaid', auth, async (req, res) => {
  const { _id } = req.body
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `set paid status of id ${_id} to true`
  writeToFile(date, action, user._id)
  await Sales.updateOne({ _id }, { $set: { paid: true } })
  res.send(true)
})

router.post('/add', auth, async (req, res) => {
  const { name, quantity, purchaser, location, value, date } = req.body
  const sales = new Sales({
    name,
    quantity,
    purchaser,
    location,
    value,
    date,
    paid: false,
  })
  const today = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a new sale of item ${name} and quantity: ${quantity} to ${purchaser} for a value of ${value}`
  writeToFile(today, action, user._id)
  await sales.save()
  res.send(true)
})

module.exports = router
