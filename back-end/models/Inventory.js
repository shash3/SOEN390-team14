const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
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

module.exports = Inventory = mongoose.model('inventory', InventorySchema);