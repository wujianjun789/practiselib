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

/**
 *  对象每项验证
 * @param value(string)
 * @parm validFun(判断函数)
 * @returns {string}
 * @constructor
 */
export function ObjectPerValid(value, validFun) {
    let newValue = "";
    for(let i=0;i<value.length;i++)
    {
        let s = value.slice(i, i+1);
        if(validFun(s)){
            newValue += s;
        }
    }

    return newValue;
}

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