/**
 * Created by RJ on 2016/6/2.
 */
import Immutable from 'immutable'
/**
 * 冒泡排序
 * @param list
 * @returns {*}
 */
export function bubbleSort(list){
    for(var i=0;i<list.size;i++){
        for(var j=i+1;j<list.size;j++){
            if(list.get(j) < list.get(i)){
                var tmp = list.get(j)
                list.set(j, list.get(i));
                list.set(i,tmp)
            }
        }
    }
    return list;
}


export function padHex(str, padLeft) {
    var padstr = '0000000000000000'
    if (typeof str === 'undefined')
        return padstr;
    if (padLeft) {
        return (padstr + str).slice(-padstr.length);
    } else {
        return (str + padstr).substring(0, padstr.length);
    }
}
/**
 * 通过键值获取某种属性
 * @param list
 * @param key比较键
 * @param value比较值
 * @param backKey返回键
 * @returns {*}
 */
export function getProByKey(list, key, value, backKey) {
    for(var i=0;i<list.size;i++){
        if(list.getIn([i,key]) == value){
            return list.getIn([i,backKey])
        }
    }

    return null;
}

/**
 * 获取对象中指定键值
 * @param object
 * @param params数组
 */
export function getObjectByKeyInObject(object,key) {
    if(object.has(key) && object.get(key)){
        return object.get(key)
    }

    return null;
}
/**
 * 通过键值获取索引
 * @param list
 * @param key
 * @param value
 * @returns {number}
 */
export function getIndexByKey(list, key, value) {
    for(var i=0;i<list.size;i++){
        if(list.getIn([i, key]) == value){
            return i;
        }
    }

    return -1;
}

/**
 * 通过键值获取索引
 * @param list
 * @param key
 * @param value
 * @returns {number}
 */
export function getIndexByKey2(list, key, value) {
    for(var i=0;i<list.length;i++){
        if(list[i][key] == value){
            return i;
        }
    }

    return -1;
}
/**
 * 根据键值搜索数组中匹配项
 * @param list
 * @param key
 * @param value
 * @constructor
 */
export function getObjectByKey(list, key, value) {
    for(var i=0;i<list.size;i++){
        if(list.getIn([i, key]) == value){
            return list.get(i);
        }
    }
    return null;
}

export function getObjectByKeyObj(list, key, value) {
    for(var i=0;i<list.length;i++){
        if(list[i][key] == value){
            return list[i];
        }
    }
    return null;
}

/**
 * 根据键值(多个参数)搜索数组中匹配项
 *
 */
export function getObjectByKeys(list, keys, values) {
    if(!keys || !values || keys.size != values.size){
        return null;
    }
    let len = keys.size;
    let index = 0;
    for(var i=0;i<list.size;i++){
        index = 0;
        while (index < len){
            if(list.getIn([i, keys.get(index)]) == values.get(index)){
                index++;
                if(index == len){
                    return list.get(i);
                }
            }else{
                break;
            }
        }
    }
    return null;
}

/**
 *  根据指定键值获取所有相同项
 * @param list
 * @param key
 * @param value
 */
export function getListByKey(list, key, value) {
    let newList = Immutable.fromJS([]);
    list.map(item=>{
        if(item.get(key) == value){
            newList = newList.push(item)
        }
    })
    return newList;
}

/**
 * 根据指定键值模糊搜索数组中所有相同项，并返回由相同项中指定的键值组成的数组
 * @param list 
 * @param key1 
 * @param value 
 * @param key2 
 */
export function getListKeyByKeyFuzzy(list, key1, value, key2) {
    let newList = [];
    list.map(item=>{
        if(item.get(key1).indexOf(value)>-1){
            newList.push(item.get(key2))
        }
    })
    return newList;
}

/**
 *  根据指定键值获取数组中所有相同项，并返回由相同项中指定的键值组成的数组
 * @param list
 * @param key
 * @param value
 */
export function getListKeyByKey(list, key1, value,key2) {
    let newList = [];
    list.map(item=>{
        if(item.get(key1) == value){
            newList.push(item.get(key2))
        }
    })
    return newList;
}

/**
 * 根据键值搜索不为空项
 * @param list
 * @param key
 */
export function getObjectByKey2(list, key) {
    for(var i=0;i<list.size;i++){
        if(list.getIn([i,key]) != ''){
            return list.get(i);
        }
    }
    return null;
}
/**
 * 通过键值删除某一项
 * @param list
 * @param key
 * @param value
 */
export function spliceObjectByKey(list, key, value) {
    let _list = [];
    for (let i = 0; i < list.size; i++) {
        if (list.getIn([i, key]) == value) {
            _list = list.splice(i, 1);
            break;
        }
    }
    return _list;
}

/**
 * 获取对象中最大键值,键值key是数字型
 * @param object
 * @returns {*}
 */
export function getObjectMaxKey(object) {
    var arr = [];
    for(var [key, value] of object){
        arr.push(key);
    }

    if(arr.length <=0){
        return 0;
    }

    return arr.pop();
}

/**
 * 数组中是否存在
 * @param list
 * @param value
 * @constructor
 */
export function IsExitInArray(list, value) {
    var index = list.indexOf(value)
    if(index > -1){
        return true;
    }

    return false;
}

/**
 * 删除数组中某个值
 * @param list
 * @param value要删除值
 */
export function spliceInArray(list, value) {
    let index = list.indexOf(value);
    if(index >= 0){
        list.splice(index, 1);
    }
}

export function getRandom(max) {
    return Math.floor(Math.random()*max);
}

/**
 *  数组中项是否合法
 * @param list
 * @constructor
 */
export function IsValidate(list) {
    for(var i=0;i<list.size;i++){
        if(!list.get(i)){
            return false;
        }
    }

    return true;
}


/**
 *  深赋值
 * @param source 
 */
export function DeepCopy(source) {
    var dataCopy = source instanceof Array ? []:{};
    $.extend(true, dataCopy, source);
    return dataCopy;
}

/**
 *
 */
export function StringIsHaveBlank(str) {
    var patt = (/\s/g)
    if (patt.test(str)) {
        return true;
    }

    return false;
}

/**
 * 
 * @param {Array} arr 
 * @param {Function} accessor 
 * @param {*} value
 * @return {Boolean}
 */
export function IsExistInArray1(arr, accessor, value) {
    if (arr.length == 0) {
        return false;
    }

    if( !(accessor instanceof Function) ) {
        throw(new Error('accessor must be a function'));
    }

    for(let i=0, len=arr.length; i < len; i++) {
        if(accessor(arr[i]) == value) {
            return true;
        }
    }
    return false;
}