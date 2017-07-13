import {
    USERCENTER_POPUP_CONFIRM_EXIT
} from '../actionTypes/userCenter';

export const initialState = { };

export default function userCenter(state=initialState, action) {
    switch(action.type) {
        case USERCENTER_POPUP_CONFIRM_EXIT:
        default:
            return state;
    }
}