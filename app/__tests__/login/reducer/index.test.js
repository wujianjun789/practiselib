/**
 * Created by a on 2017/6/30.
 */
import reducer from '../../../src/login/reducer/index'
import * as types from '../../../src/login/actionType'
import Immutable from 'immutable';
describe('login reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(reducer(undefined, {}).toJS()).toEqual({
            isLogin: false
        })
    })

    // it('should handle login_success', ()=>{
    //     expect(reducer({isLogin:false}, {
    //         type: types.STARRIVER_LOGIN_SUCCESS
    //     })).toEqual({
    //         isLogin: false
    //     })
    // })
})