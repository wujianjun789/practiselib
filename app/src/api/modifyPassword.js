import {httpRequest, HOST_IP, getHttpHeader} from '../util/network';
import {getCookie} from '../util/cache';

const modifyPassword = ({oldPw: oldPassword, newPw: newPassword}, successFun, errFun) => {
    let {id} = getCookie('user');
    let headers = {
        Accept: 'application/json',
        Authorization: id,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    let data = `oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
    httpRequest(`${HOST_IP}/Users/change-password`, {
        headers: headers,
        method: 'POST',
        body: data
    },(response)=>{
        successFun && successFun(response)
    },null,(errRes)=>{
        errFun && errFun(errRes);
    },null)
}

export {modifyPassword};