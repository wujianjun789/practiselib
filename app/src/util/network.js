/**
 * Created by RJ on 2016/6/14.
 */
import 'isomorphic-fetch';
import 'es6-promise'

import { getCookie } from './cache'
import {getRequestValue} from './string'

let  HEADERS_CONTENT_TYPE_JSON = { "Accept": "application/json", "Content-Type": "application/json" };

export const statusCode = {
    1000: 'network_status_code_1000'
}

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

    var args = Array.prototype.slice.call(arguments);
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

    if(args.indexOf('unresolved') > -1){
        return fetch(url, option).then((response)=>{
            responseCall && responseCall.apply(null, [response]);
        }).catch((error)=>{
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
            if (!response.ok) {
                return Promise.reject(json)
            }

            responseCall && responseCall.apply(null, [json, response, responseParam]);

        }).catch(function (error) {

            errorCall && errorCall.apply(null, [error, errorParam]);
        })
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else if (statusCode[response.status]) {
        return response;
    } else {
        return parseJSON(response).then(({json,response}) => {
            var error = new Error(json && json.message || response.status);
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
    }else{
        return new Promise((resolve)=>{
            resolve({response})
        })
    }
}

export function getHttpHeader(data) {
    return Object.assign({}, HEADERS_CONTENT_TYPE_JSON, Object.assign(getToken(), data), {userId:getParam()})
}

export function getParam() {
    let value = getRequestValue('userId');
    return value;
}

export function getToken() {
    let user = getCookie('user');
    return {
        Authorization: 'Bearer ' + (user ? user.token : '')
    }
}

export function login(data, responseCall, errCall) {
    httpRequest('/login', {
        method: 'POST',
        headers: HEADERS_CONTENT_TYPE_JSON,
        credentials: 'same-origin',
        body: JSON.stringify({
            name: data.name,
            password: data.password
        })
    }, function (response) {
        // console.log(response);
        // alert(response);
        if (response.success == true) {
            responseCall && responseCall.apply(null);
        } else {
            errCall && errCall.apply(null);
        }
    }, 'success', function (response) {
        errCall && errCall.apply(null);
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