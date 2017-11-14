/**
 * Created by a on 2017/10/19.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

//播放方案
export function searchProjectList(type, projectName, offset, limit, cb) {
    let headers = getHttpHeader();
    let obj = {"offset":offset, "limint":limit}
    if(projectName){
        obj = Object.assign({"where":{type:type, name:{like:projectName}}}, obj);
    }

    let param = JSON.stringify(obj);
    let url = HOST_IP+'/projects?filter='+encodeURIComponent(param);
    httpRequest(url,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getProjectList(cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects';
    httpRequest(url,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getProjectById(data, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects/'+data.id;
    httpRequest(url,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getProjectPreviewById(data, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects/'+data.id+'/preview';
    httpRequest(url,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}


export function addProject(data, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects';
    httpRequest(url,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateProjectById(data, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects/'+data.id;
    httpRequest(url,{
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function delProjectById(data, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/projects/'+data.id;
    httpRequest(url,{
        headers: headers,
        method: 'DELETE',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

//播放表
export function getPlayerList(cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/programs';
    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getPlayerById(id, cb) {
    let headers = getHttpHeader();

    let url = HOST_IP+'/programs/'+id;
    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addPlayer(data, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/programs', {
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updatePlayerById(data, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/programs/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updatePlayerOrders(data, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/programs/orders',{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function delPlayerById(data, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/programs/'+data.id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

//场景
export function getSceneList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
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

export function addScene(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateSceneById(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateSceneOrders(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/orders/'+data.id,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function delSceneById(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+data.id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

//区域
export function getZoneList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getZoneById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones/'+id,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addZone(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateZoneById(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateZoneOrders(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones/orders',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function delZoneById(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones/'+data.id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

//播放项
export function getItemList(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getItembyId(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items/'+id,{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getItemPreviewbyId(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items/'+id+'/preview',{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function addItem(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateItemById(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items/'+data.id,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function updateItemOrders(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items/orders',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function delItemById(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/items/'+id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}