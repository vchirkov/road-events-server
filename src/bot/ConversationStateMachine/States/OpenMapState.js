const State = require('./abstract/State');

const {APP_URL} = process.env;

module.exports = class OpenMapState extends State {
    constructor(message_id, data) {
        super(data);
        this.message_id = message_id;
    }

    handle() {
        return null;
    }

    async send({query_id, bot, user_id}) {
        if (query_id) {
            bot.answerCallbackQuery(query_id, {url: `${APP_URL}/#/auth/token/${user_id}`});
        }
    }
};
