/**
 * Created by a on 2018/3/8.
 */
import {

} from '../actionType/index'

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
    item: null      //播放项
};


export default function mediaPublishProject(state=initialState, action) {
    switch(action.type) {
        default:
            return state;
    }
}