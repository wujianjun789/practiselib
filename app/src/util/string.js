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