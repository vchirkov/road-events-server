require('dotenv').config();

const app = require('./app');
const {botContext} = require('./bot');

const {PORT = 80} = process.env;

botContext.start();
app.listen(PORT, () => console.log(`Ready on port ${PORT}`));
