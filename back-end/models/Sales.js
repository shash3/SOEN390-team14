const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    },
    location: {
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
    }
    
    
});

module.exports = Sales = mongoose.model('sales', SalesSchema);
