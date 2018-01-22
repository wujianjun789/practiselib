/**
 * Created by a on 2017/7/26.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';
import {DOMAIN_LEVEL} from '../common/util/index';

export function getDomainList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getParentDomainList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains?filter='+encodeURIComponent(JSON.stringify({"where":{level:{neq:DOMAIN_LEVEL}}})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response)
    })
}

export function getChildDomainList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains?filter='+encodeURIComponent(JSON.stringify({"where":{level:DOMAIN_LEVEL}})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response)
    })
}

export function getDomainByDomainLevelWithCenter(domainLevel, map, cb) {
    let headers = getHttpHeader();
    let nearParam = {maxDistance: map.distance/1000,unit:'kilometers'}
    if(domainLevel==1){
        nearParam = {};
    }

    httpRequest(HOST_IP+'/domains?filter='+encodeURIComponent(JSON.stringify({"where": {geoPoint: Object.assign({}, {near: map.center}, nearParam), level:domainLevel}})),{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })

}

export function getDomainById(id,cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+id, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getDomainListByName(domainName, offset, limit, cb) {
    let headers = getHttpHeader();
    let obj = {include:["parent"], "offset":offset,"limit":limit}
    if(domainName){
        obj = Object.assign({"where":{name:{like:domainName}}}, obj);
    }
    let param = JSON.stringify(obj);
    let url = HOST_IP+'/domains?filter='+encodeURIComponent(param);

    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getDomainCountByName(domainName, cb) {
    let headers = getHttpHeader();
    let param = JSON.stringify({name:domainName})
    let url = '';
    if(domainName){
        url = HOST_IP+'/domains/count?where='+encodeURIComponent(param);
    }else{
        url = HOST_IP+'/domains/count';
    }

    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addDomain(domain, cb, err) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(domain)
    }, response=>{
        cb && cb(response)
    }, null, error=>{
        err && err(error);
    })
}

export function updateDomainById(domain, cb, err) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+domain.id,{
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify(domain)
    }, response=>{
        cb && cb(response)
    }, null, error=>{
        err && err(error);
    })
}

export function deleteDomainById(domainId, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+domainId,{
        headers: headers,
        method: 'DELETE',
    }, response=>{
        cb && cb(response)
    },null, error=>{

    }, null, "unresolved")
}

export function getDomainListByParentId(parentId, cb){
    let headers = getHttpHeader();
    let param = JSON.stringify({where:{parentId:parentId}})
    httpRequest(HOST_IP+'/domains?filter='+encodeURIComponent(param), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(parentId, response)
    })
}

export function getRelatedDomainById(id,cb){
    let headers = getHttpHeader();
    let param = JSON.stringify({include:['children']});
    httpRequest(`${HOST_IP}/domains/${id}?filter=${encodeURIComponent(param)}`, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}



export function getWhiteListById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(`${HOST_IP}/gateways/${id}/whiteList`, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 
 * @param {Number} gatewayId 
 * @param {Number} lcId 
 * @param {Function} cb 
 */
export function addLcToWhiteListById(gatewayId, lcId, cb) {   
    let headers = getHttpHeader();
    httpRequest(`${HOST_IP}/assets/${lcId}`,{
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify({'gatewayId':gatewayId})
    }, response=>{
        cb && cb(response)
    })
}

/**
 * 
 * @param {Number} gatewayId 
 * @param {Number} lcId 
 * @param {Function} cb 
 */
export function delLcFromWhiteListById(gatewayId, lcId, cb) {
    let headers = getHttpHeader();
    httpRequest(`${HOST_IP}/assets/${lcId}`,{
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify({'gatewayId':null})
    }, response=>{
        cb && cb(response)
    })
}

export function requestWhiteListCountById(gatewayId, cb) {
    let headers = getHttpHeader();
    httpRequest(`${HOST_IP}/gateways/${gatewayId}/whiteList/count`, {
        headers: headers,
        method: 'GET',
    }, response=>{
        cb && cb(response)
    })
}