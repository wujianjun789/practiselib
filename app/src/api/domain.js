/**
 * Created by a on 2017/7/26.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network'
export function getDomainList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}