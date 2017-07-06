/**
 * Created by a on 2017/4/21.
 */

import Immutable from 'immutable';
const initialState = {
    data: [
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
        vendor_info:"上海三思", con_type:485},
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
        vendor_info:"上海三思", con_type:485}
    ]
};


export default function assetManage (state=Immutable.fromJS(initialState), action) {
    switch(action.type) {
        default:
            return state;
    }
}