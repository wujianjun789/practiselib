import {HOST_IP, getHttpHeader, httpRequest} from '../util/network';

export function bacthImport(key,data,isUpdate){
    let headers = getHttpHeader();
    let url = HOST_IP+'/'+key+'/import?options='+encodeURIComponent(JSON.stringify({"existProc":isUpdate?"update":"ignore"}));
    
    httpRequest(url,{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(data)
    }, response=>{
        cb && cb(response);
    })
}