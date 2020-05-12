const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);

const State = require('./State');

const initialKeyboard = require('../../keyboards/initial');
const pinPatrolKeyboard = require('../../keyboards/pinPatrol');
const pinSpeedCamKeyboard = require('../../keyboards/pinSpeedCam');
const pinAccidentKeyboard = require('../../keyboards/pinAccident');
const pinRoadWorksKeyboard = require('../../keyboards/pinRoadWorks');
const openMapKeyboard = require('../../keyboards/openMap');

const {APP_NAME} = process.env;
const {TYPE_PATROL, TYPE_SPEED_CAM, TYPE_ROAD_WORKS, TYPE_ACCIDENT} = require('../../../constants');

module.exports = class DefaultState extends State {
    async handle() {
        const {phrase} = this.data;

        switch (phrase) {
            case 'pin_patrol':
                await this.sendMessage('pin_patrol_message', pinPatrolKeyboard);
                await this.transitTo(require('./PinState'), {type: TYPE_PATROL});
                return;
            case'pin_speed_cam':
                await this.sendMessage('pin_speed_cam_message', pinSpeedCamKeyboard);
                await this.transitTo(require('./PinState'), {type: TYPE_SPEED_CAM});
                return;
            case 'pin_accident':
                await this.sendMessage('pin_accident_message', pinAccidentKeyboard);
                await this.transitTo(require('./PinState'), {type: TYPE_ROAD_WORKS});
                return;
            case 'pin_road_works':
                await this.sendMessage('pin_road_works_message', pinRoadWorksKeyboard);
                await this.transitTo(require('./PinState'), {type: TYPE_ACCIDENT});
                return;
            case 'show_pins':
                await this.sendGame(APP_NAME, openMapKeyboard, require('./ShowPinsState'));
                return;
            case 'help':
                await this.sendHelp();
                return;
            default:
                await this.sendMessage('error_message', initialKeyboard);
                return;
        }
    }

    async sendHelp() {
        await this.sendMessage('help_geolocation');
        await this.sendMessage('help_geolocation_ios');
        await this.sendMessage('help_geolocation_android');
        await this.sendMessage('help_no_controls');
        await this.sendImage(await readFile(path.join(__dirname, './img/switch_kb.png')));
        await this.sendMessage('help_no_controls_end');
        await this.sendMessage('help_send_event');
        await this.sendMessage('help_restart');
    }
};
