const {translate} = require('../../phrases');

module.exports = class State {
    constructor(data, context, meta) {
        this.meta = meta;
        this.data = data;
        this.context = context;
    }

    async handle() {
        throw new Error(`this state is abstract, please use inheritor with 'handle', 'keyboard' and 'message' overwritten`);
    }

    async sendMessage(message, keyboard) {
        const {bot, msg, locale} = this.data;

        const form = {
            reply_markup: keyboard ? {
                keyboard: keyboard(locale),
                resize_keyboard: true
            } : undefined,
            parse_mode: 'Markdown'
        };

        return bot.sendMessage(msg.chat.id, translate(message, locale), form);
    }

    async sendImage(image) {
        const {bot, msg, locale} = this.data;

        return bot.sendPhoto(msg.chat.id, image);
    }

    async sendGame(name, keyboard, state) {
        const {bot, msg, locale} = this.data;

        const form = keyboard ? {
            reply_markup: {
                inline_keyboard: keyboard(locale)
            }
        } : undefined;

        const {message_id} = await bot.sendGame(msg.chat.id, name, form);

        return await this.context.saveQueryState(message_id, state);
    }

    async transitTo(State, meta) {
        return this.context.transitTo(State, meta, this.data);
    }
};
