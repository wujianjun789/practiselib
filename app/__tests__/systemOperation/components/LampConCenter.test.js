import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {LampConCenter} from '../../../src/systemOperation/container/LampConCenter';
import Immutable from 'immutable';

describe('<LampConCenter /> component', () => {
    const lampConCenter = Immutable.fromJS({
        domain: {
            value: '',
            titleField: 'value',
            valueField: 'value',
            options: [
                {value: 'domain1'},
                {value: 'domain2'},
                {value: 'domain3'},
                {value: 'domain4'},
                {value: 'domain5'},
                {value: 'domain6'},
                {value: 'domain7'},
                {value: 'domain8'},
                {value: 'domain9'},
                {value: 'domain10'},
                {value: 'domain11'},
            ]
        },
        page: {
            pageSize: 10,
            current: 1,
            total: 21
        },
        data: [
            {id:1,deviceName: '灯集中控制器', model: '001', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:2,deviceName: '灯集中控制器', model: '002', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:3,deviceName: '灯集中控制器', model: '003', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:4,deviceName: '灯集中控制器', model: '004', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:5,deviceName: '灯集中控制器', model: '005', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:6,deviceName: '灯集中控制器', model: '006', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:7,deviceName: '灯集中控制器', model: '007', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:8,deviceName: '灯集中控制器', model: '008', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:9,deviceName: '灯集中控制器', model: '009', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:10,deviceName: '灯集中控制器', model: '010', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:11,deviceName: '灯集中控制器', model: '011', deviceID: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'}
        ],
        popupInfo: {
            whitelistData: [
                {id:1,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:2,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:3,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:4,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:5,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:6,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:7,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:8,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:9,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:10,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
                {id:11,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'}
            ],
            domainList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {id: 1, title: 'domain01', value: 'domain01'},
                    {id: 2, title: 'domain02', value: 'domain02'},
                    {id: 3, title: 'domain03', value: 'domain03'},
                    {id: 4, title: 'domain04', value: 'domain04'},
                    {id: 5, title: 'domain05', value: 'domain05'},
                    {id: 6, title: 'domain06', value: 'domain06'},
                    {id: 7, title: 'domain07', value: 'domain07'}
                ]
            },
            modelList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {id: 1, title: 'model01', value: 'model01'},
                    {id: 2, title: 'model02', value: 'model02'},
                    {id: 3, title: 'model03', value: 'model03'},
                    {id: 4, title: 'model04', value: 'model04'},
                    {id: 5, title: 'model05', value: 'model05'},
                    {id: 6, title: 'model06', value: 'model06'},
                    {id: 7, title: 'model07', value: 'model07'}
                ]
            }
        }
    });
    const columns = [
        {id: 1, field: "deviceName", title: "设备名称"},
        {id:2, field: "model", title: "型号"},
        {id:3, field: "deviceID", title: "设备编号"},
        {id:4, field: "model", title: "端口号"},
        {id:5, field: "lng", title: "经度"},
        {id:6, field: "lat", title: "纬度"},
    ];
    it('render normal', () => {
        const cmp = shallow(<LampConCenter lampConCenter={lampConCenter} />);
        
        const header = cmp.find('.heading');
        const select = header.find('Select');
        const domain = lampConCenter.get('domain').toJS();
        expect(select.prop('titleField')).toBe(domain.titleField);
        expect(select.prop('valueField')).toBe(domain.valueField);
        expect(select.props().options).toEqual(domain.options);
        expect(select.props().value).toBe(domain.value);
        const searchText = header.find('SearchText');
        expect(searchText.prop('placeholder')).toBe('输入设备名称');
        expect(searchText.prop('value')).toBe('');
        const btn = header.find('#sys-add');
        expect(btn.text()).toBe('添加');

        const table = cmp.find('Table');
        expect(table.prop('columns')).toEqual(columns);
        expect(table.prop('data')).toEqual(lampConCenter.get('data'));

        const page = cmp.find('Page');
        const pageData = lampConCenter.get('page').toJS();
        expect(page.prop('pageSize')).toBe(pageData.pageSize);
        expect(page.prop('current')).toBe(pageData.current);
        expect(page.prop('total')).toBe(pageData.total);

        const sidebarInfo = cmp.find('SideBarInfo');
        expect(sidebarInfo.find('.device-statics-info').at(0).find('.panel-heading').text()).toBe('选中设备');
        expect(sidebarInfo.find('.whitelist .panel-heading').text()).toBe('白名单');
    });

    it('snapshot', () => {
        const cmp = renderer.create(<LampConCenter lampConCenter={lampConCenter} />);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})