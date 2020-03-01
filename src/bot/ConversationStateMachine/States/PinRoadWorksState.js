const PinState = require('./abstract/PinState');
const pinRoadWorks = require('../../keyboards/pinRoadWorks');

const {TYPE_ROAD_WORKS} = require('../../constants');

module.exports = class PinRoadWorksState extends PinState {
    constructor(data) {
        super(data);
        this.keyboard = pinRoadWorks;
        this.message = 'pin_road_works_message';
    }

    async addPin(location, from) {
        return await super.addPin(location, from, TYPE_ROAD_WORKS);
    }
};
