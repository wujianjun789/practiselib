/**
 * Created by Azrael on 2017/9/28
 */
jest.mock('../../../src/util/network.js');
jest.mock('../../../src/api/strategy.js');
jest.mock('../../../src/api/asset.js');
import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Immutable from 'immutable';
import {SensorStrategy} from '../../../src/controlStrategy/container/SensorStrategy';

describe('<SensorStrategy />', () => {
	it('default render', () => {
		const cmp = shallow(<SensorStrategy />);

		const searchText = cmp.find('SearchText');
		const search_state = cmp.state('search');
		Object.keys(search_state).forEach(item => {
			expect(searchText.prop(item)).toBe(search_state[item]);
		});

		const btn = cmp.find('#add-sensor');
		expect(btn.text()).toBe('添加');
		expect(btn.hasClass('btn btn-primary')).toBeTruthy();

		const table = cmp.find('Table');
		const inst = cmp.instance();
		const columns = inst.columns;
		const data_state = cmp.state('data');
		expect(table.props().columns).toEqual(columns);
		expect(table.props().keyField).toBe('id');
		expect(table.props().data).toEqual(Immutable.fromJS(data_state));
		expect(table.props().isEdit).toBe(true);

		const page = cmp.find('.pagination Page');
		const page_state = cmp.state('page');
		expect(page.hasClass('hidden')).toBe(page_state.total == 0 ? true : false);
		expect(page.props().showSizeChanger).toBe(true);
		Object.keys(page_state).forEach(item => {
			expect(page.props()[item]).toBe(page_state[item]);
		});
	});

	it('simulate event', () => {
		const cmp = mount(<SensorStrategy />);

		const searchText = cmp.find('SearchText');
		const event = {target: {value: '搜索'}};
		searchText.find('input').simulate('change', event);
		expect(searchText.prop('value')).toBe(event.target.value);
	});

	it('default render snapshot', () => {
		const cmp = renderer.create(<SensorStrategy />);
		expect(cmp.toJSON()).toMatchSnapshot();
	});
});

