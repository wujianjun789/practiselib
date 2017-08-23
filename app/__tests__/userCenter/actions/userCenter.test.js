import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../../src/common/actions/userCenter';
// import * as types from '../../../src/common/actionTypes/';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const confirmExit = jest.fn(() => dispatch => {
    dispatch({ type: types.USERCENTER_POPUP_CONFIRM_EXIT });
});

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('creates USERCENTER_POPUP_CONFIRM_EXIT when fetching todos has been done', () => {
    // const expectedActions = [
    //   { type: types.USERCENTER_POPUP_CONFIRM_EXIT }
    // ];
    // const store = mockStore({});

    // store.dispatch(confirmExit());
    // expect(store.getActions()).toEqual(expectedActions);
  })
})