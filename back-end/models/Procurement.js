const mongoose = require('mongoose');

const ProcurementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  paid:{
    type:Boolean,
    required: true
  }
    
    
});

// eslint-disable-next-line no-undef
module.exports = Procurement = mongoose.model('procurement', ProcurementSchema);