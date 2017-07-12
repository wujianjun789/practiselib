import {
    USERCENTER_POPUP_CONFIRM_EXIT
} from '../actionTypes';

export function confirmExit() {
    return dispatch => {
        dispatch({ type: USERCENTER_POPUP_CONFIRM_EXIT });
        location.href = '/login';
    }
}