const {stateDAO, userDAO} = require('../../db');
const {revert} = require('../phrases');

module.exports = class ConversationContext {
    constructor(bot, InitialState, ErrorState) {
        this.bot = bot;
        this.stateDAO = stateDAO;
        this.userDAO = userDAO;

        this.started = false;
        this.states = {};
        this.InitialState = InitialState;
        this.ErrorState = ErrorState;

        this.register(InitialState);
        this.register(ErrorState);
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
        const user_id = query && query.from.id || msg.from.id;
        const chat_id = msg.chat.id;
        const message_id = msg.message_id;
        const location = msg.location;
        const locale = msg.from.language_code;
        const bot = this.bot;

        const phrase = revert(msg.text, locale) || msg.text;

        const data = {
            msg,
            query_id,
            user_id,
            chat_id,
            message_id,
            location,
            locale,
            bot,
            phrase
        };

        this.updateUserInfo(msg);

        try {
            if (msg.text === '/start') {
                const newState = new this.InitialState();
                await newState.send(data, this);
                await this.stateDAO.setState({user_id, chat_id}, newState);
            } else if (msg.game) {
                const {name, data: stateData} = await this.stateDAO.getState({message_id});
                const queryState = new this.states[name](message_id, stateData);
                await queryState.send(data, this);
            } else {
                const {name, data: stateData} = await this.stateDAO.getState({user_id, chat_id});
                const currentState = new this.states[name](stateData);
                const newState = await currentState.handle(data, this) || currentState;
                const queryState = await newState.send(data, this);
                if (queryState) {
                    await this.stateDAO.setState({message_id: queryState.message_id}, queryState);
                }
                await this.stateDAO.setState({user_id, chat_id}, newState);
            }
        } catch (error) {
            const newState = new this.ErrorState();
            await newState.send(data, this);
            await this.stateDAO.setState({user_id, chat_id}, newState);
        }
    }

    updateUserInfo(msg) {
        this.userDAO.setUser(msg.from);
    }

    register(State) {
        this.states[State.name] = State;
    }
};
