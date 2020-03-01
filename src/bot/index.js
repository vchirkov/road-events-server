const TelegramBot = require('node-telegram-bot-api');

const ConversationContext = require('./ConversationStateMachine/ConversationContext');
const AddedPinState = require('./ConversationStateMachine/States/AddedPinState');
const BackState = require('./ConversationStateMachine/States/BackState');
const ErrorState = require('./ConversationStateMachine/States/ErrorState');
const InitialState = require('./ConversationStateMachine/States/InitialState');
const PinAccidentState = require('./ConversationStateMachine/States/PinAccidentState');
const PinPatrolState = require('./ConversationStateMachine/States/PinPatrolState');
const PinRoadWorksState = require('./ConversationStateMachine/States/PinRoadWorksState');
const PinSpeedCamState = require('./ConversationStateMachine/States/PinSpeedCamState');
const ShowPinsState = require('./ConversationStateMachine/States/ShowPinsState');
const OpenMapState = require('./ConversationStateMachine/States/OpenMapState');

const {TELEGRAM_BOT_TOKEN} = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {polling: true});
const context = new ConversationContext(bot, InitialState, ErrorState);

context.register(AddedPinState);
context.register(BackState);
context.register(ErrorState);
context.register(InitialState);
context.register(PinAccidentState);
context.register(PinPatrolState);
context.register(PinRoadWorksState);
context.register(PinSpeedCamState);
context.register(ShowPinsState);
context.register(OpenMapState);

exports.botContext = context;
