/**
 * Created by a on 2017/4/21.
 */
import {login} from '../../util/network';

import {
    STARRIVER_LOGIN_SUCCESS,
    STARRIVER_LOGIN_FAIL
} from '../actionType/index'
export function loginHandler(username, password) {
    return dispatch=>{
        if(username.length <= 2 || password.length <= 4){
            return dispatch(loginFail());
        }

        login(data, response=>{
            dispatch({ type: STARRIVER_LOGIN_SUCCESS });
        }, err=>{
            dispatch(loginFail());
        })
    }
}

export function loginFail() {
    return {
        type: STARRIVER_LOGIN_FAIL
    }
}