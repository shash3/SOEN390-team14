/* eslint-disable no-underscore-dangle */
const express = require('express')

const router = express.Router()
const ProductLine = require('../../../models/Product_line')
const auth = require('../../../middleware/auth')
const User = require('../../../models/User')
const writeToFile = require('../../../variables/logWriter')

// Retrieve all product lines
router.get('/', auth, async (req, res) => {
  try {
    const product = await ProductLine.find()
    res.json(product)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific product lines by name
router.post('/', auth, async (req, res) => {
  const { name } = req.body

  try {
    const product = await ProductLine.find({ name })
    res.json(product)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific product lines by type
router.post('/type', auth, async (req, res) => {
  const { type } = req.body
  try {
    const product = await ProductLine.find({ type })
    res.json(product)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// add new product line
router.post('/add', auth, async (req, res) => {
  const { name, type, material } = req.body
  const product = new ProductLine({
    name,
    type,
    material,
  })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `created new product called ${name} and type ${type} which require ${material}`
  writeToFile(date, action, user._id)
  await product.save()
  res.json('added')
})

module.exports = router
