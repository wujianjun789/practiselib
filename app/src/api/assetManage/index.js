/**
 * Created by a on 2017/7/11.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../../util/network'

export function getAssetModel(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'model-summaries', {
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