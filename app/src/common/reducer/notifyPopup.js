/**
 * Created by a on 2017/9/4.
 */
import {
    NOTIFY_ADD,
    NOTIFY_ANIMATION,
    NOTIFY_REMOVE,
    NOTIFY_DELETE
} from '../actionTypes/notifyPopup'

import Immutable from 'immutable';
import {getIndexByKey} from '../../util/algorithm'
const initialState = {
    notifyList:[
       /* {id:1, notifyType:1, text:"正确正确。。。。"},
        {id:2, notifyType:0, text:"失败失败。。。。"}*/
    ],


};

export default function treeView(state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case NOTIFY_ADD:
            return state.update('notifyList', v=>v.push(Immutable.fromJS(Object.assign({animation:0}, action.data))));
        case NOTIFY_ANIMATION:
            let curIndex = getIndexByKey(state.get('notifyList'), 'id', action.id);
            if(curIndex<0){
                return state;
            }
            return state.updateIn(['notifyList', curIndex, 'animation'], v=>1);
        case NOTIFY_REMOVE:
            let removeIndex = getIndexByKey(state.get('notifyList'), 'id', action.id);
            if(removeIndex<0){
                return state;
            }
            return state.updateIn(['notifyList', removeIndex, 'animation'], v=>0);
        case NOTIFY_DELETE:
            let delIndex = getIndexByKey(state.get('notifyList'), 'id', action.id);
            if(delIndex<0){
                return state;
            }
            return state.update('notifyList', v=>v.splice(delIndex, 1));
        default:
            return state;
    }
}