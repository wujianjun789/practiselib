/**
 * Created by a on 2017/7/26.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../../util/network'

export function getAssetModelList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/model-summaries', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

/**
 * 获取 model summary 通过 model ID
 * @param {String} modelID
 * @param {Function} cb
 * @return {Object}
 */
export function getModelSummariesByModelID(modelID, cb) {
	let response;
	const sensorList = [];
	switch(modelID) {
		case 'sensor':
			response = sensorList;
	}

	cb && cb(response);
}

export function getAssetList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/assets',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getSearchAssets(domainId, model, name, offset, limit, cb) {
	let response = [];
	cb && cb(response);
}

export function getSearchCount(domainId, model, name, cb) {
	const response = {count: 0};
	cb && cb(response);
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
        Object.assign(param, {"name":{"like":name}})
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

/**
 *
 * @param model(资产模型类型)
 */
export function getAssetsByModel(model, cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/'+model+'s', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response)
    })
}

export function getAssetsBaseByModel(model, cb){
    let headers = getHttpHeader();

    let paramStr = JSON.stringify({"where":getSearchParam('', model, "")})

    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getAssetsBaseById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/assets/'+id,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}
/**
 * 通过设备种类和域获取设备基本属性
 * @param model
 * @param name
 * @param cb
 */
export function getAssetsBaseByModelWithDomain(model, domainId, cb){
    let headers = getHttpHeader();

    let paramStr = JSON.stringify({"where":getSearchParam(domainId, model, "")})

    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}
/**
 *
 * @param model(资产模型类型)
 */
export function getAssetsCountByModel(model, cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/'+model+'s/count', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response)
    })
}

/**
 * 通过设备种类和名称获取设备基本属性
 * @param model
 * @param name
 * @param cb
 */
export function getAssetsBaseByModelWithName(model, name, cb) {
    let headers = getHttpHeader();
    let paramStr = JSON.stringify({"where":getSearchParam("", model, name)})
    httpRequest(HOST_IP+'/assets?filter='+encodeURIComponent(paramStr), {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}
/**
 * param data({modelId:设备型号})
 *
 */
export function postAssetsByModel(model, data, cb){
    let headers = getHttpHeader();
    let dat = {id:data.id, type:data.modelId, base:{name:data.name, geoPoint:{lat:data.lat, lng:data.lng}, extendType:model, domainId:data.domainId}};
    httpRequest(HOST_IP+'/'+model+'s', {
        headers: headers,
        method: 'POST',
        body:JSON.stringify(dat)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * param data({modelId:设备型号})
 *
 */
export function postXes(model, data, cb){
    let headers = getHttpHeader();
    let dat = {id:data.id, type:data.modelId, base:{name:data.name, geoPoint:{lat:data.lat, lng:data.lng}, extendType:model, domainId:data.domainId}};
    httpRequest(HOST_IP+'/xes', {
        headers: headers,
        method: 'POST',
        body:JSON.stringify(dat)
    }, response=>{
        cb && cb(response);
    })
}

/**
 * param data({modelId:设备型号})
 *
 */
export function updateAssetsByModel(model, data, cb) {
    let headers = getHttpHeader();
    let dat = {type:data.modelId};
    httpRequest(HOST_IP+'/'+model+'s/'+data.id, {
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify(dat)
    }, response=>{
        updateAssetsById(response.id, {name:data.name, geoPoint:{lat:data.lat, lng:data.lng}, extendType:model, domainId:data.domainId}, cb)
    })
}

export function updateXes(model,data, cb){
    let headers = getHttpHeader();
    let dat = {
        "geoType":0,
        name:data.name,
        geoPoint:{
            lat:data.lat,
            lng:data.lng
        },
        extendType:model,
        domainId:data.domainId
    };
    httpRequest(HOST_IP+'/assets/'+data.id,{
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify(dat)
    }, response=>{
        cb && cb(response);
    })
}

export function delAssetsByModel(model, id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/'+model+'s/'+id, {
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

export function delXes(model, id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/xes/'+id, {
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

export function updateAssetsById(id, data, cb){
    let headers = getHttpHeader();
    let dat = Object.assign({}, {"geoType":0}, data)
    httpRequest(HOST_IP+'/assets/'+id,{
        headers: headers,
        method: 'PATCH',
        body:JSON.stringify(dat)
    }, response=>{
        cb && cb(response);
    })
}

export function updateDataOrigin(data,key){

}

/**
 * 获取设备的状态
 * @param {String} model
 * @param {String | Number} id
 */
export const getDeviceStatusByModelAndId = (model, id) => cb => {
	const response = {};
	cb && cb(response);
}
