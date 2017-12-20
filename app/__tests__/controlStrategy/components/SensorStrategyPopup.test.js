/**
 * Created by Azrael on 2017/9/28
 */
import React from 'react';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import SensorStrategyPopup from '../../../src/controlStrategy/component/SensorStrategyPopup';
import PanelFooter from '../../../src/components/PanelFooter';
global.d3 = require('../../../public/js/d3.min');

const store = configureStore();
describe('<SensorStrategyPopup />', () => {
			const addData = {
				className: 'test',
				popupId: 'add',
				title: '添加策略',
				data: { "id": "", "sensorType": "SENSOR_NOISE" },
				sensorTypeList: {
					"titleField": "title",
					"valueField": "value",
					"options": [
						{ "value": "SENSOR_NOISE", "title": "噪声传感器" },
						{ "value": "SENSOR_PM25", "title": "PM2.5 传感器" },
						{ "value": "SENSOR_PA", "title": "大气压传感器" },
						{ "value": "SENSOR_HUMIS", "title": "湿度传感器" },
						{ "value": "SENSOR_TEMPS", "title": "温度传感器" },
						{ "value": "SENSOR_WINDS", "title": "风速传感器" },
						{ "value": "SENSOR_WINDDIR", "title": "风向传感器" },
						{ "value": "SENSOR_CO", "title": "一氧化碳传感器" },
						{ "value": "SENSOR_O2", "title": "氧气传感器" },
						{ "value": "SENSOR_CH4", "title": "甲烷传感器" },
						{ "value": "SENSOR_CH2O", "title": "甲醛传感器" },
						{ "value": "SENSOR_LX", "title": "照度传感器" }
					]
				},
				sensorsProps: {
					"SENSOR_NOISE": { "unit": "dB", "accuracy": "0.1", "max": "130", "min": "0" },
					"SENSOR_PM25": { "unit": "ug/m3", "accuracy": "1", "max": "1000", "min": "0" },
					"SENSOR_PA": { "unit": "hPa", "accuracy": "1", "max": "1300", "min": "0" },
					"SENSOR_HUMIS": { "unit": "rh%", "accuracy": "0.1", "max": "99.9", "min": "0.0" },
					"SENSOR_TEMPS": { "unit": "℃", "accuracy": "0.1", "max": "60.0", "min": "-40.0" },
					"SENSOR_WINDS": { "unit": "m/s", "accuracy": "1", "max": "60.0", "min": "0.0" },
					"SENSOR_WINDDIR": { "unit": "°", "accuracy": "0.1", "max": "360", "min": "0" },
					"SENSOR_CO": { "unit": "ppm", "accuracy": "1", "max": "1000", "min": "0" },
					"SENSOR_O2": { "unit": "%VOL", "accuracy": "0.01", "max": "25.0", "min": "0.0" },
					"SENSOR_CH4": { "unit": "", "accuracy": "", "max": "", "min": "" },
					"SENSOR_CH2O": { "unit": "", "accuracy": "", "max": "", "min": "" },
					"SENSOR_LX": { "unit": "Lux", "accuracy": "1", "max": "200000", "min": "0" }
				},
				controlDeviceList: {
					"titleField": "title",
					"valueField": "value",
					"options": [
						{ "title": "灯", "value": "lc" },
						{ "title": "屏幕", "value": "screen" }
					]
				},
				brightnessList: {
					"titleField": "title",
					"valueField": "value",
					"options": [
						{ "value": "off", "title": "关" },
						{ "value": 0, "title": "亮度0" },
						{ "value": 10, "title": "亮度10" },
						{ "value": 20, "title": "亮度20" },
						{ "value": 30, "title": "亮度30" },
						{ "value": 40, "title": "亮度40" },
						{ "value": 50, "title": "亮度50" },
						{ "value": 60, "title": "亮度60" },
						{ "value": 70, "title": "亮度70" },
						{ "value": 80, "title": "亮度80" },
						{ "value": 90, "title": "亮度90" },
						{ "value": 100, "title": "亮度100" }
					]
				},
				overlayerHide: jest.fn(),
				updateSensorStrategyList: jest.fn(),
				addNotify: jest.fn()
			};

	const data_edit = {
		"id": 1,
		"strategyName": "风速传感器1",
		"sensorType": "SENSOR_WINDS",
		"controlDevice": "lc",
		"sensorParamsList": [
			{
				"condition": { "windSpeed": "1" },
				"rpc": { "value": "0", "title": "亮度0" }
			},
			{
				"condition": { "windSpeed": "2"},
				"rpc": {"value": "20","title": "亮度20"}
			},
			{
				"condition": { "windSpeed": "3" },
				"rpc": { "value": "70", "title": "亮度70" }
			},
			{
				"condition": { "windSpeed": "4" },
				"rpc": { "value": "30", "title": "亮度30" }
			},
			{
				"condition": { "windSpeed": "5" },
				"rpc": { "value": "70", "title": "亮度70" }
			}
		]
	}

	it('normal render--add', () => {
		const root = mount(<Provider store={store}>
				<IntlProvider>
					<SensorStrategyPopup {...addData} />
				</IntlProvider>
			</Provider>);

		const cmp = root.find('SensorStrategyPopup')
		const panel = cmp.find('Panel');
		// expect(cmp.hasClass(addData.className)).toBeTruthy();
		expect(cmp.prop('title')).toBe(addData.title);
		// expect(cmp.prop('closeBtn')).toBeTruthy();
		// const checkStatus_state = root.state('checkStatus');
		const strategyName = panel.childAt(0);
		// expect(strategyName.find('.control-label').text()).toBe('策略名称：');
		let input = strategyName.find('.form-group-right #strategyName');
		// expect(input.prop('placeholder')).toBe('传感器使用策略');
		// expect(input.prop('value')).toBe('');
		// expect(input.hasClass('form-control')).toBe(true);
		let span = strategyName.find('.form-group-right span');
		// expect(span.text()).toBe('仅能使用数字、字母、下划线，必须以字母或下划线开头');
		// expect(span.prop('style')).toEqual({visibility: checkStatus_state.strategyName ? 'visible' : 'hidden'})

		// const sensorType = panel.childAt(1).childAt(0);
		// expect(sensorType.find('label').hasClass('control-label')).toBeTruthy();
		// expect(sensorType.find('label').text()).toBe('传感器类型：');
		// let select = sensorType.find('#sensorType');
		// Object.keys(addData.sensorTypeList).forEach(item => {
		// 	expect(select.prop(item)).toEqual(addData.sensorTypeList[item]);
		// });
		// expect(select.props().disabled).toBe(false);
		// span = select.closest('.form-group-right').childAt(1);
		// // expect(span.text()).toBe('请选择传感器');
		// expect(span.prop('style')).toEqual({visibility: checkStatus_state.sensorType ? 'visible' : 'hidden'});
        //
		// const controlDevice = panel.childAt(1).childAt(1);
		// expect(controlDevice.find('label').hasClass('control-label')).toBeTruthy();
		// // expect(controlDevice.find('label').text()).toBe('控制设备：');
		// select = controlDevice.find('#controlDevice');
		// Object.keys(addData.controlDeviceList).forEach(item => {
		// 	expect(select.prop(item)).toEqual(addData.controlDeviceList[item]);
		// });
		// expect(select.props().disabled).toBe(false);
		// span = select.closest('.form-group-right').childAt(1);
		// // expect(span.text()).toBe('请选择设备');
		// expect(span.prop('style')).toEqual({visibility: checkStatus_state.controlDevice ? 'visible' : 'hidden'});
        //
		// const chart = panel.find('.chart');
		// // expect(chart.find('label').text()).toBe('图表：');
		// expect(chart.find('label').props().className).toBe('control-label');
		// const lineChart = chart.find('LineChart');
		// expect(lineChart.prop('sensorParamsList')).toEqual([]);
		// const data_state = cmp.state('data');
		// expect(lineChart.prop('data')).toEqual(data_state);
		// expect(lineChart.prop('sensorsProps')).toEqual(addData.sensorsProps);
		// const inst = cmp.instance();
		// const sensorTransform = inst.sensorTransform;
		// expect(lineChart.prop('sensorTransform')).toEqual(sensorTransform);
        //
		// const params = panel.childAt(3);
		// // expect(params.find('label').text()).toBe('设置参数：');
		// const lightness = params.childAt(1);
		// // expect(lightness.childAt(0).text()).toBe('添加节点')
		// expect(lightness.childAt(0).prop('disabled')).toBe(checkStatus_state.sensorParam);
		// const sensorParam = lightness.find('#sensorParam');
		// // expect(sensorParam.prop('placeholder')).toBe('输入传感器参数');
		// expect(sensorParam.prop('value')).toBe(data_state.sensorParam);
        //
		// let brightness = lightness.find('#brightness');
		// Object.keys(addData.brightnessList).forEach(item => {
		// 	expect(brightness.props()[item]).toEqual(addData.brightnessList[item]);
		// })
		// expect(brightness.props().value).toBe(data_state.brightness);
        //
		// const ul = brightness.closest('.lightness-right').childAt(1);
		// const lis = ul.find('li');
		// expect(lis.length).toBe(0);
        //
		// cmp.setState({data: {...cmp.state('data'), controlDevice: 'screen'}});
		// const screen = cmp.find('#screenSwitch');
		// expect(screen.length).toBe(1);
		// const screenSwitchList_state = cmp.state('screenSwitchList');
		// Object.keys(screenSwitchList_state).forEach(item => {
		// 	expect(screen.prop(item)).toEqual(screenSwitchList_state[item]);
		// })
	});

	it('normal render--edit', () => {
		const data = Object.assign({}, addData, {data: data_edit, popupId: 'edit'} );
		const root = mount(<Provider store={store}>
			<IntlProvider>
				<SensorStrategyPopup {...data} />
			</IntlProvider>
		</Provider>);
		const cmp = root.find('SensorStrategyPopup');
		expect(cmp.find('#sensorType').prop('disabled')).toBe(true);
		expect(cmp.find('#controlDevice').prop('disabled')).toBe(true);
	});

	it('simulate sensorType change', () => {
		const data = Object.assign({}, addData, {data: data_edit} );
		const root = mount(<Provider store={store}>
			<IntlProvider>
				<SensorStrategyPopup {...data} />
			</IntlProvider>
		</Provider>);
		const cmp = root.find('SensorStrategyPopup');
		cmp.find('#sensorType').simulate('change', {target: {id: 'sensorType', value: 'SENSOR_WINDDIR'}});
		// expect(root.state('sensorParamsList')).toEqual([]);
	})

	it('simulate controlDevice change', () => {
		const data = Object.assign({}, addData, {data: data_edit} );
		const root = mount(<Provider store={store}>
				<IntlProvider>
					<SensorStrategyPopup {...data} />
				</IntlProvider>
			</Provider>);
		const cmp = root.find('SensorStrategyPopup');
		cmp.find('#controlDevice').simulate('change', {target: {id: 'controlDevice', value: 'screen'}});
		// expect(root.state('sensorParamsList')).toEqual([]);
	})

	it('simulate sensorParam change', () => {
		const data = Object.assign({}, addData, {data: data_edit} );
		const root = mount(<Provider store={store}>
			<IntlProvider>
				<SensorStrategyPopup {...data} />
			</IntlProvider>
		</Provider>);
		const cmp = root.find('SensorStrategyPopup');
		console.log('SensorStrategyPopup:', cmp, cmp.find('#sensorParam'));
		cmp.find('#sensorParam').simulate('change', {target: {id: 'sensorParam', value: '125'}});
		expect(cmp.find('#sensorParam').closest('.lightness').childAt(0).prop('disabled')).toBe(false);
		cmp.find('#sensorParam').closest('.lightness').childAt(0).simulate('click');
		cmp.find('#sensorParam').simulate('change', {target: {id: 'sensorParam', value: '125'}});
		expect(cmp.find('#sensorParam').closest('.lightness').childAt(0).prop('disabled')).toBe(true);
	})

	it('snapshot add', () => {
		const store = configureStore();
		const cmp = renderer.create(<Provider store={store}>
			<IntlProvider>
				<SensorStrategyPopup {...addData} />
			</IntlProvider>
		</Provider>);
		expect(cmp.toJSON()).toMatchSnapshot();
	});

	it('snapshot edit', () => {
		const store = configureStore();
		const data = Object.assign({}, addData, {data: data_edit, popupId: 'edit'} );
		const cmp = renderer.create(<Provider store={store}>
			<IntlProvider>
				<SensorStrategyPopup {...data} />
			</IntlProvider>
		</Provider>);
		expect(cmp.toJSON()).toMatchSnapshot();
	});

});
