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

export function getSearchAssets(domain, model, name, offset, limit, cb) {
    let headers = getHttpHeader();

    let paramStr = JSON.stringify({"include":["extend"],"where":getSearchParam(domain, model, name),"offset":offset,"limit":limit})

    httpRequest(HOST_IP+'/assets?filter='+paramStr, {
        headers: headers,
        method: 'GET'
    }, response=>{
        // console.log(response);
        cb && cb(response);
    })
}

export function getSearchCount(domain, model, name, cb) {
    let headers = getHttpHeader();

    let paramStr = JSON.stringify(getSearchParam(domain, model, name))
    httpRequest(HOST_IP+'/assets/count?where='+paramStr, {
        headers: headers,
        method: 'GET'
    }, response=>{
        // console.log(response);
        cb && cb(response);
    })
}

function getSearchParam(domain, model, name) {
    let param = {}
    // if(domain){
    //     Object.assign(param, {"domain":domain})
    // }
    // if(model){
    //     Object.assign(param, {"model":model})
    // }
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