/**
 * Created by a on 2017/7/17.
 */
import {
    TREEVIEW_INIT,
    TREEVIEW_TOGGLE,
    TREEVIEW_TOGGLE_ID,
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
            return treeViewInit(state, action.data, action.refresh);
        case TREEVIEW_TOGGLE:
            return onToggle(state, action.data);
        case TREEVIEW_TOGGLE_ID:
            return onToggleById(state, action.data);
        case TREEVIEW_MOVE:
            return onMove(state, action.data);
        case TREEVIEW_REMOVE:
            return onRemove(state, action.data);
        default:
            return state;
    }
}

function treeViewInit(state, data, refresh) {
    let list = addTreeLevel(data, 1);
    if(!refresh){
      return Object.assign({}, state, {datalist: list});
    }

    let path = location.pathname;
    let paths = path.split("/");
    let url = paths.pop();
    let urlParent = paths.pop();

    let searNode = searchNode(data, urlParent, null);
    let curParentNode = searNode? Object.assign({}, searNode,{level:1}):searNode;
    let sear2Node = searchNode(data, url, searNode);
    let curNode = sear2Node? Object.assign({}, sear2Node, {level:curParentNode?2:1}):sear2Node;


    if(curNode && curNode.children){
        curNode.children = addTreeLevel(curNode.children, curNode.level+1);
    }

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

function onToggleById(state, data) {
    let path = data;
    let paths = path.split("/");
    let url = paths.pop();
    let urlParent = paths.pop();

    let searNode = searchNode(state.datalist, urlParent, null);
    let curParentNode = searNode? Object.assign({}, searNode,{level:1}):searNode;
    let sear2Node = searchNode(state.datalist, url, searNode);
    let curNode = sear2Node? Object.assign({}, sear2Node, {level:curParentNode?2:1}):sear2Node;

    let list = state.datalist;
    if(curNode && curNode.children){
        curNode.children = addTreeLevel(curNode.children, curNode.level+1);
    }

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

function onMove(state, data) {
    let list = move(state.datalist, data);
    return Object.assign({}, state, {datalist:list});
}

function onRemove(state, data) {
    let list = remove(state.datalist, data);
    return Object.assign({}, state, {datalist:list});
}

function searchNode(list, id, parent) {
    for(var key in list){
        let curNode = list[key];
        if(!parent && curNode.id == id){
            return curNode;
        }

        if(parent && curNode.id === parent.id && curNode.children){
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
        list.splice(data.key=="down"?curIndex+1:curIndex-1, 0, data.node);
        return list;
    }else{
        return list.map(node=>{
            if(node.children && node.children.length){
                node.children = move(node.children,  data)
            }

            return node;
        })
    }
}

function remove(list, data) {
    let curIndex = lodash.findIndex(list, node=>{return node.level == data.level && node.id == data.id});
    if(curIndex>-1){
        list.splice(curIndex, 1);
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

        if(node.level == data.level && node.id == data.id && !node.IsEndNode && node.children && node.children.length){
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