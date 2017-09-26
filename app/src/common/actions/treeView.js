/**
 * Created by a on 2017/7/17.
 */
import {
    TREEVIEW_INIT,
    TREEVIEW_TOGGLE
} from '../actionTypes/treeView'

export function treeViewInit(data) {
    return {
        type:TREEVIEW_INIT,
        data: data,
    }
}

export function onToggle(node) {
    return {
        type:TREEVIEW_TOGGLE,
        data:node
    }
}