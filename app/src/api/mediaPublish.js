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


export function searchPlayerList(type, assetName, offset, limit, cb) {
    let headers = getHttpHeader();
    let obj = {"offset":offset,"limit":limit}
    if(domainName){
        obj = Object.assign({"where":{type:type, name:{like:assetName}}}, obj);
    }
    let param = JSON.stringify(obj);
    let url = HOST_IP+'/playerList?filter='+encodeURIComponent(param);

    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function playerPublishByPlayerId(playerId, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/player/publish/'+playerId, {
        headers: headers,
        method: 'PUT'
    }, response=>{
        cb && cb(response);
    })
}

export function updatePlayerByPlayerId(playerId, data, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/player/'+playerId,{
        headers: headers,
        method: 'PUT',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}

export function removePlayerByPlayerId(playerId, cb) {
    let headers = getHttpHeader();

    httpRequest(HOST_IP+'/player/'+playerId,{
        headers: headers,
        method: 'DELETE',
    }, response=>{
        cb && cb(response);
    })
}