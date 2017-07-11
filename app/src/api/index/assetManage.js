/**
 * Created by a on 2017/7/11.
 */
import {getHttpHeader, httpRequest} from '../../util/network'

export function getAssetManageModule(cb) {
    let headers = getHttpHeader();
    httpRequest('/', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getDeviceProperty(cb) {
    let headers = getHttpHeader();
    httpRequest('/', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}