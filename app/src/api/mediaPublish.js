/**
 * Created by a on 2017/10/19.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

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


export function addProjectList(data, cb) {
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

export function updateProjectList(data, cb) {
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

export function delProjectList(data, cb) {
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

export function updatePlayerOrdersById(data, cb) {
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

export function updateScene(data, cb) {
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

export function delScene(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/scenes/'+data.id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}

export function getZoneList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getZone(id, cb) {
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

export function updateZone(data, cb) {
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

export function delZone(data, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/zones/'+data.id,{
        headers: headers,
        method: 'DELETE'
    }, response=>{
        cb && cb(response);
    })
}