/**
 * Created by a on 2017/4/21.
 */
import {login} from '../../util/network';

import {
    STARRIVER_LOGIN_SUCCESS,
    STARRIVER_LOGIN_FAIL,
    STARRIVER_LOGIN_CHANGE,
    STARRIVER_LOGIN_FOCUS
} from '../actionType/index'

export function loginHandler(username, password) {
    return dispatch=>{
        if(username.length <= 2 || password.length <= 4){
            return dispatch(loginFail());
        }

        login({name:username, password:password}, response=>{
            dispatch(loginSuccess());
        }, err=>{
            dispatch(loginFail());
        })
    }
}

export function loginSuccess() {
    return {
        type: STARRIVER_LOGIN_SUCCESS
    }
}

export function loginFail() {
    return {
        type: STARRIVER_LOGIN_FAIL
    }
}

export function onChange(data) {
    return {
        type: STARRIVER_LOGIN_CHANGE,
        data: data
    }
}

export function onFocus() {
    return {
        type: STARRIVER_LOGIN_FOCUS
    }
}