/**
 * Created by a on 2017/7/21.
 */
import reducer from '../../../src/assetManage/reducer/index'
import * as types from '../../../src/assetManage/actionType/index'
import Immutable from 'immutable'

let initialState = {
    sidebarNode: null
}

describe('assetManage reducer', ()=>{
    it('return initial state', ()=>{
        expect(reducer(undefined, {})).toEqual(Immutable.fromJS(initialState))
    })

    it('handle SIDEBAR_TOGGLE', ()=>{
        expect(reducer(Immutable.fromJS(initialState), {
            type: types.SIDEBAR_TOGGLE,
            data: {}
        }).toJS()).toEqual({
            sidebarNode:{}
        })
    })
})

