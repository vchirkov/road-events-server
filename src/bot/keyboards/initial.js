const {translate: t} = require('../phrases');

module.exports = (locale) => ([
    [{text: t('pin_patrol', locale)}, {text: t('pin_speed_cam', locale)}],
    [{text: t('pin_accident', locale)}, {text: t('pin_road_works', locale)}],
    [{text: t('help', locale)}],
    [{text: t('show_pins', locale)}]
]);
