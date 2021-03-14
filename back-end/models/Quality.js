const mongoose = require('mongoose');

const QualitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    quality: {
        type: String,
        required: true
    },
});

module.exports = Quality = mongoose.model('quality', QualitySchema);
