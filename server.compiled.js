"use strict";

/* eslint-disable no-console */
require('dotenv').config();

// import express from 'express'
// import cookieParser from 'cookie-parser'
// import path from 'path'

var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
// const cors = require('cors')

// import db from './models'
// import routes from './routes'

var db = require('./models');
var routes = require('./routes');
var app = express();
var PORT = process.env.PORT || 8080;

// const corsOptions = {
//   origin: 'http://localhost:3000'
// }

app.use(cookieParser());
// app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express["static"](path.join(__dirname, 'client', 'build')));
app.use(routes);

// app.get('/service-worker.js', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client', 'build/service-worker.js'))
// })

app.get('/*', function (req, res) {
  // res.sendFile('./build/index.html')
  res.sendFile(path.join(__dirname, 'client', 'build/index.html'));
});

// drop and resync db force: true
db.sequelize.sync({
  force: false
}).then(function () {
  app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT, "."));
    console.log("http://localhost:".concat(PORT));
  });
})["catch"](function (err) {
  return console.log(err);
});
