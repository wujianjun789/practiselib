/**
 * Created by a on 2017/9/6.
 */
import { HOST_IP, getHttpHeader, httpRequest } from '../util/network';

export function getSceneList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP + '/scenes', {
        headers: headers,
        method: 'GET'
    }, response => {
        cb && cb(response);
    })
}

export function getSearchScene(name, offset, limit, cb) {
    let headers = getHttpHeader();
    let paramStr = JSON.stringify({"where":getSearchParam(name),"offset":offset,"limit":limit})
    httpRequest(HOST_IP+'/scenes?filter='+encodeURIComponent(paramStr),{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getSearchSceneCount(name, cb) {
    let headers = getHttpHeader();
    let paramStr = JSON.stringify({"where":getSearchParam(name)})
    httpRequest(HOST_IP+'/scenes/count?filter='+encodeURIComponent(paramStr),{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getSearchParam(name) {
    let param = {};
    if(name){
        param = Object.assign({}, {name:name});
    }

    return param
}
export function getSceneById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function updateSceneById(id, data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function addScene(data, cb) {
    let headers = getHttpHeader();
    let dat = {name: data.name, presets:"" }
    httpRequest(HOST_IP+'/scenes',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function getSceneDeviceById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id+'/controls',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addDeviceToSceneById(id, data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id+'/controls',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function getSceneDeviceByIdWidthAssetId(id, assetId, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id+'/controls/'+assetId,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function updateSceneDeviceByIdWidthAssetId(id, assetId, data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+id+'/controls/'+assetId,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

