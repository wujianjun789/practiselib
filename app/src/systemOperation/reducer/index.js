/**
 * Created by a on 2017/4/21.
 */
import {
    SIDEBAR_TOGGLE
} from '../actionType/index'
import Immutable from 'immutable';
const initialState = {
    sidebarNode: null
};


export default function sysOperation(state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case SIDEBAR_TOGGLE:
            return state.update('sidebarNode', v=>action.data);
        default:
            return state;
    }
}