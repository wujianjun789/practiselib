import {httpRequest, HOST_IP, getHttpHeader} from '../util/network';
import {getCookie} from '../util/cache';

const modifyPassword = ({oldPw: oldPassword, newPw: newPassword}, successFun, errFun) => {
    let {access_token} = getCookie('user');
    let headers = {
        Accept: 'application/json',
        Authorization: access_token,
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    let data = `oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}`
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

const logout = () => {

}

export {modifyPassword, logout};