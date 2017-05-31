import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
import { ACTIVE_CHANGE, SEARCH } from '../../src/actionTypes'
import { active, search } from '../../src/actions';


test('test active', () => {
    expect(active(1)).toEqual({ type: ACTIVE_CHANGE, index: 1 })
})

test('test search', () => {

    expect(search('hello')).toEqual({ type: SEARCH, value: 'hello' })
})
