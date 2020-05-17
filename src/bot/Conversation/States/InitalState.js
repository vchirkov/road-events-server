const State = require('./State');

const instructionGeneric = require('../../keyboards/instructionGeneric');

module.exports = class IntialState extends State {
    async handle() {
        await this.sendMessage({message: 'instruction_welcome', keyboard: instructionGeneric});
        await this.transitTo({State: require('./instruction/InstructionWelcomeState')});
    }
};
