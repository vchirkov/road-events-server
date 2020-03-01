const {translate: t} = require('../phrases');

module.exports = (locale) => ([
    [{
        text: t('pin_accident', locale),
        request_location: true
    }],
    [{
        text: t('back', locale)
    }]
]);
