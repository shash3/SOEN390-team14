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
app.use('/api/auth', require('./routes/api/users/auth'))

app.use('/api/inventory', require('./routes/api/inventory/auth'))

app.use('/api/product_line', require('./routes/api/product_line/auth'))

app.use('/api/material', require('./routes/api/material/auth'))

app.use('/api/transportation', require('./routes/api/transportation/auth'))

app.use('/api/quality', require('./routes/api/quality/auth'))

app.use('/api/machine', require('./routes/api/machine/auth'))

if(process.env.NODE_ENV !== 'test'){
    app.listen(PORT, () => console.log('Server started'));
}

module.exports = app