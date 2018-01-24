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
            if (curNode.id == parentNode.id){
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