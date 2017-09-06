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

export function getPoleListByModelWithName(model, name, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(JSON.stringify({"include":["extend"],"where":getSearchParam(model, name)})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

function getSearchParam(model, name) {
    let param = {};
    if(model){
        Object.assign(param, {"extendType":model})
    }
    if(name){
        Object.assign(param, {"name":{"like":name}})
    }

    return param;
}
/**
 * @param id(pole id)
 */
export function getPoleAssetById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/poles/'+id+'/assets',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(id, response);
    })
}

export function getPoleListByModelDomainId(model, domainId) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(JSON.stringify({"include":["extend"],"where":{domainId:domainId}})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}