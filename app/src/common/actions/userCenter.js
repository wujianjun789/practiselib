import {AUTH} from '../../authentication/actionTypes'
import {httpRequest, HOST_IP, getHttpHeader} from '../../util/network';
import { getAuth, clearAuth} from '../../authentication/auth';

export const confirmExit = (successFun, errFun) => dispatch => {
    return httpRequest(`${HOST_IP}/users/logout`,{
        method: 'POST',
        headers: getHttpHeader()
    }, () => {
        successFun && successFun();
        logout(dispatch);
    }, null, () => {
        errFun && errFun();
        logout(dispatch);
    });
}

export const modifyPassword = ({oldPw, newPw}, successFun, errFun) => dispatch => {
    let headers = getHttpHeader();
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let data = `oldPassword=${encodeURIComponent(oldPw)}&newPassword=${encodeURIComponent(newPw)}`;
    httpRequest(`${HOST_IP}/Users/change-password`, {
        headers: headers,
        method: 'POST',
        body: data
    },(response)=>{
        successFun && successFun(response);
        logout(dispatch);
    }, null, (errRes)=>{
        errFun && errFun(errRes);
    }, null)
}

export const logout = (dispatch)=>{
    clearAuth();
    dispatch({ type: AUTH, auth: getAuth()});
}