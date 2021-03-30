const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  location:{
    type: String,
    required: true
  }
});

// eslint-disable-next-line no-undef
module.exports = Locations = mongoose.model('location', LocationSchema);