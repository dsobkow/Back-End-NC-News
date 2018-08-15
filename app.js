const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/northcoders_news';

app.use(bodyParser.json());

app.use('/api', apiRouter);

mongoose.connect(DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log(`connected to ${DB_URL}...`)
  })

app.use('/*', (req, res) => {
    res.status(404).send({error: 'Page not found'});
});

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send({error: err.message});
    else res.status(500).send({error: "Internal server error"});
})

module.exports = app;