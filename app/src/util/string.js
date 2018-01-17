/**
 * Created by a on 2017/2/22.
 */
/**
 *  字符串是否为空
 */
export function validateStr(str) {
    if(str.replace(/(^s*)|(s*$)/g, "").length == 0){
        return false;
    }

    return true;
}

/**
 * 混合中英文处理
 * @param value
 * @returns {Array}
 */
export function getStringlistByLanguage(value) {
    let strs = [];

    if(!value){
        return strs;
    }

    for(var i=0;i<value.length;i++){
        let s = value.charAt(i);

        if(strs.length == 0){
            strs[0] = "";
        }

        let p = strs[strs.length-1];
        if(validChinaStr(s)){
            if(!p || validChinaStr(p)){
                strs[strs.length-1] = strs[strs.length-1]+s;
            }else{
                strs[strs.length] = ""+s;
            }

        }else{
            if(!p || validEnglishStr(p)){
                strs[strs.length-1] = strs[strs.length-1]+s;
            }else{
                strs[strs.length] = ""+s;
            }
        }
    }

    return strs;
}

export function validEnglishStr(str) {
    return /^[a-zA-Z]/.test(str);
}

export function validChinaStr(str) {
    return /^[\u4e00-\u9fa5]/.test(str);
}

export function getRequestParam() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return theRequest;
}

export function getRequestValue(key) {
    let request = getRequestParam();
    return request[key];
}

/**
 *
 * @param str(YYYY-MM-DD)
 * @param IsHave
 * @returns {*}(-年-月-日)
 */
export function dateStringFormat(str, IsHaveYear=true) {
    if(!str)return "";
    let strList = str.split("-");
    if(!strList || strList.length<2)return "";

    if(!IsHaveYear && strList.length==2){
        return strList[0]+"月"+strList[1]+"日"
    }

    if(IsHaveYear && strList.length==3){
        return strList[0]+"年"+strList[1]+"月"+strList[2].split("T")[0]+"日"
    }
    return "";
}

/**
 *
 * @param value(月或日)
 * @returns {*}
 */
export function dateAddZero(value) {
    let newValue = parseInt(value);
    return newValue<10?"0"+newValue:newValue;
}