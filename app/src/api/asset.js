/**
 * Created by a on 2017/7/26.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network'

export function getAssetModelList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/model-summaries', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getSearchAssets(domainId, model, name, offset, limit, cb) {
    let headers = getHttpHeader();

    let paramStr = JSON.stringify({"include":["extend"],"where":getSearchParam(domainId, model, name),"offset":offset,"limit":limit})

    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        // console.log(response);
        cb && cb(response);
    })
}

export function getSearchCount(domainId, model, name, cb) {
    let headers = getHttpHeader();

    let paramStr = JSON.stringify(getSearchParam(domainId, model, name))

    httpRequest(HOST_IP+'/assets/count?where='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

function getSearchParam(domainId, model, name) {
    let param = {}
    if(domainId){
        Object.assign(param, {"domainId":domainId})
    }
    if(model){
        Object.assign(param, {"extendType":model})
    }
    if(name){
        Object.assign(param, {"name":name})
    }

    return param;
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