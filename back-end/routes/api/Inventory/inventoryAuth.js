const express = require('express')

const router = express.Router()
const Inventory = require('../../../models/Inventory')
const auth = require('../../../middleware/auth')

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
router.post('/add', async (req, res) => {
  const { name, quantity, location, type } = req.body
  const inventory = new Inventory({
    name,
    type,
    quantity,
    location,
  })
  await inventory.save()
  res.json('added')
})

// Remove a certain quantity from inventory
router.put('/remove', async (req, res) => {
  const { name, quantity, location } = req.body
  try {
    await Inventory.find({ name, location }).updateOne({ quantity })
    res.json('removed')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

// Decrease a product by a certain quantity from inventory
router.put('/decrement', async (req, res) => {
  const { name, quantity, location } = req.body
  try {
    const inventory = await Inventory.find({ name, location })
    const newQuantity = inventory[0].quantity - quantity
    await Inventory.find({ name, location }).updateOne({
      quantity: newQuantity,
    })
    res.json('decreased')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

router.put('/superUpdate', async (req, res) => {
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
    res.json('updated')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

// Increments the item in inventory by the given quantity. If the item does not exist, then the item is created with the given quantity.
router.put('/superIncrement', async (req, res) => {
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
    res.json('increased')
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router
