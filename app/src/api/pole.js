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

/**
 *  地图搜索
 * @param type
 * @param model
 * @param searchValue
 * @param cb
 */
export function getPoleListByModelWithName(searchType, model, searchValue, cb) {
    let headers = getHttpHeader();
    if(searchType == "domain"){

    }

    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(JSON.stringify({"include":["extend"],"where":getSearchParam(searchType, model, searchValue)})), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

function getSearchParam(searchType, model, searchValue) {
    let param = {};
    if(searchType == "domain"){
        if(model){
            Object.assign(param, {"extendType":model})
        }
        if(searchValue){
            Object.assign(param, {"domainId":searchValue})
        }
    }else{
        if(model){
            Object.assign(param, {"extendType":model})
        }
        if(searchValue){
            Object.assign(param, {"name":{"like":searchValue}})
        }
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