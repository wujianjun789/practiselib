/**
 * Created by a on 2017/7/10.
 */
import  reducer from '../../../src/assetStatistics/reducer/index'
import  * as types from '../../../src/assetStatistics/actionType/index'
import Immutable from 'immutable';

let initialState = {

}

describe("reducer", ()=>{
    it('should return the initial state', ()=>{
        expect(reducer(undefined, {})).toEqual(Immutable.fromJS(initialState
        ))
    })
})