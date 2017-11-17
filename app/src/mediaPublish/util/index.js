/**
 * Created by a on 2017/11/16.
 */
const week = {1:"一",2:"二",3:"三",4:"四",5:"五",6:"六",7:"日"};
export function weekReplace(list) {
    let weekStr = "";
    for(var i=0;i<list.length;i++){

        weekStr += week[list[i]]+(i==list.length-1?'':'、');
    }

    return weekStr;
}

export function updateTree(treeList, parentNode, node) {
    treeList = clearState(treeList);

    if(!parentNode){
        treeList.push(node);
        return treeList;
    }else{
        return treeList.map(curNode=>{
            if (curNode.id == parentNode.id){
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