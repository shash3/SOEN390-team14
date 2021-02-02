const express = require('express');
const connectDB = require('./config/db')

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false}));

const PORT = process.env.PORT || 5000;

// Define Routes
app.use('/api/users', require('./routes/api/users/users'))
app.use('/api/auth', require('./routes/api/users/auth'))

app.listen(PORT, () => console.log('Server started'));