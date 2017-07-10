/**
 * Created by a on 2017/4/21.
 */
import {
    ON_CHANGE
} from '../actionType/index'
import Immutable from 'immutable';
const initialState = {
    data: [
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
        vendor_info:"上海三思", con_type:485},
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
        vendor_info:"上海三思", con_type:485}
    ],
    domain:{list:[{id:1, value:'域'},{id:2, value:'域2'}], value:'域'},
    device:{list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], value:'灯集中控制器'},
    search:{placeholder:'输入素材名称', value:''}
};


export default function assetStatistics (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        case ON_CHANGE:
            if(action.id == 'search'){
                return state.updateIn([action.id, 'value'], (v)=>action.data);
            }

            return state.updateIn([action.id, 'value'], (v)=>{
                return state.getIn([action.id, 'list', action.data, 'value'])
            })
            break;
        default:
            return state;
    }
}