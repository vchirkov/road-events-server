const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const instructionGenericKeyboard = require('../../../keyboards/instructionGeneric');

module.exports = class InstructionWelcomeState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'next') {
            await this.sendMessage('instruction_geo', instructionGenericKeyboard);
            await this.transitTo(require('./InstructionGeoState'));
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage('instruction_skip', initialKeyboard);
            await this.transitTo(require('../DefaultState'));
        }
    }
};
