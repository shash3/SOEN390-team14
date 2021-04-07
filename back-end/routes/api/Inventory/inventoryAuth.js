const express = require('express')

const router = express.Router()
const Inventory = require('../../../models/Inventory')
const auth = require('../../../middleware/auth')
const writeToFile = require('../../../variables/logWriter')
const User = require('../../../models/User')

// Retrieve all inventory
router.get('/', auth, async (req, res) => {
  try {
    const inventory = await Inventory.find()
    res.json(inventory)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific inventory by name
router.post('/', auth, async (req, res) => {
  const { name } = req.body
  try {
    const inventory = await Inventory.find({ name })
    res.json(inventory)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve specific inventory by name and location
router.post('/location', auth, async (req, res) => {
  const { name, location } = req.body
  try {
    const inventory = await Inventory.find({ name, location })
    res.json(inventory)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Add new inventory
router.post('/add', auth, async (req, res) => {
  const { name, quantity, location, type } = req.body
  const inventory = new Inventory({
    name,
    type,
    quantity,
    location,
  })
  const date = new Date().toUTCString()
  const user = await User.findById(req.user.id).select('-password')
  const action = `added a new shipment of ${name}, quantity ${quantity}`
  writeToFile(date, action, user._id)
  await inventory.save()
  res.json('added')
})

// Remove a certain quantity from inventory
router.put('/remove', auth, async (req, res) => {
  const { name, quantity, location } = req.body
  try {
    const date = new Date().toUTCString()
    const user = await User.findById(req.user.id).select('-password')
    const action = `removed ${quantity} of ${name} in inventory with location ${location}`
    writeToFile(date, action, user._id)
    await Inventory.find({ name, location }).updateOne({ quantity })
    res.json('removed')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

// Decrease a product by a certain quantity from inventory
router.put('/decrement', auth, async (req, res) => {
  const { name, quantity, location } = req.body
  try {
    const inventory = await Inventory.find({ name, location })
    const newQuantity = inventory[0].quantity - quantity
    await Inventory.find({ name, location }).updateOne({
      quantity: newQuantity,
    })
    const date = new Date().toUTCString()
    const user = await User.findById(req.user.id).select('-password')
    const action = `removed ${quantity} of ${name} in inventory with location ${location}`
    writeToFile(date, action, user._id)
    res.json('decreased')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

router.put('/superUpdate', auth, async (req, res) => {
  const { name, type, quantity, location } = req.body

  try {
    const inv = await Inventory.find({ name, location })
    if (inv.length === 0) {
      const inventory = new Inventory({
        name,
        type,
        quantity,
        location,
      })
      await inventory.save()
    } else {
      await Inventory.find({ name, location }).updateOne({ quantity })
    }
    const date = new Date().toUTCString()
    const user = await User.findById(req.user.id).select('-password')
    const action = `updated ${name} by ${quantity} in inventory with location ${location}`
    writeToFile(date, action, user._id)
    res.json('updated')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

// Increments the item in inventory by the given quantity. If the item does not exist, then the item is created with the given quantity.
router.put('/superIncrement', auth, async (req, res) => {
  const { name, type, quantity, location } = req.body

  try {
    const inv = await Inventory.find({ name, location })
    if (inv.length === 0) {
      const inventory = new Inventory({
        name,
        type,
        quantity,
        location,
      })
      await inventory.save()
    } else {
      const newQuantity = inv[0].quantity + quantity
      await Inventory.find({ name, location }).updateOne({
        quantity: newQuantity,
      })
    }
    const date = new Date().toUTCString()
    const user = await User.findById(req.user.id).select('-password')
    const action = `added ${quantity} of ${name} in inventory with location ${location}`
    writeToFile(date, action, user._id)
    res.json('increased')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
