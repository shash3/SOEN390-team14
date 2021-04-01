const express = require('express')

const router = express.Router()
const Sales = require('../../../models/Sales')
const auth = require('../../../middleware/auth')

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
  await Sales.deleteOne({ _id })
  res.send(true)
})

router.post('/setPaid', auth, async (req, res) => {
  const { _id } = req.body
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
  await sales.save()
  res.send(true)
})

module.exports = router
