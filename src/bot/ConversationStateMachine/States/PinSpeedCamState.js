const PinState = require('./abstract/PinState');
const pinSpeedCam = require('../../keyboards/pinSpeedCam');

const {TYPE_SPEED_CAM} = require('../../constants');

module.exports = class PinSpeedCamState extends PinState {
    constructor(data) {
        super(data);
        this.keyboard = pinSpeedCam;
        this.message = 'pin_speed_cam_message';
    }

    async addPin(location, from) {
        return await super.addPin(location, from, TYPE_SPEED_CAM);
    }
};
