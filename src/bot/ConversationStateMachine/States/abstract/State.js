const {translate} = require('../../../phrases');

module.exports = class State {
    constructor(data = {}) {
        this.keyboard = null;
        this.message = null;
        this.data = data;
    }

    get name() {
        return this.constructor.name;
    }

    async handle(data, context) {
        throw new Error(`this state is abstract, please use inheritor with 'handle', 'keyboard' and 'message' overwritten`);
    }

    async send({bot, msg, locale}) {
        return bot.sendMessage(msg.chat.id, translate(this.message, locale), {
            reply_markup: {
                keyboard: this.keyboard(locale),
                resize_keyboard: true
            },
            parse_mode: 'Markdown'
        });
    }

    save() {
        return {
            name: this.name,
            data: this.data
        }
    }

    restore(obj) {
        this.data = obj.data;
    }
};
