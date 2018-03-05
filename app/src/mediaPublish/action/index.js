/**
 * Created by a on 2017/10/17.
 */
import {
    SIDEBAR_TOGGLE
} from '../actionType/index';

import {
    INIT_PROJECT,
    INIT_PROGRAM_LIST,
    INIT_SCENE_LIST,
    INIT_ZONE_LIST,
    INIT_ITEM_LIST,

    LOCAL_UPDATE_ITEM_LIST,
    UPDATE_ITEM_LIST,
    UPDATE_ITEM_NAME,
    UPDATE_ITEM_SELECT,
    UPDATE_ITEM_CANCEL,
    UPDATE_ITEM_EDIT,
    UPDATE_ITEM_PREVIEW,
    UPDATE_CUR_SCENE_ITEM,

    UPDATE_TREE_JUDGE,
    UPDATE_TREE_DATA,
    UPDATE_TREE_LIST,
    CLEAR_TREE_STATE,

    INIT_CUR_TYPE,
    INIT_CURNODE,

    ADD_ITEM_TO_SCENE
} from '../actionType/index'

import {
    TREEVIEW_TOGGLE
} from '../../common/actionTypes/treeView';

import {getProgramList, getSceneList, getZoneList, getItemList, getAssetById,
    updateProjectById, updateProgramById, updateSceneById, updateZoneById, updateItemById,
    addProgram, addScene, addZone, addItem, removeProgramsById, removeSceneById, removeZoneById,removeItemById,
    updateProgramOrders, updateSceneOrders, updateZoneOrders, updateItemOrders} from '../../api/mediaPublish';
import {addTreeNode, moveTree, removeTree, getPropertyTypeByNodeType, getTreeParentNode, getInitData, IsSystemFile, tranformAssetType,
    parsePlanData,removeArea, formatTransformType, getAssetData} from '../util/index';
import {addNotify} from '../../common/actions/notifyPopup';
import {getListObjectByKey, getIndexByKey} from '../../util/algorithm';
import lodash from 'lodash';
import Immutable from 'immutable';

import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export function sideBarToggled(data) {
    return dispatch=>{
        dispatch({type:SIDEBAR_TOGGLE, data:data})

        let node = data;
        // if(node.children && node.children.length){
        //     dispatch({type:TREEVIEW_TOGGLE, data:node.children[0]});
        // }
    }
}

export function initProject(project) {
    return (dispatch)=>{
        dispatch({type: INIT_PROJECT, data: project})
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

export function updateOnToggle(node) {
    return (dispatch, getState)=>{
        const playerData = getState().mediaPublish.playerData;
        const type = getPropertyTypeByNodeType(node);
        const parentNode = getTreeParentNode(playerData, node);
        const parentParentNode = getTreeParentNode(playerData, parentNode);
        dispatch(updateCurType(type, false));
        dispatch(updateCurNode(node, parentNode, parentParentNode));
        if (typeof node.id == 'string' && (node.id.indexOf('plan&&') > -1 || node.id.indexOf('scene&&') > -1)) {
            return;
        }

        switch (type) {
            case 'playerPlan':
                console.log('toggle:',node.toggled);
                !node.toggled && dispatch(requestSceneList(node.id));
                break;
            case 'playerScene':
                !node.toggled && dispatch(requestZoneList(parentNode.id, node.id));
                break;
            case 'playerArea':
                dispatch(requestItemList(parentParentNode.id, parentNode.id, node.id));
                break;
            default:
                break;
        }
    }
}

function requestSceneList(programId){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        getSceneList(project.id, programId, data=>{
            dispatch({type: INIT_SCENE_LIST, programId: programId, data: data});
        })
    }
}

function requestZoneList(programId, sceneId){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        getZoneList(project.id, programId, sceneId, data=>{
            console.log('zone:', data);
            dispatch(getItemListOfCurScene(data));
            dispatch({type: INIT_ZONE_LIST, programId: programId, sceneId: sceneId, data: data});
        })
    }
}

function getItemListOfCurScene(data) {
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const parentParentNode = getState().mediaPublish.parentParentNode;
        const parentNode = getState().mediaPublish.parentNode;
        const curNode = getState().mediaPublish.curNode;
        data.map(zone=>{
            getItemList(project.id, parentNode.id, curNode.id, zone.id, item=>{
                dispatch({type: ADD_ITEM_TO_SCENE, programId:parentNode.id, sceneId:curNode.id, zoneId:zone.id, data:item})
            })
        })
    }

}
export function initItemList() {
    return {
        type: INIT_ITEM_LIST
    }
}

export function requestItemList(programId, sceneId, zoneId){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        getItemList(project.id, programId, sceneId, zoneId, data=>{
            dispatch({type: UPDATE_ITEM_LIST, programId: programId, sceneId: sceneId, zoneId: zoneId, data: data});
            dispatch(requestItemName(Immutable.fromJS(data)));
        })
    }
}

function requestItemName(data) {
    return dispatch=>{
        console.log('requestItemName:', data);
        data.map(item => {
            const itemObject = item.toJS();
            if (IsSystemFile(item.get('type'))) {
                const sysfile = lodash.find(systemFile, file => { return file.id === itemObject.materialId; });
                dispatch(updateItemName(itemObject, sysfile));
            } else {
                getAssetById(item.get('materialId'), response => {
                    dispatch(updateItemName(itemObject, response));
                });
            }
        });
    }
}

function updateItemName(itemObject, sysfile) {
    return {
        type: UPDATE_ITEM_NAME,
        item: itemObject,
        file: sysfile
    }
}

export function updateItemPreView(IsPreView){
    return {
        type: UPDATE_ITEM_PREVIEW,
        data: IsPreView
    }
}

export function playerAssetSelect(item) {
    return dispatch=>{
        const type = item.get('type');
        const curType = tranformAssetType(type);
        dispatch(updateCurType(curType, true));
        dispatch({type: UPDATE_ITEM_SELECT, data: item});
        // setTimeout(()=>{cb && cb()}, 66);
    }
}

export function updateCurType(curType, isClick) {
    return {
        type: INIT_CUR_TYPE,
        curType: curType,
        isClick: isClick
    }
}

export function updateCurNode(curNode, parentNode, parentParentNode){
    console.log('updateCurNode:', curNode, parentNode, parentParentNode);
    return {
        type: INIT_CURNODE,
        parentParentNode: parentParentNode,
        parentNode: parentNode,
        curNode: curNode
    }
}

export function playerAssetCancel() {
    return {
        type: UPDATE_ITEM_CANCEL
    }
}

export function addPlayerPlan(id, formatIntl) {
    return (dispatch, getState)=>{
        const isClick = getState().mediaPublish.isClick;
        dispatch(clearTreeState());
        const node = addTreeNode(id, formatIntl);
        dispatch(updateCurType(node.proType, isClick));
        dispatch(updateCurNode(node.node));
        dispatch(updateTreeData(node.node));
    }
}

export function addPlayerSceneArea() {
    return (dispatch, getState)=>{
        const curType = getState().mediaPublish.curType;
        const curNode = getState().mediaPublish.curNode;
        const parentNode = getState().mediaPublish.parentNode;
        dispatch(clearTreeState());
        switch (curType) {
            case 'playerPlan':
            case 'playerPlan2':
            case 'playerPlan3':
                dispatch(addPlayerScene(curNode));
                break;
            case 'playerScene':
                dispatch(addPlayerArea(curNode, parentNode));
                break;
            default:
                break;
        }
    }
}

function addPlayerScene(curNode){
    return dispatch=>{
        const parentNode = curNode;
        if (typeof parentNode.id === 'string' && parentNode.id.indexOf('plan') > -1) {
            return dispatch(addNotify(0, '请提交播放列表'));
        }
        const node = getInitData('scene', '场景新建');

        dispatch(updateCurType('playerScene', false));
        dispatch(updateCurNode(node, parentNode));
        dispatch(updateTreeData(node, parentNode));
    }
}

function addPlayerArea(curNode, parentNode){
    return dispatch=>{
        const parentParentNode = parentNode;
        const sParentNode = curNode;
        if (typeof sParentNode.id === 'string' && sParentNode.id.indexOf('scene') > -1) {
            return dispatch(addNotify(0, '请提交播放场景'));
        }
        const node = getInitData('area', '区域新建');

        dispatch(updateCurType('playerArea', false));
        dispatch(updateCurNode(node, sParentNode, parentParentNode));
        dispatch(updateTreeData(node, sParentNode, parentParentNode));
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

export function updateTreeJudge(IsUpdateTree) {
    return {
        type: UPDATE_TREE_JUDGE,
        data: IsUpdateTree
    }
}

function updateTreeList(treeList) {
    return {
        type: UPDATE_TREE_LIST,
        data: treeList
    }
}

export function clearTreeState() {
    return {
        type: CLEAR_TREE_STATE
    }
}

export function applyClick(id, data) {
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const parentParentNode = getState().mediaPublish.parentParentNode;
        const parentNode = getState().mediaPublish.parentNode;
        const curNode = getState().mediaPublish.curNode;
        const playerData = getState().mediaPublish.playerData;
        switch (id) {
            case 'playerProject':
                updateProjectById(data, response => {
                    dispatch({type: INIT_PROJECT, data: Object.assign({}, project, response)})
                });
                break;
            case 'playerPlan':
                dispatch(addUpdatePlan(data, project, playerData));
                break;
            case 'playerScene':
                dispatch(addUpdateScene(data, project, parentNode, playerData));
                break;
            case 'playerAreaPro':
                dispatch(addUpdateArea(data, project, parentParentNode, parentNode, playerData));
                break;
            default:
                dispatch(addUpdateItem(data, project, parentParentNode, parentNode, curNode));
        }
    }
}

export function addItemToArea(item, formatIntl) {
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const parentParentNode = getState().mediaPublish.parentParentNode;
        const parentNode = getState().mediaPublish.parentNode;
        const curNode = getState().mediaPublish.curNode;

        if (!curNode || curNode.type !== 'area') {
            return dispatch(addNotify(0, formatIntl('mediaPublish.area.alert')));
        }

        if (typeof curNode.id === 'string' && curNode.id.indexOf('area') > -1) {
            return dispatch(addNotify(0, '请提交区域'));
        }

        const data = item.toJS();
        const index = lodash.findIndex(systemInitFile, file => { return file.baseInfo.type == data.type; });
        if (index < 0 && !data.type) {
            return dispatch(addNotify(0, 'asset unknow type'));
        }
        const itemType = index > -1 ? data.type : formatTransformType(data.type);
        const itemData = index > -1 ? systemInitFile[index] : getAssetData(data);
        addItem(project.id, parentParentNode.id, parentNode.id, curNode.id, itemType, itemData, data => {
            dispatch(requestItemList(parentParentNode.id, parentNode.id, curNode.id));
        });
    }
}

function addUpdatePlan(data, project, playerData){
    return dispatch=>{
        let planData = parsePlanData(data);
        if (data.id) {
            planData = Object.assign({}, planData, { id: data.id });
            updateProgramById(project.id, planData, (response) => {
                dispatch(updatePlayerPlanData(Object.assign({}, planData, {type:'plan'}), playerData));
            });
        } else {
            addProgram(project.id, planData, response => {
                dispatch(updatePlayerPlanData(Object.assign({}, planData, { id: response.playlistId }, {type:'plan'}), playerData));
            });
        }
    }
}

function addUpdateScene(data, project, parentNode, playerData){
    return dispatch=>{
        let sceneData = data;
        if (data.id) {
            sceneData = Object.assign({}, sceneData, { id: data.id });
            updateSceneById(project.id, parentNode.id, sceneData, (response) => {
                dispatch(updatePlayerSceneData(Object.assign({}, sceneData, {type:'scene'}), parentNode, playerData));
            });
        } else {
            addScene(project.id, parentNode.id, sceneData, response => {
                dispatch(updatePlayerSceneData(Object.assign({}, sceneData, { id: response.sceneId }, {type: 'scene'}), parentNode, playerData));
            });
        }
    }
}

function addUpdateArea(data, project, parentParentNode, parentNode, playerData){
    return dispatch=>{
        let areaData = data;
        if (data.id) {
            areaData = Object.assign({}, areaData, { id: data.id });
            updateZoneById(project.id, parentParentNode.id, parentNode.id, areaData, (response) => {
                dispatch(updatePlayerAreaData(Object.assign({}, areaData, {type:'area'}), parentParentNode, parentNode, playerData));
            });
        } else {
            addZone(project.id, parentParentNode.id, parentNode.id, areaData, response => {
                dispatch(updatePlayerAreaData(Object.assign({}, areaData, { id: response.regionId }, {type:'area'}), parentParentNode, parentNode, playerData));
            });
        }
    }
}

function addUpdateItem(data, project, parentParentNode, parentNode, curNode){
    return dispatch=>{
        updateItemById(project.id, parentParentNode.id, parentNode.id, curNode.id, data, response => {
            dispatch(requestItemList(parentParentNode.id, parentNode.id, curNode.id));
        });
    }
}

function updatePlayerPlanData(response, playerData){
    return dispatch=>{
        const newPlayerData = playerData.map(plan => {
            if ((typeof plan.id === 'string' && plan.id.indexOf('plan&&') > -1) || plan.id == response.id) {
                return Object.assign({}, plan, response);
            }

            return plan;
        });

        dispatch(updateCurNode(response));
        dispatch(updateTreeList(newPlayerData));
    }
}

function updatePlayerSceneData(response, parentNode, playerData){
    return dispatch=>{
        let index = lodash.findIndex(playerData, plan => { return plan.id == parentNode.id; });
        playerData[index].children = playerData[index].children.map(scene => {
            if ((typeof scene.id === 'string' && scene.id.indexOf('scene&&') > -1) || scene.id == response.id) {
                return Object.assign({}, scene, response);
            }

            return scene;
        });

        dispatch(updateCurNode(response, playerData[index]));
        dispatch(updateTreeList(playerData));
    }
}

function updatePlayerAreaData(response, parentParentNode, parentNode, playerData){
    return dispatch=>{
        let planIndex = lodash.findIndex(playerData, plan => { return plan.id == parentParentNode.id; });
        let sceneIndex = lodash.findIndex(playerData[planIndex].children, scene => { return scene.id == parentNode.id; });
        playerData[planIndex].children[sceneIndex].children = playerData[planIndex].children[sceneIndex].children.map(area => {
            if ((typeof area.id === 'string' && area.id.indexOf('area&&') > -1) || area.id == response.id) {
                return Object.assign({}, area, response);
            }

            return area;
        });

        dispatch(updateCurNode(response, playerData[planIndex].children[sceneIndex], playerData[planIndex]));
        dispatch(updateTreeList(playerData));
        dispatch(requestItemList(parentParentNode.id, parentNode.id, response.id));
    }

}

export function treeOnRemove(node){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const sCurNode = getState().mediaPublish.curNode;
        const sParentNode = getState().mediaPublish.parentNode;
        const sParentParentNode = getState().mediaPublish.parentParentNode;
        const playerData = getState().mediaPublish.playerData;
        const sCurSceneItem = getState().mediaPublish.curSceneItem;

        let parentNode = getTreeParentNode(playerData, node);
        let parentParentNode = getTreeParentNode(playerData, parentNode);
        if (sCurNode && node.type === sCurNode.type && node.id === sCurNode.id
            || sParentNode && parentNode.type === sParentNode.type && parentNode.id === sParentNode.id
            || sParentParentNode && parentParentNode.type === sParentParentNode.type && parentParentNode.id === sParentParentNode.id) {
            dispatch(initItemList());
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
                    const curSceneItem = removeArea(sCurSceneItem, project.id, parentParentNode.id, parentNode.id, node.id);
                    dispatch(updateTreeList(removeTree(playerData, node)));
                    dispatch(updateCurSceneItem(curSceneItem));
                });
                break;
            default:
                break;
        }
    }
}

export function treeOnMove(key, node){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const playerData = getState().mediaPublish.playerData;

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

export function playerAssetRemove(item){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const parentParentNode = getState().mediaPublish.parentParentNode;
        const parentNode = getState().mediaPublish.parentNode;
        const curNode = getState().mediaPublish.curNode;

        const itemId = item.get('id');
        removeItemById(project.id, parentParentNode.id, parentNode.id, curNode.id, itemId, item.get('type'), data => {
            dispatch(requestItemList(parentParentNode.id, parentNode.id, curNode.id));
        });
    }
}

export function playerAssetMove(id, item){
    return (dispatch, getState)=>{
        const project = getState().mediaPublish.project;
        const parentParentNode = getState().mediaPublish.parentParentNode;
        const parentNode = getState().mediaPublish.parentNode;
        const curNode = getState().mediaPublish.curNode;
        const playerListAsset = getState().mediaPublish.playerListAsset;
        console.log('move:', playerListAsset.get('list').toJS());
        const itemId = item.get('id');
        const list = playerListAsset.get('list');
        const curIndex = getIndexByKey(list, 'id', itemId);

        let newPlayerListAsset = playerListAsset.update('list', v => v.splice(curIndex, 1));
        dispatch({type: LOCAL_UPDATE_ITEM_LIST, data: newPlayerListAsset});
        newPlayerListAsset = newPlayerListAsset.update('list', v => v.splice(id == 'left' ? curIndex - 1 : curIndex + 1, 0, item))
        dispatch({type: LOCAL_UPDATE_ITEM_LIST, data:newPlayerListAsset})
        console.log(newPlayerListAsset.get('list').toJS());
        updateItemOrders(project.id, parentParentNode.id, parentNode.id, curNode.id, getListObjectByKey(newPlayerListAsset.get('list').toJS(), 'id'));
    }
}

function updateCurSceneItem(curSceneItem) {
    return {
        type: UPDATE_CUR_SCENE_ITEM,
        data: curSceneItem
    }
}

export function updateItemEdit(isEdit) {
    return {
        type: UPDATE_ITEM_EDIT,
        data: isEdit
    }
}