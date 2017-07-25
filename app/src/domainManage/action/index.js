/**
 * Created by a on 2017/7/25.
 */
import {
    SIDEBAR_TOGGLE
} from '../actionType/index';

export function sideBarToggled(data) {
    return{
        type:SIDEBAR_TOGGLE,
        data:data
    }
}