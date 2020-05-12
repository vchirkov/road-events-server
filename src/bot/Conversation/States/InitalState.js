const State = require('./State');

const instructionGeneric = require('../../keyboards/instructionGeneric');

module.exports = class IntialState extends State {
    async handle() {
        await this.sendMessage('instruction_welcome', instructionGeneric);
        await this.transitTo(require('./instruction/InstructionWelcomeState'));
    }
};
