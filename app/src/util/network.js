/**
 * Created by RJ on 2016/6/14.
 */
import 'isomorphic-fetch';
import 'es6-promise'

import { setCookie, getCookie } from './cache'
import {getRequestValue} from './string'

export let HOST_IP = getCookie("host_ip");
export const HOST_IP_FILE = "http://192.168.155.196:3001";

let  HEADERS_CONTENT_TYPE_JSON = { "Accept": "application/json", "Content-Type": "application/json" };

export const statusCode = {
    1000: 'network_status_code_1000'
}

const errorCode = {
    [HOST_IP+"/users/login"]: 1
}

export let timeOut = {};
/**
 *  url 请求路径
 *  option 头信息、请求类型等
 *  resonseCall 正确回调
 *  responseParam 正确回调参数
 *  errorCall 错误回调
 *  errorParam 错误回调参数
 *  unresolved 代表需要用户手动处理,返回response
 */
export function httpRequest(url, option, responseCall, responseParam, errorCall, errorParam) {
    let args = Array.prototype.slice.call(arguments);
    if (option) {
        // option.redirect = !!option.redirect?option.redirect:'same-origin';
        option.mode = !!option.mode ? option.mode : 'cors';
        //option.cache = !!option.cache?option.cache:'default';
    }

    if (option.cache == "no-cache") {//cache(default,no-store,reload, no-cache,force-cache,only-if-cached
        if(url.indexOf('?')>-1){
            url += `&v=${new Date().getTime()}`
        }else{
            url += `?v=${new Date().getTime()}`
        }
    }

    Promise.race([new Promise((resolve, reject)=>{
        if(args.indexOf('unresolved') > -1){
            return fetch(url, option).then((response)=>{
                responseCall && responseCall.apply(null, [response]);
            }).catch((error)=>{
                alertPopup(error);
                errorCall && errorCall.apply(null, [error, errorParam]);
            })
        }

        fetch(url, option)
            .then(checkStatus)
            .then(parseJSON)
            .then(({
                json,
                response
            }) => {
                // if (!response.ok) {
                //     return Promise.reject(json)
                // }
                responseCall && responseCall.apply(null, [json, response, responseParam]);

            }).catch(function (error) {
                errorCall && errorCall.apply(null, [error, errorParam]);
        })
    }), new Promise((resolve, reject)=>{
        if(timeOut[url]){
            clearTimeout(timeOut[url]);
        }

        timeOut[url] = setTimeout(()=>{
            errorCall && errorCall.apply(null, [err]);
            let err = {"statusCode": 408,"name":"Error", "message":"Request Timeout"}
            // alertPopup(err.message);
            throw err;
        }, 30000)
    })]).then(resolve=>{

    }, reject=>{

    })
}

function checkStatus(response) {
    for(let ti in timeOut){
        clearTimeout(timeOut[ti]);
    }

    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        return parseJSON(response).then(({json, response}) => {
            const errorJson = json && json.error;

            if(!errorCode[response.url]){
                alertPopup(errorJson?errorJson.message:response);
            }

            var error = new Error(errorJson && errorJson.message || response.status);
            throw error;
        })
    }
}

function parseJSON(response) {
    if(response.statusText == "OK"){
        return response.json().then(json => {
                return new Promise((resolve) => {
                    resolve({json,response})
                })
            }
        )
    }else if(response.status >= 200 && response.status < 300 && response.statusText == "No Content") {
        return new Promise((resolve, reject)=>{
            resolve({undefined, response});
        });
    }
    else{
        return response.json().then(json=>{
            return new Promise((resolve)=>{
                resolve({json, response});
            })
        }, error=>{
            return new Promise((resolve, reject)=>{
                reject({undefined, response});
            })
        })
    }
}

export function getHostIP() {
    if(!HOST_IP){
        HOST_IP = getCookie("host_ip");
    }
    return HOST_IP;
}

export function getHttpHeader(data) {
    let object = {};
    let token = getToken();
    if(token && data){
        object = Object.assign(token, data)
    }else if(token && !data){
        object = token
    }else if(!token && data){
        object = data;
    }

    return Object.assign({}, HEADERS_CONTENT_TYPE_JSON, object, {userId:getParam()})
}

export function getParam() {
    let value = getRequestValue('userId');
    return value;
}

export function getToken() {
    let user = getCookie('user');

    if(user){
        return {
            Authorization: `${user['id']}`
        }
    }
    else{
        // if(location && location.hostname)
        //     {
        //         location.href="http://"+location.hostname+":8080/login"
        //     }

            return null
    }

}

export function alertPopup(response) {
    if(typeof response === 'string'){
        console.log(response);
    }else{
        response && parseJSON(response).then(({json, response}) => {
            const errorJson = json && json.error;
            errorJson && console.log(errorJson.message);
        }).catch(error=>{
            console.log(response.statusText?response.statusText:statusCode[response.statusCode]);
        })
    }
}

export function getConfig(cb) {
    if(getCookie("host_ip")){
        return cb && cb();
    }

    httpRequest('/config',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        const host_ip = "http://"+(response.host?response.host:location.hostname)+":"+response.port+response.path;
        setCookie("host_ip",host_ip);
        cb && cb();
    })
}

let mapConfig = null;
export function getMapConfig(responseFun, errorFun) {
    if(mapConfig){
        return responseFun && responseFun.apply(null, [mapConfig]);
    }
    httpRequest('/config/map',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        mapConfig = response;
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errorFun && errorFun.apply(null, [error]);
    })
}

let domainConfig = null;
export function getDomainConfig(responseFun, errFun) {
    if(domainConfig){
        return responseFun && responseFun.apply(null, [domainConfig]);
    }
    httpRequest('/config/domain',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        domainConfig = response;
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

let userId = "";
let moduleConfig = null;
export function getModuleConfig(user, responseFun, errFun) {
    if(user && user.id === userId && moduleConfig){
        return responseFun && responseFun.apply(null, [moduleConfig]);
    }

    userId = user.id;

    httpRequest('/config/module?user='+encodeURIComponent(JSON.stringify(user)),{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        moduleConfig = response;
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

let moduleDefaultConfig = null;
export function getModuleDefaultConfig(responseFun, errFun) {
    if(moduleDefaultConfig){
        return responseFun && responseFun.apply(null, [moduleDefaultConfig]);
    }
    httpRequest('/config/moduleDefault',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        moduleDefaultConfig = response;
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

let modelConfig = null;
export function getModelConfig(responseFun, errFun) {
    if(modelConfig){
        return responseFun && responseFun.apply(null, [modelConfig]);
    }
    httpRequest('/config/model',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        modelConfig = response;
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

export function getStrategyDeviceConfig(responseFun, errFun) {
    httpRequest('/config/strategyDevice',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

export function getMediaPublishPreview(responseFun, errFun) {
    httpRequest('/config/mediaPublish/preview', {
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

export function getMediaPublishPreviewJson(url, responseFun, errFun) {
    httpRequest(url, {
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

export function getLightLevelConfig(responseFun, errFun) {
    httpRequest('/config/lightLevel',{
        method: 'GET',
        headers: HEADERS_CONTENT_TYPE_JSON
    }, function (response) {
        responseFun && responseFun.apply(null, [response]);
    }, 'sucess', function (error) {
        errFun && errFun.apply(null, [error]);
    })
}

export function login(data, responseCall, errCall) {
    let host = getHostIP();
    httpRequest(`${host}/users/login`, {
        method: 'POST',
        headers: HEADERS_CONTENT_TYPE_JSON,
        credentials: 'same-origin',
        body: JSON.stringify({
            username: data.username,
            password: data.password
        })
    }, function (response) {
        if (response.id) {
            responseCall && responseCall.apply(null,[response]);
        } else {
            errCall && errCall.apply(null, ['undefined user id']);
        }
    }, 'success', function (error) {
        errCall && errCall.apply(null, [error]);
    })

}

export function logout(responseFun) {
    httpRequest('/logout', {
        method: 'POST',
        headers: HEADERS_CONTENT_TYPE_JSON,
        credentials: 'same-origin'
    }, function (response) {
        responseFun && responseFun.apply(null);
    })
}

let socket = null;
let socketResponse = null;

function socketInit() {
    if (socket == null) {
        socket = new WebSocket('');
    }

    socket.onopen = function () {

    }

    socket.onerror = function () {
    }

    socket.onmessage = function (event) {
        if (socketResponse != null) {
            socketResponse(event.data);
        }
    }

    socket.onclose = function () {

    }
}

export function socketSend(data, responseCall) {
    socketResponse = responseCall;
    socketInit();
    socket.send(JSON.stringify(data));
}

export function socketClose() {
    socket && socket.close();
}