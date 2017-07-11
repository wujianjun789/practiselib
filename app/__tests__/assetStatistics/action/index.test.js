/**
 * Created by a on 2017/7/10.
 */
// import * as actions from '../../../src/assetStatistics/action/index'
import * as types from '../../../src/assetStatistics/actionType/index'

describe('actions', ()=>{
    it('create an action', ()=>{
        const id = 'domain'
        const data = 2
        const expectedAction = {
            type: types.ON_CHANGE,
            id: id,
            data: data
        }

        // expect(actions.onChange(id, data)).toEqual(expectedAction);
    })
})