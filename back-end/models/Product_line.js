const mongoose = require('mongoose');

const ProductLineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = ProductLine = mongoose.model('product_lines', ProductLineSchema);