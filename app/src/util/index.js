/**
 * Created by a on 2017/7/13.
 */
import { getLocalStorage, setLocalStorage} from './cache'
const _ = require('lodash');
let language = "";
export function getLanguage() {
    language = getLocalStorage("appLanguage");
    if(!language) {
        language = navigator.language;

        if (!language) {
            language = navigator.browserLanguage;
        }

        if (language) {
            let lans = language.split('-')
            if (lans.length > 1) {
                language = lans[0]
            }
        }
    }
    return language;
}

export function setLanguage(language) {
    this.language = language
    setLocalStorage("appLanguage", language);
}

export function intlFormat(data) {
    let lan = getLanguage();

    return data[lan] ? data[lan] : data['en'];
}

export function getObjectByKey(list, key, value) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][key] == value) {
            return list[i];
        }
    }
    return null;
}

export function getIndexByKey(list, key, value) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][key] == value) {
            return i;
        }
    }
    return -1;
}

/**
 *  获取字符串填充html元素宽度
 *  @str
 */
export function getElementOffwidth(str, fontSize = "14px") {
    var w = 0;
    var html = document.createElement('span');
    html.style.visibility = 'hidden';
    html.style.fontSize = fontSize;
    html.innerHTML = str;
    document
        .body
        .appendChild(html);
    w = html.offsetWidth;
    document
        .body
        .removeChild(html);
    return w;
}

/**
 *
 * @param key(model)
 */
export function getClassByModel(key) {
    switch (key) {
        case 'gateway':
            return 'icon_gateway';
        case 'lc':
            return 'icon_lc';
        case 'sensor':
            return 'icon_control';
            //智慧路灯 icon
        case 'smartlight':
            return 'icon_smart_light';
        case 'smartLightPole':
            return 'icon_light_control';
        case 'ammeter':
            return 'icon_ammeter';
        case 'pole':
            return 'icon_pole';
        case 'screen':
            return 'icon_screen';
        case 'xes':
            return 'icon_collect';
        case 'scene':
            return 'icon_scene';
        default:
            return 'icon_lc';
    }
}

export function getDeviceTypeByModel(key) {
    switch (key) {
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
        case 'xes':
            return 'POLE'
        default:
            return 'DEVICE';
    }
}

export function transformDeviceType(deviceType) {
    switch (deviceType) {
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

export function getNotifyStateClass(state) {
    switch (state) {
        case 0:
            return 'fail';
        case 1:
            return 'success'
        case 2:
            return 'warning'
    }
}

export function IsMapCircleMarker(domainLevel, map){
    if(!domainLevel || !map){
        return false;
    }
    return map.zoom < map.maxZoom-(map.maxZoom-map.minZoom)/domainLevel;
}

export function getDomainLevelByMapLevel(domainLevel, map) {
    if(map.zoom == map.minZoom){
        return Math.min(1, domainLevel);
    }

    if(map.zoom == map.maxZoom){
        return Math.max(1, domainLevel);
    }

    return Math.ceil((map.zoom-map.minZoom)*domainLevel/(map.maxZoom-map.minZoom));
}
export const DOMAIN_NAME_LENGTH = 16;
export const DEVICE_ID_LENGTH = 16;
export const DEVICE_NAME_LENGTH = 16;

export const STRATEGY_NAME_LENGTH = 16;

export function numbersValid(number) {
    // return /^([1-9]\d*)|0$/.test(number)
    if(!number){
        return false;
    }
    return /^[+-]?\d*\.?\d*$/.test(number);
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
    if (port < 1 || port > 65535) {
        return false;
    }

    return /^([1-9]\d*|0)$/.test(port)
}

export function MACValid(mac) {
    return /^[a-f0-9]*$/i.test(mac)
}

export function lngValid(value) {
    return /^[-]?(\d|([1-9]\d)|(1[0-7]\d)|(180))(\.\d*)?$/.test(value);
}

export function latValid(value) {
    return /^[-]?(\d|([1-8]\d)|(90))(\.\d*)?$/.test(value);
}

export function latlngValid(str) {
    return str.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, '')
}

export function PassWordValid(password) {
    return /^[_0-9a-zA-Z]+$/.test(password);
}

export function makeTree(pre){
    const data = pre.map((v)=>{
      if(!v.parentId) v.parentId='';
      return v;
    })
    let groupedByParents = _.groupBy(data, 'parentId');
    let keysById = _.keyBy(data, 'id');
    _.each(_.omit(groupedByParents, ''), function(children, parentId) {
        keysById[parentId].children = children; 
    });
    return groupedByParents[''];
}