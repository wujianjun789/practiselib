/**
 * Created by a on 2017/6/29.
 */
import * as actions from '../../../src/login/action/index'
import * as types from '../../../src/login/actionType/index'

describe('actions', ()=>{
    it('should create an action to login success', ()=>{
        const expectedAction_success = {
            type: types.STARRIVER_LOGIN_SUCCESS
        }

        const expectedAction_fail = {
            type: types.STARRIVER_LOGIN_FAIL
        }

        expect(actions.loginSuccess()).toEqual(expectedAction_success)
        expect(actions.loginFail()).toEqual(expectedAction_fail)
    })
})