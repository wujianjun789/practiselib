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