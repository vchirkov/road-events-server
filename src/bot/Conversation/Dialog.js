const {stateDAO, userDAO} = require('../../db');
const {revert} = require('../phrases');

module.exports = class Dialog {
    constructor(bot, states = [], InitialState, ErrorState) {
        this.bot = bot;
        this.stateDAO = stateDAO;
        this.userDAO = userDAO;

        this.started = false;
        this.states = {};
        this.InitialState = InitialState;
        this.ErrorState = ErrorState;

        this.register(InitialState);
        states.forEach(State => this.register(State));

        this.listenMessage = this.listenMessage.bind(this);
        this.listenQuery = this.listenQuery.bind(this);
    }

    start() {
        this.bot.on('message', this.listenMessage);
        this.bot.on('callback_query', this.listenQuery);
        this.started = true;
    }

    stop() {
        this.bot.removeEventListener('message', this.listenMessage);
        this.bot.removeEventListener('callback_query', this.listenQuery);
        this.started = false;
    }

    async listenQuery(query) {
        return this.listen(query.message, query);
    }

    async listenMessage(msg) {
        return this.listen(msg);
    }

    async listen(msg, query) {

        const query_id = query && query.id;
        const message_id = msg.message_id;
        const user_id = query && query.from.id || msg.from.id;
        const chat_id = msg.chat.id;
        const location = msg.location;
        const locale = msg.from.language_code;
        const bot = this.bot;

        const phrase = revert(msg.text, locale) || msg.text;

        const data = {
            msg,
            query_id,
            message_id,
            user_id,
            chat_id,
            location,
            phrase,
            locale,
            bot,
            context: this
        };

        this.updateUserInfo(msg);

        let currentState;

        try {
            if (msg.text === '/start') {
                currentState = new this.InitialState(data, this);
            } else if (msg.game) {
                const queryData = await this.stateDAO.getState({message_id});
                if (queryData && queryData.name) {
                    currentState = new this.states[queryData.name](data, this, queryData.meta);
                }
            } else {
                const stateData = await this.stateDAO.getState({user_id, chat_id});
                if (stateData && stateData.name) {
                    currentState = new this.states[stateData.name](data, this, stateData.meta);
                }
            }

            await currentState.handle();
        } catch (e) {
            const errorState = new this.ErrorState();
            errorState.handle(e);
            console.error(e.message);
        }
    }

    async transitTo(State, meta, data) {
        const {user_id, chat_id} = data;
        await this.stateDAO.setState({user_id, chat_id}, State, meta);
    }

    async saveQueryState(message_id, state) {
        await this.stateDAO.setState({message_id}, state);
    }

    updateUserInfo(msg) {
        this.userDAO.setUser(msg.from);
    }

    register(State) {
        this.states[State.name] = State;
    }
};
