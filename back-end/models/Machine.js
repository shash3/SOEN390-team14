const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    item: {
        type: String,
        require: true
    },
    finish_time: {
        type: Date
    }
});

module.exports = Machine = mongoose.model('machine', MachineSchema);