/**
 * Created by a on 2017/4/21.
 */
import {
    STARRIVER_LOGIN_SUCCESS,
    STARRIVER_LOGIN_FAIL
} from '../actionType/index';

import Immutable from 'immutable';
const initialState = {
    isLogin: false
};


export default function login (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case STARRIVER_LOGIN_SUCCESS:
            location.href = location.host;
            return state;
        case STARRIVER_LOGIN_FAIL:
            return state;
        default:
            return state;
    }
}