const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const openMapKeyboard = require('../../../keyboards/openMap');
const instructionOpenMapKeyboard = require('../../../keyboards/instructionOpenMap');

const {APP_NAME} = process.env;

module.exports = class InstructionMapState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'open_map') {
            await this.sendMessage('instruction_open_map', instructionOpenMapKeyboard);
            await this.sendGame(APP_NAME, openMapKeyboard, require('../ShowPinsState'));
            return;
        }

        if (phrase === 'next') {
            await this.sendMessage('instruction_set_from_chat', initialKeyboard);
            await this.transitTo(require('../DefaultState'));
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage('instruction_skip', initialKeyboard);
            await this.transitTo(require('../DefaultState'));
        }
    }
};
