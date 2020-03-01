const {locationDAO} = require('../../../../db');
const State = require('./State');

module.exports = class PinPatrolState extends State {
    constructor(data) {
        super(data);
        this.keyboard = null;
        this.message = null;
        this.locationDAO = locationDAO;
    }

    async addPin(location, from, type) {
        return await this.locationDAO.addPin({
            type,
            coordinates: [location.longitude, location.latitude]
        }, from);
    }

    async handle(data, context) {
        const {phrase, location, from} = data;

        const BackState = require('../BackState');
        const AddedPinState = require('../AddedPinState');

        if (location) {
            const pin = await this.addPin(location, from);
            return new AddedPinState({pin_id: pin._id});
        } else if (phrase === 'back') {
            return new BackState();
        }
    }
};
