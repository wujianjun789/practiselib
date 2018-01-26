/**
 * Created by a on 2017/7/17.
 */
import {
    TREEVIEW_INIT,
    TREEVIEW_TOGGLE,
    TREEVIEW_MOVE,
    TREEVIEW_REMOVE
} from '../actionTypes/treeView'

const initialState = {
    datalist:[]
};

import lodash from 'lodash';
export default function treeView(state=initialState, action) {
    switch(action.type) {
        case TREEVIEW_INIT:
            return treeViewInit(state, action.data);
        case TREEVIEW_TOGGLE:
            return onToggle(state, action.data);
        case TREEVIEW_MOVE:
            return onMove(state, action.data);
        case TREEVIEW_REMOVE:
            return onRemove(state, action.data);
        default:
            return state;
    }
}

function treeViewInit(state, data, router) {
    let path = location.pathname;
    let paths = path.split("/");
    let url = paths.pop();
    let urlParent = paths.pop();
    let curParentNode = Object.assign({}, searchNode(data, urlParent),{level:1});
    let curNode = Object.assign({}, searchNode(data, url), {level:2});

    let list = addTreeLevel(data, 1);
    console.log('renderTree:', data);

    if(curNode && !curNode.children && curParentNode && !curParentNode.toggled){
        list = update(list, 1, null, curParentNode);
    }

    if(curNode && !curNode.toggled){
        list = update(list, 1, null, curNode);
    }

    if(curNode && curNode.children && curNode.children.length){
        list = update(list, 1, null, curNode.children[0]);
    }

    return Object.assign({}, state, {datalist:list});
}

function addTreeLevel(treeList,level){
    return treeList.map(node=>{
        if(node.children && node.children.length){
            node.children = addTreeLevel(node.children, level+1);
        }

        return Object.assign({}, node, {level:level});
    })
}

function onToggle(state, data) {
    let list = update(state.datalist, 1, null, data)
    return Object.assign({}, state, {datalist:list});
}

function onMove(state, data) {
    let list = move(state.datalist, data);
    return Object.assign({}, state, {datalist:list});
}

function onRemove(state, data) {
    let list = remove(state.datalist, data);
    console.log("list:",list);
    return Object.assign({}, state, {datalist:list});
}

function searchNode(list, id) {
    for(var key in list){
        let curNode = list[key];
        if(curNode.id == id){
            return curNode;
        }

        if(curNode.children){
            let childCurNode = searchNode(curNode.children, id);
            if(childCurNode){
                return childCurNode;
            }else{
                continue;
            }
        }
    }

    return null;
}

function move(list, data) {
    let curIndex = lodash.findIndex(list, node=>{return node.level == data.node.level && node.id == data.node.id});
    if(curIndex>-1){
        list.splice(curIndex, 1);
        console.log(curIndex+1);
        list.splice(data.key=="down"?curIndex+1:curIndex-1, 0, data.node);
        return list;
    }else{
        return list.map(node=>{
            if(node.children && node.children.length){
                move(node.children,  data)
            }

            return node;
        })
    }
}

function remove(list, data) {
    let curIndex = lodash.findIndex(list, node=>{return node.level == data.level && node.id == data.id});
    if(curIndex>-1){
        list.splice(curIndex, 1);
        console.log(curIndex, list);
        return list;
    }else{
        return list.map(node=>{
            if(node.children && node.children.length){
               remove(node.children,  data)
            }

            return node;
        })
    }
}

function update(list, index, parentId, data) {
    console.log('update tree:',index);
    let curIndex = index;
    let nextIndex = index + 1;
    return list.map(node=>{
        if(node.level == data.level && node.id == data.id){
            node.active = true;
        }else{
            node.active = false;
        }

        // if(!(node.children  && node.children.length)){
        //     return node;
        // }

        if(node.level == data.level && node.id == data.id && node.children && node.children.length){
            node.toggled = !node.toggled;
            if(!node.defaultSelect){
                if(node.toggled && node.children && node.children.length){//默认选中第一个子节点
                    for(var i=0;i<node.children.length;i++){
                        node.children[i].active = false;
                    }
                    node.children[0].active = true;
                }

                return node;
            }
            // return node;
        }else if(node.id != data.id && !IsChildren(node.children, data) && !node.defaultSelect){
            node.toggled = false;
        }

        if(node.children && node.children.length){
            update(node.children, nextIndex, node.id, data);
        }

        return node;
    })
}

function IsChildren(childrens, child) {
    if(!childrens){
        return false;
    }

    let index = lodash.findIndex(childrens, node=>{ return node.level == child.level && node.id == child.id});
    if(index>-1){
        return true;
    }else{
        for(let i=0;i<childrens.length;i++){
            const node = childrens[i];
            let callBack = false;
            if(node.children && node.children.length){
                callBack = IsChildren(node.children, child);
                if(callBack){
                    return true;
                }
            }

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