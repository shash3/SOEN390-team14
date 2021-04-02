/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const app = express();

// Connect Database
connectDB(process.env.NODE_ENV === 'test');

app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

// Define Routes
app.use('/api/users', require('./routes/api/users/users'));

app.use('/api/auth', require('./routes/api/users/Auth'));

app.use('/api/inventory', require('./routes/api/Inventory/inventoryAuth'));

app.use('/api/procurement', require('./routes/api/Procurement/procurementAuth'));

app.use('/api/sales', require('./routes/api/Sales/salesAuth'));

app.use('/api/product_line', require('./routes/api/Product_line/productLineAuth'));

app.use('/api/material', require('./routes/api/Material/materialAuth'));

app.use('/api/transportation', require('./routes/api/transportation/transportationAuth'));

app.use('/api/quality', require('./routes/api/Quality/qualityAuth'));

app.use('/api/locations', require('./routes/api/Locations/locationAuth'));

app.use('/api/machine', require('./routes/api/Machines/machineAuth'));

app.use('/api/planning', require('./routes/api/Planning/planningAuth'));

//serve static assets react if production
if(process.env.NODE_ENV === 'production'){
  //set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log('Server started'));
}

module.exports = app;
