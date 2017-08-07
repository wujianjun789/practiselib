import {
    USERCENTER_POPUP_CONFIRM_EXIT
} from '../actionTypes/userCenter';
import {httpRequest, HOST_IP, getHttpHeader} from '../../util/network';
import {getCookie} from '../../util/cache';

export const confirmExit = (cb) => dispatch => {
    console.log(getCookie('user'));
    let {id} = getCookie('user');
    let headers = {
        Accept: 'application/json',
        Authorization: id,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };
    console.log(headers);
    return httpRequest(`${HOST_IP}/users/logout`,{
        method: 'POST',
        headers: headers
    }, () => {
        cb && cb();
        dispatch({ type: USERCENTER_POPUP_CONFIRM_EXIT });
    });
}