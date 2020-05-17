const State = require('../State');

const initialKeyboard = require('../../../keyboards/initial');
const openMapKeyboard = require('../../../keyboards/openMap');
const instructionOpenMapKeyboard = require('../../../keyboards/instructionOpenMap');

const {APP_NAME} = process.env;

module.exports = class InstructionMapState extends State {
    async handle() {
        const {phrase} = this.data;

        if (phrase === 'open_map') {
            await this.sendMessage({message: 'instruction_open_map', keyboard: instructionOpenMapKeyboard});
            await this.sendGame({name: APP_NAME, keyboard: openMapKeyboard, State: require('../ShowPinsState')});
            return;
        }

        if (phrase === 'next') {
            await this.sendMessage({message: 'instruction_set_from_chat', keyboard: initialKeyboard});
            await this.transitTo({State: require('../DefaultState')});
            return;
        }

        if (phrase === 'skip') {
            await this.sendMessage({message: 'instruction_skip', keyboard: initialKeyboard});
            await this.transitTo({State: require('../DefaultState')});
        }
    }
};
