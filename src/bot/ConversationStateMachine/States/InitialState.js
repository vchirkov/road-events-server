const State = require('./abstract/State');

const initial = require('../../keyboards/initial');

module.exports = class InitialState extends State {
    constructor(data) {
        super(data);
        this.keyboard = initial;
        this.message = 'welcome_message';
    }

    async handle(data, context) {
        const {phrase} = data;

        const PinPatrolState = require('./PinPatrolState');
        const PinSpeedCamState = require('./PinSpeedCamState');
        const PinAccidentState = require('./PinAccidentState');
        const PinRoadWorksState = require('./PinRoadWorksState');
        const ShowPinsState = require('./ShowPinsState');
        const ErrorState = require('./ErrorState');

        switch (phrase) {
            case 'pin_patrol':
                return new PinPatrolState();
            case'pin_speed_cam':
                return new PinSpeedCamState();
            case 'pin_accident':
                return new PinAccidentState();
            case 'pin_road_works':
                return new PinRoadWorksState();
            case 'show_pins':
                return new ShowPinsState();
            default:
                return new ErrorState();
        }
    }
};
