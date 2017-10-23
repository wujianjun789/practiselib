jest.mock('../../../src/util/cache.js');
import * as types from '../../../src/app/actionType';
import * as actions from '../../../src/app/action';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('async actions', () => {
	afterEach(() => {
		nock.cleanAll();
	});

	it('crate MODULE_INIT when getModule has been done', () => {
		const replyData = [
			{"key":"asset","title":"资产管理","link":"/assetManage/manage"},
			{"key":"permission","title":"权限管理","link":"/permissionManage"},
			{"key":"maintenance","title":"系统运维","link":"/systemOperation"},
			{"key":"control","title":"系统控制","link":"/"},
			{"key":"light","title":"智能照明","link":"/light"},
			{"key":"report","title":"报表管理","link":"/"},
			{"key":"publish","title":"媒体发布","link":"/"},
			{"key":"visual","title":"可视化","link":"/"},
			{"key":"domain","title":"域管理","link":"/domainManage/domainEdit"}
		];
		nock('http://example.com/')
			.get('/config/module')
			.reply(200, replyData);

		const expectedActions = [
			{type: types.MODULE_INIT, data: replyData}
		];

		const store = mockStore({items: []});

		return store.dispatch(actions.getModule(()=>{
			expect(store.getActions()).toEqual(expectActions);
		}));
	});
});
