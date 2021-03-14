const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    location:{
        type: String,
        required: true
    }
});

module.exports = Locations = mongoose.model('location', LocationSchema);