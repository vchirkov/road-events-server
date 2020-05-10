const TelegramBot = require('node-telegram-bot-api');
const Dialog = require('./Conversation/Dialog');

const {TELEGRAM_BOT_TOKEN} = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});

const context = new Dialog(bot, [
        require('./Conversation/States/DefaultState'),
        require('./Conversation/States/PinState'),
        require('./Conversation/States/ShowPinsState'),
    ],
    require('./Conversation/States/InitalState'),
    require('./Conversation/States/ErrorState')
);

exports.botContext = context;
