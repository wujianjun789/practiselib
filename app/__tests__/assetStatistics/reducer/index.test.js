/**
 * Created by a on 2017/7/10.
 */
import  reducer from '../../../src/assetStatistics/reducer/index'
import  * as types from '../../../src/assetStatistics/actionType/index'
import Immutable from 'immutable';

let initialState = {
    data: [
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
            vendor_info:"上海三思", con_type:485},
        {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
            vendor_info:"上海三思", con_type:485}
    ],
    domain:{list:[{id:1, value:'域'},{id:2, value:'域2'}], value:'域'},
    device:{list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], value:'灯集中控制器'},
    search:{placeholder:'输入素材名称', value:''}
}

describe("reducer", ()=>{
    it('should return the initial state', ()=>{
        expect(reducer(undefined, {})).toEqual(Immutable.fromJS(initialState
        ))
    })

    it('should handle ON_CHANGE', ()=>{
        expect(reducer(Immutable.fromJS(initialState), {
            type: types.ON_CHANGE,
            id: 'domain',
            data: 1
        })).toEqual(Immutable.fromJS({
            data: [
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485},
                {domain:"闵行区", deviceName:"灯集中控制器", soft_v:"1.0", sys_v:"1.0", core_v:"1.0", har_v:"1.0",
                    vendor_info:"上海三思", con_type:485}
            ],
            domain:{list:[{id:1, value:'域'},{id:2, value:'域2'}], value:'域2'},
            device:{list:[{id:1, value:'灯集中控制器'},{id:2, value:'集中控制'}], value:'灯集中控制器'},
            search:{placeholder:'输入素材名称', value:''}
        }))
    })
})