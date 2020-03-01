const {translate: t} = require('../phrases');

module.exports = (locale) => ([
    [{
        text: t('open_map', locale),
        callback_game: process.env.APP_NAME
    }]
]);
