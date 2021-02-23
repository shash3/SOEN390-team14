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

app.use('/api/material', require('./routes/api/materials/auth'))
app.use('/api/material', require('./routes/api/materials/auth'))


app.use('/api/transportation', require('./routes/api/transportation/auth'))

app.listen(PORT, () => console.log('Server started'));