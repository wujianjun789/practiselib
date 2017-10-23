/**
 * Created by a on 2017/10/19.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

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