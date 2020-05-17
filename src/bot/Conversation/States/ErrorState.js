const State = require('./State');

const initialKeyboard = require('../../keyboards/initial');

module.exports = class ErrorState extends State {
    async handle(error) {
        await this.sendMessage({message: 'error_message', keyboard: initialKeyboard});
        await this.transitTo({State: require('./DefaultState'), meta: {error: error.message}});
    }
};
