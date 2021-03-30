const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// eslint-disable-next-line no-undef
module.exports = Material = mongoose.model('material', MaterialSchema);