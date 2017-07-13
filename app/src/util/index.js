/**
 * Created by a on 2017/7/13.
 */
let language = "";
export function getLanguage() {
    if(!language){
        language = navigator.language;
    }

    if(!language){
        language = navigator.browserLanguage;
    }

    if(language){
        let lans = language.split('-')
        if(lans.length > 1){
            language = lans[0]
        }
    }

    return language;
}

export function setLanguage(language) {
    this.language = language
}

export function intlFormat(data) {
    let lan = getLanguage();

    return data[lan] ? data[lan] : data['en'];
}

/**
 *
 * @param key(model)
 */
export function getClassByModel(key) {
    switch (key){
        case 'lightController':
            return 'icon_light_control';
        case 'led':
            return 'icon_led_light';
        case 'plc':
            return 'icon_plc_control';
        case 'ammeter':
            return 'icon_ammeter';
        case 'pole':
            return 'icon_pole';
        case 'screen':
            return 'icon_screen';
        case 'collect':
            return 'icon_collect'
        default:
            return 'icon_led_light';
    }
}