/**
 * Created by Azrael on 2017/9/28
 */
jest.mock('../../../src/util/network.js');
jest.mock('../../../src/api/strategy.js');
jest.mock('../../../src/api/asset.js');
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import Overlayer from '../../../src/common/containers/Overlayer';
import SensorStrategy from '../../../src/controlStrategy/container/SensorStrategy';
global.d3 = require('../../../public/js/d3.min');

describe('<SensorStrategy /> HOC', () => {
	const store = configureStore();

	it('simulate add-sensor btn click', () => {
		const root = mount(
			<Provider store={store}>
				<div>
					<SensorStrategy />
					<Overlayer />
				</div>
			</Provider>
		);

		const btn = root.find('#add-sensor');
		let event = {target: {id: 'add-sensor'}};
		btn.simulate('click', event);
		let sensorStrategyPopup = root.find('SensorStrategyPopup');
		expect(sensorStrategyPopup.length).toBe(1);
		expect(sensorStrategyPopup.hasClass('sensor-strategy-popup')).toBe(true);
		expect(sensorStrategyPopup.prop('popupId')).toBe('add');
		expect(sensorStrategyPopup.prop('title')).toBe('新建策略');
		expect(sensorStrategyPopup.prop('data').id).toEqual('');
	});

	it('simulate table row edit btn click', () => {
		const root = mount(
			<Provider store={store}>
				<div>
					<SensorStrategy />
					<Overlayer />
				</div>
			</Provider>
		);

		const trs = root.find('SensorStrategy').find('Table').find('tbody').find('tr');
		const editBtn = trs.at(1).find('.edit').childAt(0);
		editBtn.simulate('click');
		let sensorStrategyPopup = root.find('SensorStrategyPopup');
		expect(sensorStrategyPopup.length).toBe(1);
		expect(sensorStrategyPopup.hasClass('sensor-strategy-popup')).toBe(true);
		expect(sensorStrategyPopup.prop('popupId')).toBe('edit');
		expect(sensorStrategyPopup.prop('title')).toBe('修改策略');
	});

	it('simulate table row delete btn click', () => {
		const root = mount(
			<Provider store={store}>
				<div>
					<SensorStrategy />
					<Overlayer />
				</div>
			</Provider>
		);

		const trs = root.find('SensorStrategy').find('Table').find('tbody').find('tr');
		const delBtn = trs.at(1).find('.edit').childAt(1);
		delBtn.simulate('click');
		let ConfirmPopup = root.find('ConfirmPopup');
		expect(ConfirmPopup.length).toBe(1);
		expect(ConfirmPopup.prop('tips')).toBe('是否删除选中策略？');
		expect(ConfirmPopup.prop('iconClass')).toBe('icon_popup_delete');
	});
});

