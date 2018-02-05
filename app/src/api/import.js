import { HOST_IP, getHttpHeader, httpRequest } from '../util/network';

export function bacthImport(key, data, isUpdate, cb) { //批量导入设备，如果isUpdate为true,覆盖原有设备
    let headers = getHttpHeader();
    let url = HOST_IP + '/' + key + '/import?options=' + encodeURIComponent(JSON.stringify(
        { "existProc": isUpdate ? "update" : "ignore" }));

    httpRequest(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response => {
        cb && cb();
    })
}


/**
 *  更换设备使用的API，可以用import替代，前提是默认update
 * */
export function replaceDevice(key, data, cb) {
    let headers = getHttpHeader();
    let url = HOST_IP + '/' + key + '/import?options=' + encodeURIComponent(JSON.stringify(
        { "existProc": "update" }));

    httpRequest(url, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response => {
        cb && cb();
    })
}