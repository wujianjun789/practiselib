/**
 * Created by a on 2017/11/16.
 */
import lodash from 'lodash';

const week = {1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"日"};
export function weekReplace(list) {
    let weekStr = "";
    for(var i=0;i<list.length;i++){

        weekStr += week[list[i]]+(i==list.length-1?'':'、');
    }

    return weekStr;
}

export function weekTranformArray(week) {
    console.log('week:',week);
    let str = week.toString(2);
    let arr = [];
    for (let i=0;i<str.length;i++){
        let value = str.charAt(i);
        if(i==0 && parseInt(value)){
            arr.push(7)
        }else if(parseInt(value)){
            arr.push(i);
        }
    }

    return arr;
}

export function arrayTranformWeek(array) {
    let str = '';
    let arr = [];
    let week = 0;
    for (let i=0;i<array.length;i++){
        let val = array[i];
        if(val == 7){
            arr[0] = 1;
        }else{
            arr[val] = 1;
        }
    }

    str = arr.join('');
    if(str == ""){
        week = 0;
    }else{
        week = parseInt(str);
    }

    return week;
}

export function updateTree(treeList, parentNode, node) {
    // treeList = clearState(treeList);
    if(!parentNode){
        treeList.push(node);
        return treeList;
    }else{
        return treeList.map(curNode=>{
            if (curNode.type == parentNode.type && curNode.id == parentNode.id){
                curNode.toggled = true;
                if(!curNode.children){
                    curNode.children = [];
                }

                curNode.children.push(node);
            }else{
                if(curNode.children && curNode.children.length){
                    updateTree(curNode.children, parentNode, node);
                }
            }

            return curNode;
        })
    }
}

export function removeTree(treeList, node) {
    if(!treeList || !node){
        return false;
    }

    let curIndex = lodash.findIndex(treeList, curNode=>{return curNode.level == node.level && curNode.id == node.id});
    if(curIndex>-1){
        treeList.splice(curIndex, 1);
        return treeList;
    }else{
        return treeList.map(node=>{
            if(node.children && node.children.length){
                removeTree(node.children,  data);
            }

            return node;
        })
    }
}

export function getTreeParentNode(treeList, node, parentNode) {
    if(!treeList || !node){
        return null;
    }

    let newParentNode = null;
    treeList.map(curNode=>{

    })

    for(let i=0;i<treeList.length;i++){
        let curNode = treeList[i];
        if(curNode.type == node.type && curNode.id == node.id){
            newParentNode = parentNode;
        }else{
            if(curNode.children && curNode.children.length){
                newParentNode = getTreeParentNode(curNode.children, node, curNode);
            }
        }

        if(newParentNode){
            break;
        }
    }

    return newParentNode;
}

export function clearTreeListState(treeList) {
    if(!treeList){
        return false;
    }

    return treeList.map(node=>{
        if(node.children && node.children.length){
            node.children = clearTreeListState(node.children);
        }

        if(node.hasOwnProperty("toggled")){
            node.toggled = false;
        }

        if(node.hasOwnProperty("active")){
            node.active = false;
        }

        return node;
    })
}

function clearState(treeList) {
    return treeList.map(node=>{
        if(node.hasOwnProperty("toggled")){
            node.toggled = false;
        }

        if(node.hasOwnProperty("active")){
            node.active = false;
        }

        return node;
    })
}