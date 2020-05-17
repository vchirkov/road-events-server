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
                await this.sendMessage({message: 'pin_patrol_message', keyboard: pinPatrolKeyboard});
                await this.transitTo({State: require('./PinState'), meta: {type: TYPE_PATROL}});
                return;
            case'pin_speed_cam':
                await this.sendMessage({message: 'pin_speed_cam_message', keyboard: pinSpeedCamKeyboard});
                await this.transitTo({State: require('./PinState'), meta: {type: TYPE_SPEED_CAM}});
                return;
            case 'pin_accident':
                await this.sendMessage({message: 'pin_accident_message', keyboard: pinAccidentKeyboard});
                await this.transitTo({State: require('./PinState'), meta: {type: TYPE_ROAD_WORKS}});
                return;
            case 'pin_road_works':
                await this.sendMessage({message: 'pin_road_works_message', keyboard: pinRoadWorksKeyboard});
                await this.transitTo({State: require('./PinState'), meta: {type: TYPE_ACCIDENT}});
                return;
            case 'show_pins':
                await this.sendGame({name: APP_NAME, keyboard: openMapKeyboard, State: require('./ShowPinsState')});
                return;
            case 'help':
                await this.sendHelp();
                return;
            default:
                await this.sendMessage({message: 'error_message', keyboard: initialKeyboard});
                return;
        }
    }

    async sendHelp() {
        await this.sendMessage({message: 'help_geolocation'});
        await this.sendMessage({message: 'help_geolocation_ios'});
        await this.sendMessage({message: 'help_geolocation_android'});
        await this.sendMessage({message: 'help_no_controls'});
        await this.sendImage({image: await readFile(path.join(__dirname, './img/switch_kb.png'))});
        await this.sendMessage({message: 'help_no_controls_end'});
        await this.sendMessage({message: 'help_send_event'});
        await this.sendMessage({message: 'help_restart'});
    }
};
