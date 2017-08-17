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

export function getObjectByKey(list, key, value) {
    for(var i=0;i<list.length;i++){
        if(list[i][key] == value){
            return list[i];
        }
    }
    return null;
}

export function getIndexByKey(list, key, value) {
    for(var i=0;i<list.length;i++){
        if(list[i][key] == value){
            return i;
        }
    }
    return -1;
}

/**
 *  获取字符串填充html元素宽度
 *  @str
 */
export function getElementOffwidth(str, fontSize="14px") {
    var w = 0;
    var html = document.createElement('span');
    html.style.visibility = 'hidden';
    html.style.fontSize = fontSize;
    html.innerHTML = str;
    document.body.appendChild(html);
    w = html.offsetWidth;
    document.body.removeChild(html);

    return w;
}

/**
 *
 * @param key(model)
 */
export function getClassByModel(key) {
    switch (key){
        case 'lcc':
            return 'icon_light_control';
        case 'lc':
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

export const DOMAIN_NAME_LENGTH = 16;
export const DEVICE_ID_LENGTH = 16;
export const DEVICE_NAME_LENGTH = 16;

export const STRATEGY_NAME_LENGTH = 16;

export function numbersValid(number) {
    return /^([1-9]\d*|0)$/.test(number)
}

export function NameValid(name) {
    return /^[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*$/.test(name);
}

export function Name2Valid(name) {
    return /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name);
}
export function IPValid(ip) {
    return /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/.test(ip)
}

export function PORTValid(port) {
    if(port < 1 || port > 65535){
        return false;
    }

    return /^([1-9]\d*|0)$/.test(port)
}

export function MACValid(mac){
    return /^[a-f0-9]*$/i.test(mac)
}

export function lngValid(value) {
    return /^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/.test(value);
}

export function latValid(value) {
    return /^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/.test(value);
}

export function latlngValid(str){
    return str.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')
}

export function PassWordValid(password) {
    return /^[_0-9a-zA-Z]+$/.test(password);
}