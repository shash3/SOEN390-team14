const mongoose = require('mongoose')

const MachineSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  finish_time: {
    type: Date,
  },
})

// eslint-disable-next-line no-undef
module.exports = Machine = mongoose.model('machine', MachineSchema)
