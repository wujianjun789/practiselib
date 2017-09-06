/**
 * Created by a on 2017/9/6.
 */
import {HOST_IP,getHttpHeader,httpRequest} from '../util/network';

export function getPoleList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/poles', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getPoleListByName(name) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/poles?filter='+encodeURIComponent(JSON.stringify({"where":{name:{like:name}}})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getPoleListByDomainName(domainName) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/poles?filter='+encodeURIComponent(JSON.stringify({"where":{domainName:{like:domainName}}})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}