/**
 * Created by a on 2017/7/27.
 */
import * as actions from '../../../src/domainManage/action/index'
import * as types from '../../../src/domainManage/actionType/index'

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