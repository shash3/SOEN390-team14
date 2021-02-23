const mongoose = require('mongoose');

const TransportationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

module.exports = Tansportation = mongoose.model('transportation', TransportationSchema);