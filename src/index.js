require('dotenv').config();

const app = require('./app');
const {botContext} = require('./bot');

const {PORT} = process.env;

botContext.start();
app.listen(PORT);
