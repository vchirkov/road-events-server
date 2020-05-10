const State = require('./State');

const initialKeyboard = require('../../keyboards/initial');

module.exports = class IntialState extends State {
    async handle() {
        await this.sendMessage('welcome_message', initialKeyboard);
        await this.transitTo(require('./DefaultState'));
    }
};
