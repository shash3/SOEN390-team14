const mongoose = require('mongoose')
const config = require('config')

const db = config.get('mongoURI') // cloud database
const MongoMemoryServer = require('mongodb-memory-server')

const mongodb = new MongoMemoryServer.MongoMemoryServer()

const connectDB = async (virtual = false) => {
  try {
    if (virtual) {
      const uri = await mongodb.getUri() // Virtual database
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    } else {
      await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
    }
    console.log('MongoDB connected...')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
