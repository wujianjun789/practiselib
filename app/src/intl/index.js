import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import { addLocaleData } from 'react-intl';
import { getLocalStorage, setLocalStorage} from '../util/cache'
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
    let appLanguage = getLocalStorage("appLanguage");
    let newLanguage = appLanguage || 'zh';
    setLocalStorage("appLanguage", newLanguage);
    getTargetIntl(newLanguage, cb);
}

export function getIntlEn(cb) {
    if(typeof require.ensure === "function"){
        require.ensure(['./en'], () => {
            const en = require('./en').default;
            cb(getIntl(en));
        }, 'intl.en')
    }
}
export function getIntlZh(cb) {
    if(typeof require.ensure === "function"){
        require.ensure(['./zh'], () => {
            const zh = require('./zh').default;
            cb(getIntl(zh));
        }, 'intl.zh')
    }
}

export function getTargetIntl(locale, cb) {
    switch (locale) {
        case 'zh':
            return getIntlZh(cb);
        default:
            return getIntlEn(cb);
    }
}

