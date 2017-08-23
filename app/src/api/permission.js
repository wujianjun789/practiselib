import {httpRequest,HOST_IP,getHttpHeader} from '../util/network'

export function requestUserData(offset=-1,limit,cb,username){
    let headers = getHttpHeader();
    let obj = {"offset":offset,"limit":limit}
    if(username){
        obj = Object.assign({"where":{username:{like:username}}}, obj);
    }
    let param = JSON.stringify(obj);
    let url = HOST_IP+'/users?filter='+encodeURIComponent(param);
    httpRequest(url,{
        headers: headers,
        method: "GET"
    },response=>{
        cb && cb(response)
    }
    )
}

export function getUserById(userId,cb){
    let headers = getHttpHeader();
    httpRequest(`${HOST_IP}/users/${userId}?filter=${encodeURIComponent(JSON.stringify({include:["role"]}))}`, {
        method: 'GET',
        headers: headers,
      }, response=>{
        cb && cb(response)
      })
}

export function addUser(datas,cb){ 
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/users',{
        headers: headers,
        method: 'POST',
        body: JSON.stringify(datas)
    }, response=>{
        cb && cb()
    })

}

export function editUser(datas,cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/users/'+datas.id,{
        headers: headers,
        method: 'PATCH',
        body: JSON.stringify(datas)
    }, response=>{
        cb && cb()
    })
}

export function deleteUser(id, cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/users/'+id,{
        headers: headers,
        method: 'DELETE',
    }, response=>{
        cb && cb()
    },null, error=>{

    }, null, "unresolved")
}

export function getUserDomainList(userId,cb){
    let headers = getHttpHeader();
    let param = JSON.stringify({"include":["domains"]});
    httpRequest(HOST_IP+'/users/'+userId+'?filter='+encodeURIComponent(param),{
        headers: headers,
        method: 'GET'
    }, response=>{
        cb && cb(response)
    })
}

export function updateUserDomain(userId,domainIds,cb){
    let headers = getHttpHeader();
    httpRequest(HOST_IP+'/users/'+userId+'/domains',{
        headers: headers,
        method: 'PUT',
        body:JSON.stringify(domainIds)
    }, response=>{
        cb && cb()
    })
}