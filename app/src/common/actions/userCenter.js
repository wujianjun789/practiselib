import {LOGED_OUT} from '../../authentication/actionTypes'
import {httpRequest, HOST_IP, getHttpHeader} from '../../util/network';
import {getCookie} from '../../util/cache';

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
        dispatch({ type: LOGED_OUT });
    },null,()=>{errFun && errFun()});
}