import {
    SIDEBAR_TOGGLE
} from '../actionType/index';

export function sideBarToggled(data) {
    return{
        type:SIDEBAR_TOGGLE,
        data:data
    }
}