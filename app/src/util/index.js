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

export function getDeviceTypeByModel(key) {
    switch (key){
        case 'lightController':
            return 'CONTROLLER';
        case 'led':
            return 'DEVICE';
        case 'plc':
            return 'PLC';
        case 'ammeter':
            return 'icon_ammeter';
        case 'pole':
            return 'POLE';
        case 'screen':
            return 'SCREEN';
        case 'collect':
            return 'POLE'
        default:
            return 'DEVICE';
    }
}

export function transformDeviceType(deviceType) {
    switch(deviceType){
        case "DEVICE":
            return 'lamp';
        case "CONTROLLER":
            return 'controller';
        case "ISTREETLIGHT":
            return 'intelligent';
        case "CHARGER":
            return 'charger';
        default:
            return null;
    }
}

export function macAddressValid(str){
    return str
}

export function latlngValid(str){
    return str.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')
}