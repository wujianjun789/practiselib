/**
 * Created by a on 2017/7/21.
 */
import * as actions from '../../../src/assetManage/action/index'
import * as types from '../../../src/assetManage/actionType/index'

describe('actions', ()=>{
    it('create an action', ()=>{
        const data = {}
        const expectedAction = {
            type: types.SIDEBAR_TOGGLE,
            data: data
        }

        expect(actions.sideBarToggled(data)).toEqual(expectedAction);
    })
})