/**
 * created by Azrael on 2017/02/23
 */
import {
    OVERLAYER_HIDDEN,
    OVERLAYER_SHOW
} from '../actionTypes/overlayer';

export const initialState = {
    isShowDialog: false,
    page: null
};


export default function overlayer (state=initialState, action) {
    switch(action.type) {
        case 'OVERLAYER_HIDDEN':
            return Object.assign({}, state, {isShowDialog: false, page: null});
        case 'OVERLAYER_SHOW':
            return Object.assign({}, state, {isShowDialog: true, page: action.page});
        default: 
            return state;
    }
}