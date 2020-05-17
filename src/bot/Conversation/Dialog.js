const {version} = require('../../../package');
const chatbase = require('@google/chatbase');
const {stateDAO, userDAO} = require('../../db');
const {revert, translate} = require('../phrases');

const {CHATBASE_KEY} = process.env;

module.exports = class Dialog {
    constructor(bot, states = [], InitialState, ErrorState) {
        this.bot = bot;
        this.stateDAO = stateDAO;
        this.userDAO = userDAO;

        this.chatbase = chatbase
            .setApiKey(CHATBASE_KEY)
            .setPlatform('Telegram')
            .setVersion(version);

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
        const locale = query && query.from.language_code || msg.from.language_code;
        const bot = this.bot;

        const phrase = revert(msg.text, locale) || msg.text;

        const text = msg.text;
        const location = msg.location;
        const game = query && query.game_short_name;

        const data = {
            msg,
            query_id,
            message_id,
            user_id,
            chat_id,
            locale,
            phrase,
            text,
            location,
            game,
            bot,
            context: this
        };

        this.updateUserInfo(msg);

        let currentState;

        try {
            await this.trackUser(data);

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
            const errorState = new this.ErrorState(data, this);
            errorState.handle(e);
            console.error(e.message);
        }
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

    async transitTo({State, meta}, data) {
        const {user_id, chat_id} = data;
        await this.stateDAO.setState({user_id, chat_id}, State, meta);
        await this.trackBot({State}, data);
    }

    async sendMessage({message, keyboard}, data) {
        const {msg, locale} = data;

        const form = {
            reply_markup: keyboard ? {
                keyboard: keyboard(locale),
                resize_keyboard: true
            } : undefined,
            parse_mode: 'Markdown'
        };

        return this.bot.sendMessage(msg.chat.id, translate(message, locale), form);
    }

    async sendImage({image}, data) {
        const {msg} = data;

        return this.bot.sendPhoto(msg.chat.id, image);
    }

    async sendGame({name, keyboard, State}, data) {
        const {msg, locale} = data;

        const form = keyboard ? {
            reply_markup: {
                inline_keyboard: keyboard(locale)
            }
        } : undefined;

        const {message_id} = await this.bot.sendGame(msg.chat.id, name, form);

        return await this.saveQueryState(message_id, State);
    }

    async trackUser(data) {
        const {
            message_id,
            user_id,
            text,
            phrase,
            image,
            location,
            game
        } = data;

        let message;
        let intent;

        if (text) {
            intent = phrase;
            message = text;
        } else if (location) {
            intent = 'location';
            message = `long: ${location.longitude}  | lat: ${location.latitude}`
        } else if (image) {
            intent = message = `image`;
        } else if (game) {
            intent = message = `game`;
        }
        return await this.chatbase
            .newMessage(CHATBASE_KEY, user_id.toString())
            .setAsTypeUser()
            .setTimestamp(Date.now().toString())
            .setMessage(message.toString())
            .setIntent(intent.toString())
            .setMessageId(message_id.toString())
            .send();
    }

    async trackBot({State, replyTo}, data) {
        const {
            message_id,
            user_id
        } = data;

        return await this.chatbase
            .newMessage(CHATBASE_KEY, user_id.toString())
            .setAsTypeAgent()
            .setTimestamp(Date.now().toString())
            .setMessage(State.name.toString())
            .setMessageId(message_id.toString())
            .send();
    }
};
