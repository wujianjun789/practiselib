import * as actionTypes from '../actionTypes/userCenter'

export const initialState = { };
export default function userCenter(state=initialState, action) {
    switch(action.type) {
        case actionTypes.USERCENTER_POPUP_CONFIRM_EXIT:
        	return {islogin:0}
        case actionTypes.USERCENTER_POPUP_CONFIRM_LOGIN:
        	return {islogin:1}
        default:
            return state;
    }
}