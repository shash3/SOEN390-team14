const mongoose = require('mongoose')

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
})

// eslint-disable-next-line no-undef
module.exports = Inventory = mongoose.model('inventory', InventorySchema)
