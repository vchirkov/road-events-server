const InitialState = require('./InitialState');

module.exports = class ErrorState extends InitialState {
    constructor(data) {
        super(data);
        this.message = 'error_message';
    }
};
