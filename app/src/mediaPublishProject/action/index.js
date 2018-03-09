/**
 * Created by a on 2018/3/8.
 */
import {
  INIT_PROJECT,
  INIT_PROGRAM_LIST,
  INIT_PLAN,
  INIT_SCENE_LIST,
  
  UPDATE_TREE_JUDGE,
} from '../actionType/index';

import {getProgramList, getSceneList} from '../../api/mediaPublish';
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
    dispatch(requestSceneList(plan.id))
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

export function updateTreeJudge(IsUpdateTree) {
  return {
    type: UPDATE_TREE_JUDGE,
    data: IsUpdateTree
  }
}