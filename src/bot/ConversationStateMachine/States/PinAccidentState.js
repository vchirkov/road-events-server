const PinState = require('./abstract/PinState');
const pinAccident = require('../../keyboards/pinAccident');

const {TYPE_ACCIDENT} = require('../../constants');

module.exports = class PinAccidentState extends PinState {
    constructor(data) {
        super(data);
        this.keyboard = pinAccident;
        this.message = 'pin_accident_message';
    }

    async addPin(location, from) {
        return await super.addPin(location, from, TYPE_ACCIDENT);
    }
};
