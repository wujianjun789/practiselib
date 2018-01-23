/**
 * Created by m on 2018/01/16.
 */
import {HOST_IP, getHttpHeader, httpRequest} from '../util/network'
// export function getDomainList(cb) {

// }



export function getEnergyDataByDomainId(id, energyFilter, cb) { //需要的参数：type, domainId, dateTime, variable
    let type = energyFilter.type;
    let dateTime = energyFilter.dateTime;
    let variable = energyFilter.variable;
    let headers = getHttpHeader();
    httpRequest(HOST_IP + '/domains/'+`${id}`+'/statistic?filter=' + encodeURIComponent(
        JSON.stringify({ "where":{"type": type, "dateTime": dateTime}}))),{
            headers: headers,
            method: 'GET'
        }, response => {
            cb && cb(response);
        }
}

//虽然请求的函数实际上是一样，但因回调函数不同，这里就分开三种分别请求了
export function getEnergy(id, type, dateTime, cb) {
    let headers = getHttpHeader();
    let string = JSON.stringify({ "where":{"type": type, "dateTime": dateTime}});
    httpRequest(HOST_IP + '/domains/'+id+'/statistic?filter=' + encodeURIComponent(string),{
        // httpRequest(HOST_IP + '/domains/'+`${id}`+'/statistic?filter=' + encodeURIComponent(string),{
            headers: headers,
            method: 'GET'
        }, response => {
            // console.log("response:", response);
            cb && cb(response)
        })
}






export function getDomainStatusByDomainId(id, cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+id+'/status', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response); 
    })
}





export function getDomainList(cb) {
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains', {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getDomainById(id,cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/domains/'+id, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}

export function getDomainListByName(domainName, offset, limit, cb) {
    let headers = getHttpHeader();
    let obj = {include:["parent"], "offset":offset,"limit":limit}
    if(domainName){
        obj = Object.assign({"where":{name:{like:domainName}}}, obj);
    }
    let param = JSON.stringify(obj);
    let url = HOST_IP+'/domains?filter='+encodeURIComponent(param);

    httpRequest(url, {
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response);
    })
}