/**
 * Created by a on 2017/7/17.
 */
import {
    TREEVIEW_INIT,
    TREEVIEW_TOGGLE
} from '../actionTypes/treeView'

const initialState = {
    datalist:[]
};

export default function treeView(state=initialState, action) {
    switch(action.type) {
        case TREEVIEW_INIT:
            return treeViewInit(state, action.data);
        case TREEVIEW_TOGGLE:
            return onToggle(state, action.data);
        default:
            return state;
    }
}

function treeViewInit(state, data) {
    return Object.assign({}, state, {datalist:data});
}

function onToggle(state, data) {
    let list = update(state.datalist, 1, null, data)
    return Object.assign({}, state, {datalist:list});
}

function update(list, index, parentId, data) {
    let curIndex = index;
    let nextIndex = index + 1;
    return list.map(node=>{
        if(curIndex == 1 && !node.children){
            return node;
        }

        if(curIndex == 1 && node.id == data.id){
            node.toggled = !node.toggled;
            return node;
        }else if(curIndex == 1 && node.id != data.id && !IsChildren(node.children, data.id)){
            node.toggled = false;
        }

        if(curIndex == 2){
            if(node.id == data.id){
                node.active = true
            }else if(node.id != data.id /*&& IsChildren(list, data.id) || node.id != data.id &&　IsParent(parentId, data.id)*/){
                node.active = false;
            }
        }

        if(node.children){
          update(node.children, nextIndex, node.id, data);
        }

        return node;
    })
}

function IsChildren(childrens, id) {
    if(!childrens){
        return false;
    }

    for(var key in childrens){
        if(childrens[key].id == id){
            return true;
        }
    }

    return false;
}

function IsParent(parentId, id) {
    if(parentId == id){
        return true;
    }

    return false;
}