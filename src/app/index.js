const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');

const api = require('./api');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);

module.exports = app;
