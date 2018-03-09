/**
 * Created by a on 2018/3/8.
 */

import {
  INIT_PROJECT,
  INIT_PROGRAM_LIST,
  INIT_PLAN,
  INIT_SCENE_LIST,

  UPDATE_TREE_DATA,
  UPDATE_TREE_LIST,
  UPDATE_TREE_JUDGE,

  CLEAR_TREE_STATE
} from '../actionType/index';

import Immutable from 'immutable';
import lodash from 'lodash';
import {getIndexByKey} from '../../util/algorithm';
import {updateTree, clearTreeListState, IsSystemFile, addItemToScene} from '../util/index'
const initialState = {
    data: [],
    project: null,  //播放方案
    plan: null,     //播放计划
    screen: null,   //播放场景
    zone: null,      //播放区域
    item: null,      //播放项
    IsUpdateTree: false
};


export default function mediaPublishProject(state=initialState, action) {
    switch(action.type) {
        case INIT_PROJECT:
            return Object.assign({}, state, {project: action.data});
        case INIT_PROGRAM_LIST:
            return updateProgramList(state, action.data);
        case INIT_PLAN:
            return Object.assign({}, state, {plan: action.data});
        case INIT_SCENE_LIST:
            return updateSceneList(state, action.programId, action.data);
        case UPDATE_TREE_DATA:
            return updateTreeData(state, action.node, action.parentNode, action.parentParentNode);
        case UPDATE_TREE_LIST:
          console.log('tree-list:', action.data);
            return Object.assign({}, state, {data: action.data, IsUpdateTree: true});
        case UPDATE_TREE_JUDGE:
            return Object.assign({}, state, {IsUpdateTree:action.data});
        case CLEAR_TREE_STATE:
            clearTreeListState(state.data);
            return Object.assign({}, state, {data: state.data, IsUpdateTree: true});
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

    return Object.assign({}, state, {data: playerData, IsUpdateTree: true});
}

function updateTreeData(state, node, parentNode, parentParentNode){
    const treeList = updateTree(state.data, node, parentNode, parentParentNode);

    return Object.assign({}, state, {data: treeList, IsUpdateTree: true});
}