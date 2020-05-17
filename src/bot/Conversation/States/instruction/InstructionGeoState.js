const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const instructionOpenMapKeyboard = require('../../../keyboards/instructionOpenMap');

module.exports = class InstructionGeoState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'next') {
            await this.sendMessage({message: 'instruction_map', keyboard: instructionOpenMapKeyboard});
            await this.transitTo({State: require('./InstructionMapState')});
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage({message: 'instruction_skip', keyboard: initialKeyboard});
            await this.transitTo({State: require('../DefaultState')});
        }
    }
};
