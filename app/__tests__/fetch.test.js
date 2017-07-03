/**
 * Created by a on 2017/6/30.
 */
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import nock from 'nock'

import { getHttpHeader, httpRequest} from '../src/util/network'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
describe('async httpRequest', ()=>{
    afterEach(()=>{
        nock.cleanAll()
    })

    it('creates httpRequest', done=>{
        nock('http://example.com/')
            .get('/todos')
            .reply(200, { body: { todos: ['do something'] } })
        const expectedData = { body: { todos: ['do something'] } };

        return httpRequest('http://example.com/todos', {
            headers: getHttpHeader,
            method: 'GET'
        },(response=>{
            expect(response).toEqual(expectedData)
            done();
        }))
    })
})