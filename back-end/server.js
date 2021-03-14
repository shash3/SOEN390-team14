const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors')

const app = express();

// Connect Database
connectDB();

app.use(cors())
// Init Middleware
app.use(express.json({ extended: false}));

const PORT = process.env.PORT || 5000;

// Define Routes
app.use('/api/users', require('./routes/api/users/users'))
app.use('/api/auth', require('./routes/api/users/Auth'))

app.use('/api/inventory', require('./routes/api/Inventory/inventoryAuth'))

app.use('/api/product_line', require('./routes/api/Product_line/productLineAuth'))

app.use('/api/material', require('./routes/api/Material/materialAuth'))

app.use('/api/transportation', require('./routes/api/transportation/transportationAuth'))

app.use('/api/quality', require('./routes/api/Quality/qualityAuth'))


app.use('/api/locations', require('./routes/api/Locations/locationAuth'))

app.use('/api/machine', require('./routes/api/Machines/machineAuth'))


if(process.env.NODE_ENV !== 'test'){
    app.listen(PORT, () => console.log('Server started'));
}

module.exports = app