const PinState = require('./abstract/PinState');
const pinPatrol = require('../../keyboards/pinPatrol');

const {TYPE_PATROL} = require('../../constants');

module.exports = class PinPatrolState extends PinState {
    constructor(data) {
        super(data);
        this.keyboard = pinPatrol;
        this.message = 'pin_patrol_message';
    }

    async addPin(location, from) {
        return await super.addPin(location, from, TYPE_PATROL);
    }
};
