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

import {getProgramList, getSceneList, updateProgramOrders, updateSceneOrders, updateZoneOrders,
  removeProgramsById, removeSceneById, removeZoneById} from '../../api/mediaPublish';

import {addTreeNode, moveTree, getTreeParentNode, removeTree} from '../util/index';
import {getListObjectByKey, DeepCopy} from '../../util/algorithm';
import lodash from 'lodash';
export function initProject(project){
  return dispatch=>{
    dispatch({type: INIT_PROJECT, data:project});
    dispatch(requestProgrameList(project));
  }
}

function requestProgrameList(project) {
  return (dispatch)=>{
    getProgramList(project.id, data=>{
      dispatch({type: INIT_PROGRAM_LIST, data:data});
    })
  }
}

export function initPlan(plan) {
  return dispatch=>{
    dispatch({type: INIT_PLAN, data:plan});
    // dispatch(requestSceneList(plan.id))
  }
}

export function requestSceneList(programId){
  return (dispatch, getState)=>{
    const project = getState().mediaPublish.project;
    getSceneList(project.id, programId, data=>{
      dispatch({type: INIT_SCENE_LIST, programId: programId, data: data});
    })
  }
}

export function updateTreeJudge(IsUpdateTree) {
  return {
    type: UPDATE_TREE_JUDGE,
    data: IsUpdateTree
  }
}

export function addPlayerPlan(id, formatIntl) {
  return (dispatch, getState)=>{
    dispatch(clearTreeState());
    const node = addTreeNode(id, formatIntl);
    dispatch(initPlan(node.node));
    dispatch(updateTreeData(node.node))
  }
}

export function updateTreeData(node, parentNode, parentParentNode) {
  return {
    type: UPDATE_TREE_DATA,
    node: node,
    parentNode: parentNode,
    parentParentNode: parentParentNode
  }
}

export function clearTreeState() {
  return {
    type: CLEAR_TREE_STATE
  }
}

export function treeOnMove(key, node){
  return (dispatch, getState)=>{
    const project = getState().mediaPublishProject.project;
    const playerData = getState().mediaPublishProject.data;
console.log('treeOnMove:',node.type);
    switch (node.type) {
      case 'plan':
      case 'plan2':
      case 'plan3':
        dispatch(updatePlanOrders({ key: key, node: node }, playerData, project));
        break;
      case 'scene':
        dispatch(updateScenesOrders({ key: key, node: node }, playerData, project));
        break;
      case 'area':
        dispatch(updateAreaOrders({ key: key, node: node }, playerData, project));
        break;
      default:
        break;
    }
  }
}

function updatePlanOrders(data, playerData, project){
  return dispatch=>{
    const newTreeList = moveTree(playerData, data);
    const ids = getListObjectByKey(newTreeList, 'id');
    dispatch(updateTreeList(newTreeList));
    updateProgramOrders(project.id, ids, response => {
      console.log('plan orders:', ids);
    });
  }

}

function updateScenesOrders(data, playerData, project){
  return dispatch=>{
    let parentNode = getTreeParentNode(playerData, data.node);
    let index = lodash.findIndex(playerData, plan => { return plan.type == parentNode.type && plan.id == parentNode.id; });

    playerData[index].children = moveTree(parentNode.children, data);
    let ids = getListObjectByKey(playerData[index].children, 'id');
    dispatch(updateTreeList(playerData));
    updateSceneOrders(project.id, parentNode.id, ids, response => {
      console.log('scene orders:', ids);
    });
  }
}

function updateAreaOrders(data, playerData, project){
  return dispatch=>{
    let parentNode = getTreeParentNode(playerData, data.node);
    let parentParentNode = getTreeParentNode(playerData, parentNode);

    let planIndex = lodash.findIndex(playerData, plan => { return plan.type == parentParentNode.type && plan.id == parentParentNode.id; });
    let sceneIndex = lodash.findIndex(parentParentNode.children, scene => { return scene.type == parentNode.type && scene.id == parentNode.id; });

    playerData[planIndex].children[sceneIndex].children = moveTree(parentNode.children, data);
    let ids = getListObjectByKey(playerData[planIndex].children[sceneIndex].children, 'id');
    dispatch(updateTreeList(playerData));
    updateZoneOrders(project.id, parentParentNode.id, parentNode.id, ids, response => {
      console.log('area orders:', ids);
    });
  }
}

export function treeOnRemove(node){
  return (dispatch, getState)=>{
    const project = getState().mediaPublishProject.project;
    const sCurNode = getState().mediaPublishProject.zone;
    const sParentNode = getState().mediaPublishProject.scene;
    const sParentParentNode = getState().mediaPublishProject.plan;
    const playerData = getState().mediaPublishProject.data;

    let parentNode = getTreeParentNode(playerData, node);
    let parentParentNode = getTreeParentNode(playerData, parentNode);
    if (sCurNode && node.type === sCurNode.type && node.id === sCurNode.id
      || sParentNode && parentNode && parentNode.type === sParentNode.type && parentNode.id === sParentNode.id
      || sParentParentNode && parentParentNode && parentParentNode.type === sParentParentNode.type && parentParentNode.id === sParentParentNode.id) {
    }

    if(typeof node.id === "string" && (node.id.indexOf("plan")>-1 || node.id.indexOf("scene")>-1 || node.id.indexOf("area")>-1)){
      return dispatch(updateTreeList(removeTree(playerData, node)));
    }

    switch (node.type) {
      case 'scene':
        removeSceneById(project.id, parentNode.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)))
        });
        break;
      case 'plan':
        removeProgramsById(project.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)));
        });
        break;
      case 'plan2':
        break;
      case 'plan3':
        break;
      case 'area':
        removeZoneById(project.id, parentParentNode.id, parentNode.id, node.id, () => {
          dispatch(updateTreeList(removeTree(playerData, node)));
        });
        break;
      default:
        break;
    }
  }
}


function updateTreeList(treeList) {
  return {
    type: UPDATE_TREE_LIST,
    data: DeepCopy(treeList)
  }
}