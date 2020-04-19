const {userDAO} = require('../../../db');
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
            const token = await userDAO.generateToken({id: user_id});
            bot.answerCallbackQuery(query_id, {url: `${APP_URL}/#/auth/token/${token}`});
        }
    }
};
