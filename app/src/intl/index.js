import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import { addLocaleData } from 'react-intl';
addLocaleData(enLocaleData);
addLocaleData(zhLocaleData);
const intl = {
    defaultLocale: 'zh',
}
function getIntl(lang) {
    intl.locale = lang.locale;
    intl.messages = lang.messages;
    return intl;
}
export function getDefaultIntl(cb) {
    localStorage.appLanguage = localStorage.appLanguage || 'zh';
    getTargetIntl(localStorage.appLanguage, cb);
}

export function getIntlEn(cb) {
    require.ensure(['./en'], () => {
        const en = require('./en').default;
        cb(getIntl(en));
    }, 'intl.en')
}
export function getIntlZh(cb) {
    require.ensure(['./zh'], () => {
        const zh = require('./zh').default;
        cb(getIntl(zh));
    }, 'intl.zh')
}

export function getTargetIntl(locale, cb) {
    switch (locale) {
        case 'zh':
            return getIntlZh(cb);
        default:
            return getIntlEn(cb);
    }
}

