/**
 * Created by a on 2018/3/8.
 */

import {
  INIT_PROJECT,
  INIT_PROGRAM_LIST,
  INIT_PLAN,
  INIT_SCENE_LIST,
  INIT_SCENE,
  INIT_ZONE_LIST,
  INIT_ZONE,
  INIT_ITEM_LIST,
  INIT_ITEM,
  INIT_CURNODE,

  UPDATE_TREE_DATA,
  UPDATE_TREE_LIST,
  UPDATE_TREE_JUDGE,

  UPDATE_ITEM_NAME,

  CLEAR_TREE_STATE
} from '../actionType/index';

import Immutable from 'immutable';
import lodash from 'lodash';
import {getIndexByKey} from '../../util/algorithm';
import {updateTree, clearTreeListState, IsSystemFile, addItemToScene, updateTreeProperty} from '../util/index'
const initialState = {
    data: [],
    project: null,  //播放方案
    plan: null,     //播放计划
    scene: null,   //播放场景
    zone: null,      //播放区域
    item: null,      //播放项
    IsUpdateTree: false,
    curNode: null //当前要操作对象
};


export default function mediaPublishProject(state=initialState, action) {
  switch(action.type) {
    case INIT_PROJECT:
      return Object.assign({}, state, {project: action.data});
    case INIT_PROGRAM_LIST:
      return updateProgramList(state, action.data);
    case INIT_PLAN:
      return Object.assign({}, state, {plan: action.data});
    case INIT_SCENE:
      return Object.assign({}, state, {scene: action.data});
    case INIT_ZONE:
      return Object.assign({}, state, {zone: action.data});
    case INIT_ITEM:
      return Object.assign({}, state, {item: action.data});
    case INIT_CURNODE:
      return Object.assign({}, state, {curNode: action.data});
    case UPDATE_ITEM_NAME:
      return updateItemName(state, action.item, action.file);
    case INIT_SCENE_LIST:
      return updateSceneList(state, action.programId, action.data);
    case INIT_ZONE_LIST:
      return updateZoneList(state, action.programId, action.sceneId, action.data);
    case INIT_ITEM_LIST:
      return updateItemList(state, action.programId, action.sceneId, action.zoneId, action.data);
    case UPDATE_TREE_DATA:
      return updateTreeData(state, action.node, action.parentNode, action.parentParentNode);
    case UPDATE_TREE_LIST:
      return Object.assign({}, state, {data: action.data, IsUpdateTree: true});
    case UPDATE_TREE_JUDGE:
      return Object.assign({}, state, {IsUpdateTree:action.data});
    case CLEAR_TREE_STATE:
      return Object.assign({}, state, {data: clearTreeListState(state.data), IsUpdateTree: true});
    default:
      return state;
  }
}

function updateProgramList(state, data) {
    let newData = [];
    for(let i=0;i<data.length;i++){
        const program = data[i];
        newData.push(Object.assign({}, program, { type: 'plan', toggled: false, active: false, children: [] }));
    }

    return Object.assign({}, state, {data: newData});
}

function updateSceneList(state, programId, data){
    let playerData = state.data;
    let index = lodash.findIndex(playerData, program => { return program.id == programId; });
    let newData = [];
    for(let i=0;i<data.length;i++){
        const scene = data[i];
        newData.push(Object.assign({}, scene, { type: 'scene', toggled: false, active: false, children: [] }));
    }
    // clearTreeListState(state.playerData);

    // playerData[index].active = true;
    // playerData[index].toggled = true;
    playerData[index].children = newData;

    return Object.assign({}, state, {data: playerData, plan:playerData[index], IsUpdateTree: true});
}

function updateZoneList(state, programId, sceneId, data){
    let playerData = state.data;
    let programItem = lodash.find(playerData, program => { return program.id == programId; });
    let programIndex = lodash.findIndex(playerData, program => { return program.id == programId; });

    let sceneIndex = lodash.findIndex(programItem.children, scene => { return scene.id == sceneId; });
    let newData = [];
    for(let i=0;i<data.length;i++){
        const area = data[i];
        newData.push(Object.assign({}, area, { type: 'area', active: false, IsEndNode: true }));
    }

    clearTreeListState(state.data);

    // playerData[programIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].active = true;
    playerData[programIndex].children[sceneIndex].children = newData;

    return Object.assign({}, state, {data: playerData, scene: playerData[programIndex].children[sceneIndex], IsUpdateTree: true});
}

function updateItemList(state, programId, sceneId, zoneId, data){
    if(!programId || !sceneId || !zoneId || !data){
        return state;
    }

    const playerData = state.data;
    const programItem = lodash.find(playerData, program => { return program.id == programId; });
    const programIndex = lodash.findIndex(playerData, program => { return program.id == programId; });

    const sceneIndex = lodash.findIndex(programItem.children, scene => { return scene.id == sceneId; });
    const sceneItem = lodash.find(programItem.children, scene => { return scene.id == sceneId; });

    const zoneIndex = lodash.findIndex(sceneItem.children, zone => { return zone.id == zoneId; });
    let newData = [];
    for(let i=0;i<data.length;i++){
        const item = data[i];
        newData.push(Object.assign({}, item, { itemType: 'item', active: false }, { assetType: IsSystemFile(item.type) ? 'system' : 'source' }));
    }

    clearTreeListState(state.data);

    // playerData[programIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].children[zoneIndex].active = true;
    playerData[programIndex].children[sceneIndex].children[zoneIndex].children = newData;

    return Object.assign({}, state, {data: playerData});
}

function updateTreeData(state, node, parentNode, parentParentNode){
    const treeList = updateTree(state.data, node, parentNode, parentParentNode);
    return Object.assign({}, state, {data: treeList, IsUpdateTree: true});
}

function updateItemName(state, item, file){
    // return state;
    const playerData = updateTreeProperty(state.data, item, file);

    const {plan} = state;
    const programIndex = lodash.findIndex(playerData, program => { return program.id == plan.id; });
    const programItem = lodash.find(playerData, program => { return program.id == plan.id; });

    const sceneIndex = lodash.findIndex(programItem.children, scene => { return scene.id == state.scene.id; });
    const sceneItem = lodash.find(programItem.children, scene => { return scene.id == state.scene.id; });

    const zoneIndex = lodash.findIndex(sceneItem.children, zone => { return zone.id == state.zone.id; });
    const scene = playerData[programIndex].children[sceneIndex];
    const zone = playerData[programIndex].children[sceneIndex].children[zoneIndex];
    return Object.assign({}, state, {data: playerData, scene:scene, zone:zone});
}