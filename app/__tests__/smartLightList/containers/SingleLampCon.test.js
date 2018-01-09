/**
 * Created by Azrael on 2017/9/27
 */
jest.mock('../../../src/util/network.js');
jest.mock('../../../src/api/asset.js');
jest.mock('../../../src/api/domain.js');
import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import SingleLampCon from '../../../src/smartLightList/containers/SingleLampCon';

const store = configureStore();
describe('<SingleLampCon />', () => {
	it('default render', () => {
		const root = mount(<Provider store={store}>
				<IntlProvider>
					<SingleLampCon />
				</IntlProvider>
			</Provider>);
		const cmp = root.find('SingleLampCon');
		const content = cmp.find('Content');
		expect(!content.hasClass('collapse')).toBeTruthy();

		// const select = cmp.find('#domain');
		// const domainList_state = cmp.state('domainList');
		// const currentDomain_state = cmp.state('currentDomain');
		// Object.keys(domainList_state).forEach(item => {
		// 	expect(select.prop(item)).toEqual(domainList_state[item]);
		// });
		// expect(select.prop('value')).toEqual(currentDomain_state == null ? '' : currentDomain_state[domainList_state.valueField]);
        //
		// const searchText = cmp.find('SearchText');
		// const search_state = cmp.state('search');
		// Object.keys(search_state).forEach(item => {
		// 	expect(searchText.prop(item)).toBe(search_state[item]);
		// });

		// const tableWithHeader = cmp.find('TableWithHeader');
		// const inst = root.instance();
		// const columns = inst.columns;
		// expect(tableWithHeader.prop('columns')).toEqual(columns);

		// const tableTrs = cmp.find('TableTr');
		// const deviceList_state = root.state('deviceList');
		// const currentDevice_state = root.state('currentDevice');
		// deviceList_state.forEach((item, index) => {
		// 	let curTr = tableTrs.at(index);
		// 	expect(curTr.key()).toBe(item.id);
		// 	expect(curTr.prop('data')).toEqual(item);
		// 	expect(curTr.prop('columns')).toEqual(columns);
		// 	expect(curTr.prop('activeId')).toBe(currentDevice_state.id);
		// });

		// const page = cmp.find('Page');
		// const page_state = root.state('page');
		// expect(page.hasClass('hidden')).toBe(page_state.total == 0 ? true : false);
		// expect(page.prop('pageSize')).toBe(page_state.limit);
		// expect(page.prop('current')).toBe(page_state.current);
		// expect(page.prop('total')).toBe(page_state.total);

		const sidebarInfo = cmp.find('.sidebar-info');
		expect(!sidebarInfo.hasClass('sidebar-collapse')).toBeTruthy();

		// 测试icon className
		expect(sidebarInfo.find('.icon_vertical').length).toBe(1);

		const panel1 = sidebarInfo.find('.panel-1');
		// expect(panel1.find('.panel-heading').text()).toBe('选中设备');
		// expect(panel1.find('.panel-body span').text()).toBe(currentDevice_state == null ? '' : currentDevice_state.name);
		// expect(panel1.find('.panel-body span').props().title).toBe(currentDevice_state == null ? '' : currentDevice_state.name);

		const panel2 = sidebarInfo.find('.panel-2');
		// expect(panel2.find('.panel-heading').text()).toBe('设备操作');
		const panelBody = panel2.find('.panel-body');
		expect(panelBody.children('div').length).toBe(2);

		// expect(panelBody.childAt(0).find('.tit').text()).toBe('设备开关：');
		// const deviceSwitchList_state = root.state('deviceSwitchList');
		// Object.keys(deviceSwitchList_state).forEach(item => {
		// 	expect(panelBody.childAt(0).find('Select').prop(item)).toEqual(deviceSwitchList_state[item]);
		// });
		// const currentSwitchStatus_state = root.state('currentSwitchStatus');
		// expect(panelBody.childAt(0).find('Select').prop('value')).toBe(currentSwitchStatus_state);
		// expect(panelBody.childAt(0).find('Select').prop('disabled')).toBe(deviceList_state.length == 0 ? true : false);
		// // expect(panelBody.childAt(0).find('button').text()).toBe('应用');
		// expect(panelBody.childAt(0).find('button').prop('disabled')).toBe(deviceList_state.length == 0 ? true : false);

		// expect(panelBody.childAt(1).find('.tit').text()).toBe('调光：');
		// const brightnessList_state = root.state('brightnessList');
		// Object.keys(brightnessList_state).forEach(item => {
		// 	expect(panelBody.childAt(1).find('Select').prop(item)).toEqual(brightnessList_state[item]);
		// });
		// const currentBrightness_state = root.state('currentBrightness');
		// expect(panelBody.childAt(1).find('Select').prop('value')).toBe(currentBrightness_state);
		// expect(panelBody.childAt(1).find('Select').prop('disabled')).toBe(deviceList_state.length == 0 ? true : false);
		// // expect(panelBody.childAt(1).find('button').text()).toBe('应用');
		// expect(panelBody.childAt(1).find('button').prop('disabled')).toBe(deviceList_state.length == 0 ? true : false);
	});

	it('simulate click', () => {
		const root = mount(<Provider store={store}>
			<IntlProvider>
				<SingleLampCon />
			</IntlProvider>
		</Provider>);

		const cmp = root.find('SingleLampCon');
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
		root.setState({domainList});
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
		// const currentDevice = deviceList[0];
		// root.setState({deviceList, currentDevice});
		// const tableTrs = cmp.find('TableTr');
		// tableTrs.at(1).find('tr').simulate('click');
		// expect(root.state('currentDevice')).toEqual(deviceList[1]);

		let deviceSwitch = cmp.find('#deviceSwitch');
		event = {target: { id: 'deviceSwitch', value: 'off'}};
		deviceSwitch.find('select').simulate('change', event);
		deviceSwitch = cmp.find('#deviceSwitch');
		expect(deviceSwitch.prop('value')).toBe(event.target.value);

		let dimming = cmp.find('#dimming');
		event = {target: { id: 'dimming', value: '30'}};
		dimming.find('select').simulate('change', event);
		dimming = cmp.find('#dimming');
		expect(dimming.prop('value')).toBe(event.target.value);


	});

	it('default render snapshot', () => {
		const cmp = renderer.create(<Provider store={store}>
			<IntlProvider>
				<SingleLampCon />
			</IntlProvider>
		</Provider>);
		expect(cmp.toJSON()).toMatchSnapshot();
	})
})
