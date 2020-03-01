const {translate: t} = require('../phrases');

module.exports = (locale) => ([
    [{
        text: t('pin_speed_cam', locale),
        request_location: true
    }],
    [{
        text: t('back', locale)
    }]
]);
