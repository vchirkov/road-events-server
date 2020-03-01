const InitialState = require('./InitialState');

const openMap = require('../../keyboards/openMap');

const {APP_NAME} = process.env;

module.exports = class ShowPinsState extends InitialState {
    constructor(data) {
        super(data);
        this.keyboard = openMap;
    }

    async send({bot, msg, locale}) {
        const OpenMapState = require('./OpenMapState');
        const {message_id} = await bot.sendGame(msg.chat.id, APP_NAME, {
            reply_markup: {
                inline_keyboard: this.keyboard(locale)
            }
        });
        return new OpenMapState(message_id);
    }
};
