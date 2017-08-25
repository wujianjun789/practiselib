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

export const logout = (dispatch)=>{
    clearAuth();
    dispatch({ type: AUTH, auth: getAuth()});
}