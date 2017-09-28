/**
 * Created by Azrael on 2017/9/27
 */
jest.mock('../../../src/util/network.js');
jest.mock('../../../src/api/asset.js');
jest.mock('../../../src/api/domain.js');
import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import Content from '../../../src/components/Content';
import SearchText from '../../../src/components/SearchText';
import Select from '../../../src/components/Select.1';
import TableWithHeader from '../../../src/smartLightList/components/TableWithHeader';
import TableTr from '../../../src/smartLightList/components/TableTr';
import Page from '../../../src/components/Page';
import Xes from '../../../src/smartLightList/containers/Xes';
import {getDomainList} from '../../../src/api/domain';
import {getSearchAssets, getSearchCount, getDeviceStatusByModelAndId} from '../../../src/api/asset';

describe('<Xes />', () => {
	it('default render', () => {
		const cmp = shallow(<Xes />);

		const content = cmp.find('Content');
		expect(!content.hasClass('collapse')).toBeTruthy();

		const select = cmp.find('#domain');
		const domainList_state = cmp.state('domainList');
		const currentDomain_state = cmp.state('currentDomain');
		Object.keys(domainList_state).forEach(item => {
			expect(select.prop(item)).toEqual(domainList_state[item]);
		});
		expect(select.prop('value')).toEqual(currentDomain_state == null ? '' : currentDomain_state[domainList_state.valueField]);

		const searchText = cmp.find('SearchText');
		const search_state = cmp.state('search');
		Object.keys(search_state).forEach(item => {
			expect(searchText.prop(item)).toBe(search_state[item]);
		});

		const tableWithHeader = cmp.find('TableWithHeader');
		const inst = cmp.instance();
		const columns = inst.columns;
		expect(tableWithHeader.prop('columns')).toEqual(columns);

		const tableTrs = cmp.find('TableTr');
		const deviceList_state = cmp.state('deviceList');
		const currentDevice_state = cmp.state('currentDevice');
		deviceList_state.forEach((item, index) => {
			let curTr = tableTrs.at(index);
			expect(curTr.key()).toBe(item.id);
			expect(curTr.prop('data')).toEqual(item);
			expect(curTr.prop('columns')).toEqual(columns);
			expect(curTr.prop('activeId')).toBe(currentDevice_state.id);
		});

		const page = cmp.find('Page');
		const page_state = cmp.state('page');
		expect(page.hasClass('hidden')).toBe(page_state.total == 0 ? true : false);
		expect(page.prop('pageSize')).toBe(page_state.limit);
		expect(page.prop('current')).toBe(page_state.current);
		expect(page.prop('total')).toBe(page_state.total);

		const sidebarInfo = cmp.find('.sidebar-info');
		expect(!sidebarInfo.hasClass('sidebar-collapse')).toBeTruthy();

		// 测试icon className
		expect(sidebarInfo.find('.icon_verital').length).toBe(1);

		const panel1 = sidebarInfo.find('.panel-1');
		expect(panel1.find('.panel-heading').text()).toBe('选中设备');
		expect(panel1.find('.panel-body span').text()).toBe(currentDevice_state == null ? '' : currentDevice_state.name);
		expect(panel1.find('.panel-body span').props().title).toBe(currentDevice_state == null ? '' : currentDevice_state.name);
	});

	it('simulate click', () => {
		const cmp = mount(<Xes />);
		let content = cmp.find('Content');
		expect(!content.hasClass('collapse')).toBeTruthy();
		content.find('.sidebar-info .collapse-container').simulate('click');
		content = cmp.find('Content');
		expect(content.hasClass('collapse')).toBeTruthy();
		expect(content.find('.sidebar-info').hasClass('sidebar-collapse')).toBeTruthy();
		expect(content.find('.sidebar-info .collapse-container span').hasClass('icon_horizontal')).toBeTruthy();
		content.find('.sidebar-info .collapse-container').simulate('click');
		content = cmp.find('Content');

		const domainList = {
			titleField: 'name',
			valueField: 'name',
			options: [{id: 1, name: '域一'},{id: 2, name: '域二'}]
		}
		cmp.setState({domainList});
		const _select = cmp.find('#domain');
		let event = {target: {id: 'domain', selectedIndex: 0}};
		_select.find('select').simulate('change', event);
		expect(_select.prop('value')).toBe(domainList.options[event.target.selectedIndex].name);

		const searchText = cmp.find('SearchText');
		event = {target: {value: '搜索'}};
		searchText.find('input').simulate('change', event);
		expect(searchText.prop('value')).toBe(event.target.value);

		const deviceList = [
			{id: 0, name: '设备1', online: true},
			{id: 1, name: '设备2', online: false}
		];
		const currentDevice = deviceList[0];
		cmp.setState({deviceList, currentDevice});
		const tableTrs = cmp.find('TableTr');
		tableTrs.at(1).find('tr').simulate('click');
		expect(cmp.state('currentDevice')).toEqual(deviceList[1]);
	});

	it('default render snapshot', () => {
		const cmp = renderer.create(<Xes />);
		expect(cmp.toJSON()).toMatchSnapshot();
	})
})
