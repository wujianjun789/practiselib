import {AUTH} from '../../authentication/actionTypes'
import {httpRequest, HOST_IP, getHttpHeader} from '../../util/network';
import {getCookie, setCookie} from '../../util/cache';
import { getAuth, clearAuth} from '../../authentication/auth';
export const confirmExit = (successFun, errFun) => dispatch => {
    let {id} = getCookie('user');
    let headers = {
        Accept: 'application/json',
        Authorization: id,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    return httpRequest(`${HOST_IP}/users/logout`,{
        method: 'POST',
        headers: headers
    }, () => {
        successFun && successFun();
        logout(dispatch);
    },null,()=>{
        errFun && errFun();
        logout(dispatch);
    });
}

export const logout = (dispatch)=>{
    clearAuth();
    dispatch({ type: AUTH, auth: getAuth()});
}