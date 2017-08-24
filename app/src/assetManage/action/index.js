import {
    SIDEBAR_TOGGLE,
} from '../actionType/index';

import {
    TREEVIEW_TOGGLE
} from '../../common/actionTypes/treeView'

export function sideBarToggled(data) {
    return dispatch=>{
        dispatch({type:SIDEBAR_TOGGLE, data:data})

        let node = data;
        // if(node.children && node.children.length){
        //     dispatch({type:TREEVIEW_TOGGLE, data:node.children[0]});
        // }
    }
}