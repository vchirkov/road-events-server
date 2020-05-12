const {translate: t} = require('../phrases');

module.exports = (locale) => ([
    [{text: t('next', locale)}],
    [{text: t('skip', locale)}]
]);
