const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = Material = mongoose.model('material', MaterialSchema);