const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const instructionOpenMapKeyboard = require('../../../keyboards/instructionOpenMap');

module.exports = class InstructionGeoState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'next') {
            await this.sendMessage('instruction_map', instructionOpenMapKeyboard);
            await this.transitTo(require('./InstructionMapState'));
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage('instruction_skip', initialKeyboard);
            await this.transitTo(require('../DefaultState'));
        }
    }
};
