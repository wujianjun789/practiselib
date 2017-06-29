/**
 * Created by a on 2017/4/21.
 */
import {
    STARRIVER_LOGIN_HANDLE
} from '../actionType/index'
export function loginHandler(state) {
    return dispatch=>{
        dispatch({
            type: STARRIVER_LOGIN_HANDLE,
            data: state
        })

        location.href = '/';
    }
}