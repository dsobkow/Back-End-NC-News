const seedDB = require('./seed');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/northcoders_news';
const data = require('./devData/index.js')

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
    return seedDB(data)
  })
  .then(() => {
      mongoose.disconnect();
      console.log(`Disconnected from ${DB_URL}`)
    });
