const mongoose = require('mongoose')

const ProductLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  material: {
    type: Array,
    required: true,
  },
})

// eslint-disable-next-line no-undef
module.exports = ProductLine = mongoose.model(
  'product_lines',
  ProductLineSchema,
)
