const InitialState = require('./InitialState');

module.exports = class AddedPinState extends InitialState {
    constructor(data) {
        super(data);
        this.message = 'added_pin_message';
    }
};
