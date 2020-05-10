const {locationDAO} = require('../../../db');
const State = require('./State');

const initialKeyboard = require('../../keyboards/initial');

module.exports = class PinState extends State {
    constructor(...args) {
        super(...args);
        this.locationDAO = locationDAO;
    }

    async handle() {
        const {phrase, location, user_id} = this.data;
        const {type} = this.meta;

        if (phrase === 'back') {
            await this.sendMessage('back_message', initialKeyboard);
            await this.transitTo(require('./DefaultState'));
            return;
        }

        if (!type) {
            await this.sendMessage('error_message', initialKeyboard);
            await this.transitTo(require('./DefaultState'));
            return;
        }

        if (location) {
            await this.addPin(location, user_id, type);
            await this.sendMessage('added_pin_message', initialKeyboard);
            await this.transitTo(require('./DefaultState'));
            return;
        }
    }

    async addPin(location, from, type) {
        return await this.locationDAO.addPin({
            type,
            coordinates: [location.longitude, location.latitude]
        }, from);
    }
};
