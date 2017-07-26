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

export function getDomainListByName(domainName, cb) {
    let headers = getHttpHeader();
    let param = JSON.stringify({"where":{name:domainName}})
    let url = '';
    if(domainName){
        url = HOST_IP+'/domains?filter='+param;
    }else{
        url = HOST_IP+'/domains';
    }
    
    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addDomain(domain, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(domain)
    }, response=>{
        cb && cb(response)
    })
}

export function updateDomainById(domain, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+domain.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(domain)
    }, response=>{
        cb && cb(response)
    })
}

export function deleteDomainById(domainId, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+domainId,{
        headers: headers,
        method: 'DELETE',
    }, response=>{
        cb && cb(response)
    })
}