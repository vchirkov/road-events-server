const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const instructionGenericKeyboard = require('../../../keyboards/instructionGeneric');

module.exports = class InstructionWelcomeState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'next') {
            await this.sendMessage({message: 'instruction_geo', keyboard: instructionGenericKeyboard});
            await this.transitTo({State: require('./InstructionGeoState')});
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage({message: 'instruction_skip', keyboard: initialKeyboard});
            await this.transitTo({State: require('../DefaultState')});
        }
    }
};
