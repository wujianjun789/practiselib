/**
 * Created by a on 2017/8/17.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

/**
 *  通过策略类型和名字获取策略列表
 * @param model(时间、传感器、经纬度策略)
 * @param name
 * @param offset
 * @param limit
 */
export function getStrategyListByName(model,name,offset, limit, cb) {
    let headers = getHttpHeader();
    let param = {"offset":offset,"limit":limit};
    param = Object.assign({}, param, {"where":getStrategyParam(model, name)});
    let paramStr = JSON.stringify(param);
    let url = HOST_IP+'/strategies?filter='+encodeURIComponent(paramStr);

    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

/**
 *  通过策略类型和名字获取策略数量
 * @param model(时间、传感器、经纬度策略)
 * @param name
 * @param cb
 */
export function getStrategyCountByName(model, name, cb) {
    let headers = getHttpHeader();

    let paramStr = JSON.stringify(getStrategyParam(model, name))

    httpRequest(HOST_IP+'/strategies/count?where='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

function getStrategyParam(model,name) {
    let param = {}
    if(model){
        Object.assign(param, {type:model});
    }

    if(name){
        Object.assign(param, {"name":{"like":name}})
    }

    return param;
}

/**
 * 添加策略
 * @param data
 */
export function addStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 修改策略
 * @param data
 */
export function updateStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 删除策略
 * @param id
 */
export function delStrategy(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/strategies/'+id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

/**
 *  通过AssetControls获取设备
 * @param prop
 * @param mode
 * @param value
 */

export function getDeviceByAssetControls(prop, mode, value, cb) {
    let headers = getHttpHeader();
    let param = {};
    if(prop){
        param = Object.assign({}, param, {prop:prop});
    }
    if(mode){
        param = Object.assign({}, param, {mode:mode});
    }
    if(value){
        param = Object.assign({}, param, {value:value});
    }
    param ={where:param};
    let paramStr = JSON.stringify(param);
    httpRequest(HOST_IP+'/AssetControls?filter='+encodeURIComponent(paramStr),{
        headers:headers,
        method:"GET"
    },response=>{
        cb && cb(response, value);
    })
}

/**
 * 添加设备到策略
 * @param data
 */
export function addDeviceToStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/AssetControls',{
        headers: headers,
        method: "POST",
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 更新策略绑定设备
 * @param data
 */
export function updateDeviceToStrategy(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/AssetControls',{
        headers: headers,
        method: "PUT",
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}
