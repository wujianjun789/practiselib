/**
 * Created by a on 2017/10/18.
 */
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
    UPDATE_CUR_SCENE_ITEM,

    INIT_CUR_TYPE,
    INIT_CURNODE,

    UPDATE_TREE_JUDGE,
    UPDATE_TREE_DATA,
    UPDATE_TREE_LIST,
    CLEAR_TREE_STATE,

    ADD_ITEM_TO_SCENE,

    SIDEBAR_TOGGLE,
} from '../actionType/index'

import Immutable from 'immutable';
import lodash from 'lodash';
import {getIndexByKey} from '../../util/algorithm';
import {updateTree, clearTreeListState, IsSystemFile, addItemToScene} from '../util/index'
const initialState = {
    sidebarNode: null,
    project: null,
    parentParentNode: null,
    parentNode: null,
    curNode: null,
    curType: 'playerProject',
    playerData: [
        /*{
         'id': 'player1',
         'type': 'plan',
         'name': '播放计划1',
         'toggled': true,
         'active': false,
         'level': 1,
         'children': [
         {
         'id': 'scene1',
         'type': 'scene',
         'name': '场景1',
         'toggled': true,
         'class': '',
         'active': false,
         'children': [
         {
         'id': 'area1',
         'type': 'area',
         'name': '区域1',
         'active': true,
         }, {
         'id': 'area2',
         'type': 'area',
         'name': '区域2',
         'active': false,
         },
         ],
         },
         {
         'id': 'scene2',
         'type': 'scene',
         'name': '场景2',
         'toggled': false,
         'class': '',
         'active': false,
         'children': [],
         },
         ],
         },
         {
         'id': 'player2',
         'type': 'plan',
         'name': '播放计划2',
         'toggled': false,
         'level': 1,
         'children': [
         {
         'id': 'scene3',
         'type': 'scene',
         'name': '场景3',
         'toggled': true,
         'class': '',
         'active': false,
         'children': [],
         },
         ],
         },
         {
         'id': 'player3',
         'type': 'plan',
         'name': '播放计划3',
         'toggled': false,
         'level': 1,
         'children': [],
         },*/
    ],
    IsUpdateTree: true,
    playerListAsset: Immutable.fromJS({
        list: [/*{ id: 1, name: '素材1', assetType: "system", type: "text" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
         { id: 4, name: '素材4', assetType: "source", type: "timing" }, { id: 5, name: '素材5', assetType: "source", type: "video" }, { id: 6, name: '素材6', assetType: "source", type: "picture" }*/],
        id: 1, name: '素材1', isEdit: true,
    }),

    curSceneItem:{}
};


export default function mediaPublish(state=initialState, action) {
    switch(action.type) {
        case SIDEBAR_TOGGLE:
            return Object.assign({}, state, {sidebarNode:action.data});
        case INIT_PROJECT:
            return Object.assign({}, state, {project:action.data});
        case INIT_PROGRAM_LIST:
            return updateProgramList(state, action.data);
        case INIT_SCENE_LIST:
            return updateSceneList(state, action.programId, action.data);
        case INIT_ZONE_LIST:
            return updateZoneList(state, action.programId, action.sceneId, action.data);
        case INIT_ITEM_LIST:
            return initItemList(state);
        case LOCAL_UPDATE_ITEM_LIST:
            return localUpdateItemList(state, action.data);
        case UPDATE_ITEM_LIST:
            return updateItemList(state, action.programId, action.sceneId, action.zoneId, action.data);
        case UPDATE_ITEM_NAME:
            return updateItemName(state, action.item, action.file);
        case UPDATE_ITEM_SELECT:
            return updateItemSelect(state, action.data);
        case UPDATE_ITEM_CANCEL:
            return updateItemCancel(state);
        case UPDATE_ITEM_EDIT:
            return Object.assign({}, state, {playerListAsset: state.playerListAsset.update('isEdit', v => action.data)});
        case UPDATE_CUR_SCENE_ITEM:
            return Object.assign({}, state);
        case INIT_CUR_TYPE:
            return Object.assign({}, state, {curType: action.curType, isClick: action.isClick});
        case INIT_CURNODE:
            return Object.assign({}, state, {parentParentNode: action.parentParentNode, parentNode: action.parentNode, curNode: action.curNode});
        case UPDATE_TREE_JUDGE:
            return Object.assign({}, state, {IsUpdateTree: action.data});
        case UPDATE_TREE_DATA:
            return updateTreeData(state, action.node, action.parentNode, action.parentParentNode);
        case UPDATE_TREE_LIST:
            return Object.assign({}, state, {playerData: action.data, IsUpdateTree: true});
        case CLEAR_TREE_STATE:
            clearTreeListState(state.playerData);
            return Object.assign({}, state, {playerData: state.playerData, IsUpdateTree: true});
        case ADD_ITEM_TO_SCENE:
            const sceneItem = addItemToScene(state.curSceneItem, state.project.id, action.programId, action.sceneId, action.zoneId, action.data);
            return Object.assign({}, state, {sceneItem:sceneItem});
        default:
            return state;
    }
}

function initItemList(state){
    return Object.assign({}, state, {playerListAsset: state.playerListAsset.update('list', v => Immutable.fromJS([]))});
}

function localUpdateItemList(state, data) {
    return Object.assign({}, state, {playerListAsset: Immutable.fromJS(data)});
}

function updateTreeData(state, node, parentNode, parentParentNode){
    const treeList = updateTree(state.playerData, node, parentNode, parentParentNode);

    return Object.assign({}, state, {playerData: treeList, IsUpdateTree: true});
}

function updateProgramList(state, data) {
    let newData = [];
    for(let i=0;i<data.length;i++){
        const program = data[i];
        newData.push(Object.assign({}, program, { type: 'plan', toggled: false, active: false, children: [] }));
    }

    return Object.assign({}, state, {playerData:newData, IsUpdateTree: true});
}

function updateSceneList(state, programId, data){
    let playerData = state.playerData;
    let index = lodash.findIndex(playerData, program => { return program.id == programId; });
    let newData = [];
    for(let i=0;i<data.length;i++){
        const scene = data[i];
        newData.push(Object.assign({}, scene, { type: 'scene', toggled: false, active: false, children: [] }));
    }
    clearTreeListState(state.playerData);

    playerData[index].active = true;
    playerData[index].toggled = true;
    playerData[index].children = newData;

    return Object.assign({}, state, {playerData: playerData, IsUpdateTree: true});
}

function updateZoneList(state, programId, sceneId, data){
    let playerData = state.playerData;
    let programItem = lodash.find(playerData, program => { return program.id == programId; });
    let programIndex = lodash.findIndex(playerData, program => { return program.id == programId; });

    let sceneIndex = lodash.findIndex(programItem.children, scene => { return scene.id == sceneId; });
    let newData = [];
    for(let i=0;i<data.length;i++){
        const area = data[i];
        newData.push(Object.assign({}, area, { type: 'area', active: false }));
    }

    clearTreeListState(state.playerData);

    playerData[programIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].toggled = true;
    playerData[programIndex].children[sceneIndex].active = true;
    playerData[programIndex].children[sceneIndex].children = newData;

    return Object.assign({}, state, {playerData: playerData, IsUpdateTree: true});
}

function updateItemList(state, programId, sceneId, zoneId, data){
    let newData = [];
    for(let i=0;i<data.length;i++){
        const item = data[i];
        newData.push(Object.assign({}, item, { assetType: IsSystemFile(item.type) ? 'system' : 'source' }));
    }

    if (newData && newData.length) {
        // this.playerAssetSelect(Immutable.fromJS(newData[0]));
    } else {

    }

    const sceneItem = addItemToScene(state.curSceneItem, state.project.id, programId, sceneId, zoneId, data);
    const assetItem = lodash.find(newData, item => {return item.id == state.playerListAsset.get('id');});
    state.playerListAsset = state.playerListAsset.update('id', v => assetItem ? assetItem.id : -1);

    return Object.assign({}, state, {playerListAsset: state.playerListAsset.update('list', v=>Immutable.fromJS(newData)), curSceneItem: sceneItem});
}

function updateItemName(state, item, file){
    console.log('updateItemName:', file.name);
    const { playerListAsset } = state;
    const index = getIndexByKey(playerListAsset.get('list'), 'id', item.id);
    state.playerListAsset = state.playerListAsset.updateIn(['list', index, 'name'], v => file.name);
    state.playerListAsset = state.playerListAsset.updateIn(['list', index, 'thumbnail'], v => file.thumbnail);

    return Object.assign({}, state, {playerListAsset: state.playerListAsset});
}

function updateItemCancel(state) {
    return Object.assign({}, state, {playerListAsset: state.playerListAsset.update('id', v => -1)})
}

function updateItemSelect(state, item) {
    state.playerListAsset = state.playerListAsset.update('id', v => item.get('id'));

    return Object.assign({}, state, {playerListAsset: state.playerListAsset.update('name', v=>item.get('name'))});
}
