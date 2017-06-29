/**
 * Created by a on 2017/4/21.
 */
import {
    STARRIVER_LOGIN_HANDLE
} from '../actionType/index';

import Immutable from 'immutable';
const initialState = {
    isLogin: false
};


export default function app (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case STARRIVER_LOGIN_HANDLE:
            return state.set('isLogin', true);
        default:
            return state;
    }
}