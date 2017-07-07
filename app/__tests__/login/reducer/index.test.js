/**
 * Created by a on 2017/6/30.
 */
import reducer,{initialState as state,updateData,setStyle} from '../../../src/login/reducer/index'
import * as types from '../../../src/login/actionType'
import Immutable from 'immutable';
describe('login reducer', ()=>{
    it('should return the initial state', ()=>{
        expect(reducer(undefined, {})).toEqual(state)
    })

    // it('should handle login_success', ()=>{
    //     expect(reducer(state, {
    //         type: types.STARRIVER_LOGIN_SUCCESS
    //     })).toEqual(state)
    // })

    it('should handle login_change', ()=>{
        expect(reducer({
            style: { visibility: 'hidden' },
            user: { 
                username: '',
                password: '',
            }
        }, {
            type: types.STARRIVER_LOGIN_CHANGE,
            data:{
                id:'username',
                data:'xxx'
            }
        })).toEqual({
            style: { visibility: 'hidden' },
            user: { 
                username: 'xxx',
                password: '',
            }
        })
    })

    it('should handle login_fail', ()=>{
        expect(reducer({
            style: { visibility: 'hidden' },
            user: { 
                username: '',
                password: '',
            }
        }, {
            type: types.STARRIVER_LOGIN_FAIL
        })).toEqual({
            style: { visibility: 'visible' },
            user: { 
                username: '',
                password: '',
            }
        })
    })

    it('should handle login_onfocus', ()=>{
        expect(reducer({
            style: { visibility: 'visible' },
            user: { 
                username: '',
                password: '',
            }
        }, {
            type: types.STARRIVER_LOGIN_FOCUS
        })).toEqual({
            style: { visibility: 'hidden' },
            user: { 
                username: '',
                password: '',
            }
        })
    })
})
test('updateData',() => {
    const before = {
        style: { visibility: 'hidden' },
        user: { 
            username: '',
            password: '',
        }
    }
    const after = {
        style: { visibility: 'hidden' },
        user: { 
            username: 'xxx',
            password: '',
        }
    }
    expect(updateData(before, {data:{id:'username',data:'xxx'}})).toEqual(after);
});

test('setStyle',() => {
    const before = {
        style: { visibility: 'hidden' },
        user: { 
            username: '',
            password: '',
        }
    }
    const after = {
        style: { visibility: 'visible' },
        user: { 
            username: '',
            password: '',
        }
    }
    expect(setStyle(before, 'visible')).toEqual(after);
});