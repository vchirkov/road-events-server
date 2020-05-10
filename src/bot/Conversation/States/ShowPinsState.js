const {userDAO} = require('../../../db');
const State = require('./State');

const {APP_URL} = process.env;

module.exports = class OpenMapState extends State {
    async handle() {
        const {query_id, bot, user_id} = this.data;
        if (query_id) {
            const token = await userDAO.generateToken({id: user_id});
            bot.answerCallbackQuery(query_id, {url: `${APP_URL}/#/auth/token/${token}`});
        }
    }
};
