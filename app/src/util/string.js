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