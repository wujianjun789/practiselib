/**
 * Created by a on 2017/4/21.
 */
import {
    STARRIVER_LOGIN_SUCCESS,
    STARRIVER_LOGIN_FAIL,
    STARRIVER_LOGIN_CHANGE,
    STARRIVER_LOGIN_FOCUS
} from '../actionType/index';

import Immutable from 'immutable';
export const initialState = {
    style: { visibility: 'hidden' },
    user: { 
        username: '',
        password: '',
    }
};


export default function login (state=initialState, action) {
    switch(action.type) {
        case STARRIVER_LOGIN_CHANGE:
            return updateData(state, action);
        case STARRIVER_LOGIN_SUCCESS:
            location.href = location.host;
            return state;
        case STARRIVER_LOGIN_FAIL:
            return setStyle(state, 'visible');
        case STARRIVER_LOGIN_FOCUS:
            return setStyle(state, 'hidden');
        default:
            return state;
    }
}

export function updateData(state, action) {
    if(action.data.id == 'username'){
        state.user.username = action.data.data;
    }else{
        state.user.password = action.data.data;
    }

    return Object.assign({}, state);
}
export function setStyle(state, value) {
    state.style = { visibility: value }
    return Object.assign({}, state);
}