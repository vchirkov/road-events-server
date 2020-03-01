const fs = require('fs');
const path = require('path');
const {configure} = require('i18n');

module.exports = class Phrases {
    static getLocalesFromDirectory(directory) {
        const files = fs.readdirSync(directory);
        return files.map(file => file.split('.').slice(0, -1).join('.'));
    }

    configureI18N() {
        configure({
            register: this,
            directory: this.directory,
            defaultLocale: this.defaultLocale,
            locales: Phrases.getLocalesFromDirectory(this.directory),
        });
    }

    constructor(opts = {}) {
        const {
            defaultLocale = 'en',
            directory = path.resolve(__dirname, './locales')
        } = opts;

        this.defaultLocale = defaultLocale;
        this.directory = directory;
        this.configureI18N();

        this.translate = this.translate.bind(this);
        this.revert = this.revert.bind(this);
    }

    translate(phrase, locale = this.defaultLocale) {
        if (!phrase) {
            return;
        }
        if (!this.getLocales().includes(locale)) {
            locale = this.defaultLocale;
        }
        return this.__({phrase, locale});
    }

    revert(text, locale = this.defaultLocale) {
        if (!text) {
            return;
        }
        if (!this.getLocales().includes(locale)) {
            locale = this.defaultLocale;
        }

        let phrases;
        try {
            phrases = require(path.join(this.directory, locale));
        } catch (e) {
            console.warn(`could not find locale '${locale}', fallback to default locale '${this.defaultLocale}'`);
            phrases = require(path.join(this.directory, this.defaultLocale));
        }
        const entry = Object.entries(phrases).find(([, val]) => val === text);

        return entry && entry[0];
    }
};
