/**
 * Created by a on 2018/3/8.
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
  const str = week.toString(2).split('').reverse().join('');
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
  let arr = [0,0,0,0,0,0,0];

  for (let i=0;i<array.length;i++){
    const val = array[i];
    if(val == 7){
      arr[0] = 1;
    }else{
      arr[val] = 1;
    }
  }

  const str = arr.reverse().join('');
  let week = 0;
  if(str == ""){
    week = 0;
  }else{
    week = parseInt(str, 2);
  }

  return week;
}

export function addTreeNode(id, formatIntl) {
  let type = "plan";
  let proType = "playerPlan";
  let name = "";
  switch (id) {
    case "general":
      type = "plan";
      proType = "playerPlan";
      name = formatIntl('mediaPublish.addPlayPlan');
      break;
    case "cycle":
      type = "plan2";
      proType = "cyclePlan";
      name = formatIntl('mediaPublish.cyclePlayPlan')
      break;
    case "regular":
      type = "plan3";
      proType = "timingPlan";
      name = formatIntl('mediaPublish.timingPlayPlan');
      break;
    default:
      break;
  }

  const node = {
    "id": "plan&&" + parseInt(Math.random() * 999),
    "type": type,
    "name": name,
    "toggled": false,
    "active": true,
    "level": 1,
    "children": []
  }

  return {proType: proType, node:node};
}

export function updateTree(treeList, node, parentNode, parentParentNode) {
  // treeList = clearState(treeList);
  if(!parentNode){
    treeList.push(node);
    return treeList;
  }else{
    return treeList.map(curNode=>{
      if(parentParentNode && curNode.type == parentParentNode.type && curNode.id == parentParentNode.id){
        curNode.toggled = true;
      }

      if (parentNode && curNode.type == parentNode.type && curNode.id == parentNode.id){
        curNode.toggled = true;
        if(!curNode.children){
          curNode.children = [];
        }

        curNode.children.push(node);
      }else{
        if(curNode.children && curNode.children.length){
          updateTree(curNode.children, node, parentNode, parentParentNode);
        }
      }

      return curNode;
    })
  }
}

export function updateTreeProperty(treeList, item, file) {
  return treeList.map(curNode=>{

    if(curNode.type !== "plan" && curNode.type !== "scene" && curNode.type !== "area" && curNode.id === item.id){
      curNode.name = file.name;
      curNode.thumbnail = file.thumbnail;
    }else{
      if(curNode.children && curNode.children.length){
        updateTreeProperty(curNode.children, item, file);
      }
    }

    return curNode;
  })
}

export function moveTree(treeList, data) {
  let curIndex = lodash.findIndex(treeList, node=>{return node.type == data.node.type && node.id == data.node.id});
  if(curIndex>-1){
    treeList.splice(curIndex, 1);
    treeList.splice(data.key=="down"?curIndex+1:curIndex-1, 0, data.node);
    return treeList;
  }else{
    return treeList.map(node=>{
      if(node.children && node.children.length){
        moveTree(node.children,  data)
      }

      return node;
    })
  }
}

export function removeTree(treeList, node) {
  if(!treeList || !node){
    return false;
  }

  let curIndex = lodash.findIndex(treeList, curNode=>{return curNode.type == node.type && curNode.id == node.id});
  if(curIndex>-1){
    treeList.splice(curIndex, 1);
    return treeList;
  }else{
    return treeList.map(cnode=>{
      if(cnode.children && cnode.children.length){
        removeTree(cnode.children,  node);
      }

      return cnode;
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

export function parsePlanData(data) {
  return {
    name: data.name,
    type: 0,
    dateRange: {
      dateBegin: {
        year: data.startDate.format('YYYY'),
        month: data.startDate.format('MM'),
        day: data.startDate.format('DD'),
      },
      dateEnd: {
        year: data.endDate.format('YYYY'),
        month: data.endDate.format('MM'),
        day: data.endDate.format('DD'),
      },
      enableFlag: true
    },
    week: data.week,
    timeRange: {
      timeBegin: {
        hour: data.startTime.format('HH'),
        minute: data.startTime.format('mm'),
        second: data.startTime.format('ss'),
        milliseconds: data.startTime.format('SS'),
      },
      timeEnd: {
        hour: data.endTime.format('HH'),
        minute: data.endTime.format('mm'),
        second: data.endTime.format('ss'),
        milliseconds: data.endTime.format('SS'),
      },
      enableFlag: true
    },
    pause: true,
    interval: 0,
    playMode: 2,
    playDuration: 0,
    playTimes: 1
  }
}

const imagesType = ['image'];
const textType = ['text'];
const videoType = ['video'];
export function formatTransformType(type) {
  // const urlArr = filepath.split('.')
  // const url = urlArr.length>1?urlArr[1]:undefined;
  console.log('type:', type);
  const url = type;
  if(url === undefined){
    return 3;
  }

  if(textType.indexOf(url)>-1){
    return 2;
  }

  if(imagesType.indexOf(url)>-1){
    return 3;
  }

  if(videoType.indexOf(url)>-1){
    return 4;
  }

  return 3;
}

export function getAssetData(data) {
  let obj = {};
  let itemType = formatTransformType(data.type);
  switch(itemType){
    case 2:
      return getTxtFileData(data, itemType);
    case 3:
      return getImageData(data, itemType);
    case 4:
      return getVideoData(data, itemType);
    default:
      break;
  }
  return obj;
}

function getTxtFileData(data, type) {
  return {
    "baseInfo": {
      "type": type,
      "file": data.filepath,
      "playDuration": 0,
      "logFlag": 0,
      "materialId": data.id
    },
    "background": {
      "transparent": 0,
      "picture": "",
      "picAlignment": 0,
      "color": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "amber": 0,
        "alpha": 255
      },
      "colorKey": {
        "red": 255,
        "green": 255,
        "blue": 255,
        "amber": 0,
        "alpha": 255
      },
      "materialId": ""
    },
    "transparency": 0,
    "colorReseversal": 0,
    "alignment": 0,
    "charSpace": 0,
    "rowSpace": 0,
    "fontColor": {
      "red": 255,
      "green": 255,
      "blue": 255,
      "amber": 0,
      "alpha": 255
    },
    "font": {
      "name": "宋体",
      "size": 20,
      "bold": false,
      "italic": false,
      "underline": false,
      "strikeout": false
    },
    "skipTime": 0,
    "skipType": 0,
    "inTransition": {
      "transition": 0,
      "speed": 0
    }
  }
}

function getImageData(data, type) {
  return {
    "baseInfo": {
      "type": type,
      "file": data.filepath,
      "playDuration": 0,
      "logFlag": 0,
      "materialId": data.id
    },
    "scale": 1,
    "inTransition": {
      "transition": 0,
      "speed": 0
    }
  }
}

function getVideoData(data, type) {

  return {
    "baseInfo": {
      "type": type,
      "file": data.filepath,
      "playDuration": 0,
      "logFlag": 0,
      "materialId": data.id
    },
    "playType": 0,
    "playTimeBegin": 0,
    "playTimeEnd": 0,
    "scale": 0,
    "text": {
      "text": "string",
      "color": {
        "red": 0,
        "green": 0,
        "blue": 0,
        "amber": 0,
        "alpha": 0
      },
      "font": {
        "name": "string",
        "size": 0,
        "bold": true,
        "italic": true,
        "underline": true,
        "strikeout": true
      },
      "position": {
        "x": 0,
        "y": 0,
        "w": 0,
        "h": 0
      },
      "inTransition": {
        "transition": 0,
        "speed": 0
      }
    }
  }
}

export function tranformAssetType(type) {
  console.log('type',type)
  switch (type) {
    case 0:
      return "playerText";
    case 1:
      return "";
    case 2:
      return "textFile";
    case 3:
      return "playerPicAsset";
    case 4:
      return "playerVideoAsset";
    case 9:
      return "virtualClock";
    case 10:
      return "digitalClock";
    case 11:
      return 'playerTimeAsset';
    default:
      return "";
  }
}

export function IsSystemFile(type){
  if(type == 0 || type == 1 || type == 9 || type == 10 || type == 11){
    return true;
  }

  return false;
}

export function getTitleByType(curType, formatIntl) {
  switch (curType) {
    case "cyclePlan":
      return ` (${formatIntl('mediaPublish.cyclePlayPlan')})`;
    case "timingPlan":
      return ` (${formatIntl('mediaPublish.timingPlayPlan')})`;
    default:
      break;
  }

  return "";
}

export function getPropertyTypeByNodeType(node) {
  let type = 'playerScene';
  switch (node.type) {
    case "scene":
      type = 'playerScene';
      break;
    case 'plan':
      type = 'playerPlan';
      break;
    case 'plan2':
      type = 'cyclePlan';
      break;
    case 'plan3':
      type = 'timingPlan';
      break;
    case 'area':
      type = 'playerArea';
      break;
    default:
      break;
  }

  return type;
}

export function getTipByType(curType, formatIntl) {
  let tips = "";
  switch (curType) {
    case "playerPlan":
      tips = formatIntl("mediaPublish.delete.plan.alert");
      break;
    case "playerScene":
      tips = formatIntl("mediaPublish.delete.scene.alert");
      break;
    case "playerArea":
      tips = formatIntl("mediaPublish.delete.area.alert");
      break;
    default:
      tips = ""
      break;
  }

  return tips;
}

export function getInitData(type, name) {
  let data =  {
    "id": type+"&&" + parseInt(Math.random() * 999),
    "type": type,
    "name": name,
    "active": true,
    "level": type=='scene'?2:3
  };

  if(type == 'scene'){
    data = Object.assign({}, data, {toggled:false, children:[]})
  }
  return data;
}

export function getActiveItem(assetList) {
  let addList = [];
  assetList.get('list').map(item => {
    if (item.get('active')) {
      addList.push(item);
    }
  })

  return addList;
}

export function addItemToScene(sceneItem, projectId, programId, sceneId, zoneId, data) {
  console.log('data:', data);
  if(!sceneItem.hasOwnProperty(projectId)){
    sceneItem[projectId] = {};
  }

  if(!sceneItem[projectId].hasOwnProperty(programId)){
    sceneItem[projectId][programId] = {};
  }

  if(!sceneItem[projectId][programId].hasOwnProperty(sceneId)){
    sceneItem[projectId][programId][sceneId] = {};
  }

  if(!sceneItem[projectId][programId][sceneId].hasOwnProperty(zoneId)){
    sceneItem[projectId][programId][sceneId][zoneId] = [];
  }

  sceneItem[projectId][programId][sceneId][zoneId] = data;

  return sceneItem;
}

export function removeItemInScene(sceneItem, projectId, programId, sceneId, zoneId, data) {
  if(!sceneItem.hasOwnProperty(projectId)){
    return sceneItem;
  }

  if(!sceneItem[projectId].hasOwnProperty(programId)){
    return sceneItem;
  }

  if(!sceneItem[projectId][programId].hasOwnProperty(sceneId)){
    return sceneItem;
  }

  if(!sceneItem[projectId][programId][sceneId].hasOwnProperty(zoneId)){
    return sceneItem;
  }

  const index = lodash.findIndex(sceneItem[projectId][programId][sceneId][zoneId], item=>{return item.id == data.id});
  if(index>-1){
    sceneItem[projectId][programId][sceneId][zoneId].splice(index, 1);
  }

  return sceneItem;
}

export function removeArea(sceneItem, projectId, programId, sceneId, zoneId) {
  if(!sceneItem.hasOwnProperty(projectId)){
    return sceneItem;
  }

  if(!sceneItem[projectId].hasOwnProperty(programId)){
    return sceneItem;
  }

  if(!sceneItem[projectId][programId].hasOwnProperty(sceneId)){
    return sceneItem;
  }

  if(!sceneItem[projectId][programId][sceneId].hasOwnProperty(zoneId)){
    return sceneItem;
  }

  delete sceneItem[projectId][programId][sceneId][zoneId];
  return sceneItem;
}

export function getItemOfScene(sceneItem, projectId, programId, sceneId) {
  if(!sceneItem.hasOwnProperty(projectId)){
    return [];
  }

  if(!sceneItem[projectId].hasOwnProperty(programId)){
    return [];
  }

  if(!sceneItem[projectId][programId].hasOwnProperty(sceneId)){
    return [];
  }

  return sceneItem[projectId][programId][sceneId];
}