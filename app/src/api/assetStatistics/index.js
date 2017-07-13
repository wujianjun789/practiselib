/**
 * Created by a on 2017/7/13.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../../util/network'

export function getSearchAssets(domain, name, cb) {
    let headers = getHttpHeader();
    let param = JSON.stringify({"include":"extend","where":{"domain":domain, "name":name}})
    httpRequest(HOST_IP+'/assets?filter='+param, {
        headers: headers,
        method: 'GET'
    }, response=>{
        // console.log(response);
        cb && cb(response);
    })
}

export function getAssetsCount(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/assets/count', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}