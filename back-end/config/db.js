const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI'); // cloud database
const connectionString = 'mongodb://mongo:27017/erp'; // local database

const connectDB = async () =>{
    try{
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB connected...');
    } catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;