import app, {initialState as state, moduleInfo, moduleInit} from '../../../src/app/reducer/index';
import * as actionTypes from '../../../src/app/actionType';

test('test app reducer', () => {
	expect(app(undefined, {})).toEqual(state);

	const data = Object.keys(moduleInfo).map(key => ({key}) );
	const expectItems = [];
	Object.keys(moduleInfo).forEach(key =>{
		expectItems.push(moduleInfo[key]);
	});
	const action = {type: actionTypes.MODULE_INIT, data: data};
	expect(app(undefined, action )).toEqual({...state, items: expectItems });
});

test('test moduleInit function', () => {
	const data1 = [{key: 'default'}];
	expect(moduleInit({}, data1)).toEqual({items: [{key: '', title: '', link: '/'}]});
})
