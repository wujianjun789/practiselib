/**
 * Created by a on 2017/7/17.
 */
import {
    TREEVIEW_INIT,
    TREEVIEW_TOGGLE,
    TREEVIEW_MOVE,
    TREEVIEW_REMOVE
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

export function onMove(key, node) {
    return {
        type: TREEVIEW_MOVE,
        data:{key:key, node:node}
    }
}

export function onRemove(node) {
    return {
        type: TREEVIEW_REMOVE,
        data: node
    }
}