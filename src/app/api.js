const {Router} = require('express');
const auth = require('./middleware/auth');
const pins = require('./routes/pins');
const user = require('./routes/user');

const api = new Router();

api.use('/', auth);
api.use('/', pins);
api.use('/', user);

module.exports = api;
