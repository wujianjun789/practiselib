/**
 * Created by a on 2017/6/29.
 */
import * as actions from '../../../src/login/action/index'
import * as types from '../../../src/login/actionType/index'

describe('actions', ()=>{
    it('should create an action to login success/fail/focus', ()=>{
        const expectedAction_success = {
            type: types.STARRIVER_LOGIN_SUCCESS
        }

        const expectedAction_fail = {
            type: types.STARRIVER_LOGIN_FAIL
        }

        const expectedAction_change = {
            type: types.STARRIVER_LOGIN_CHANGE
        }

        const expectedAction_focus = {
            type: types.STARRIVER_LOGIN_FOCUS
        }

        // expect(actions.loginSuccess()).toEqual(expectedAction_success);
        expect(actions.loginFail()).toEqual(expectedAction_fail);
        expect(actions.onChange()).toEqual(expectedAction_change);
        expect(actions.onFocus()).toEqual(expectedAction_focus);
    })
})