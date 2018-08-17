const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('./config/db-config.js').DB_URL;

app.use(bodyParser.json());

app.use('/api', apiRouter);

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
  })

app.use('/*', (req, res) => {
    res.status(404).send({message: 'Page not found'});
});

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send({message: err.message});
    else if (err.name === 'ValidationError') res.status(err.status).send({message: err.message})
    else res.status(500).send({message: "Internal server error"});
})

module.exports = app;