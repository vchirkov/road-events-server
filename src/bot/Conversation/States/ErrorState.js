const State = require('./State');

const initialKeyboard = require('../../keyboards/initial');

module.exports = class ErrorState extends State {
    async handle(error) {
        await this.sendMessage('error_message', initialKeyboard);
        await this.transitTo(require('./DefaultState'), {error: error.message});
    }
};
