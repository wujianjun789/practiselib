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

    let paramStr = JSON.stringify({"include":["extend"],"where":param,"offset":offset,"limit":limit})

    httpRequest(HOST_IP+'/assets?filter='+paramStr, {
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