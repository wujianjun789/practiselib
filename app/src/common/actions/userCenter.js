import {
    USERCENTER_POPUP_CONFIRM_EXIT
} from '../actionTypes/userCenter';

export const confirmExit = () => dispatch => {
    dispatch({ type: USERCENTER_POPUP_CONFIRM_EXIT });
    location.href = '/login';
}