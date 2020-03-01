const InitialState = require('./InitialState');

module.exports = class BackState extends InitialState {
    constructor(data) {
        super(data);
        this.message = 'back_message';
    }
};
