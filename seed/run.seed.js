const seedDB = require('./seed');
const mongoose = require('mongoose');
const { DB_URL } = require('../config/db-config.js');
const data = require('./devData/index.js');

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
    return seedDB(data)
  })
  .then(() => {
      mongoose.disconnect();
      console.log(`Disconnected from ${DB_URL}`)
    });
