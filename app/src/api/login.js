/**
 * Created by a on 2017/7/26.
 */
import {USERCENTER_POPUP_CONFIRM_LOGIN} from '../common/actionTypes/userCenter';
import {login} from '../util/network';
import {setCookie} from '../util/cache'

export const loginHandler = (username, password,cbSuccess,cbFail) => dispatch => {
    if(username.length <= 2 || password.length <= 4){
        cbFail && cbFail();
        return;
    }

    login({username:username, password:password}, response=>{
        console.log(response)
        setCookie("user", response)
        dispatch({ type: USERCENTER_POPUP_CONFIRM_LOGIN });
        cbSuccess && cbSuccess();
    }, err=>{
        cbFail && cbFail();
    })

}