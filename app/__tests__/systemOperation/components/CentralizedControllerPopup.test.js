import React, {Component} from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import CentralizedControllerPopup from '../../../src/systemOperation/components/CentralizedControllerPopup';

describe("<CentralizedControllerPopup />", () => {
    const popId = 'add';
    const title = '添加设备';
    const className='centralized-popup';
    const modelList = {
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
    };
    const domainList = {
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
    };
    const data = {
        id: 'sdf',
        name: 'name01',
        model: 'model01',
        domain: 'domain01',
        lng: 121.49971691534425,
        lat: 31.239658843127756
    };
    it('render normal', () => {
        const cmp = shallow(<CentralizedControllerPopup popId={popId} className={className} title={title} data={data} domainList={domainList} modelList={modelList}/>);
        const container = cmp.find(`.${className}`);
        expect(container.length).toBe(1);
        
        const panel = cmp.find("Panel");
        expect(panel.length).toBe(1);
        expect(panel.prop('title')).toBe(title);

        const items = cmp.find('.form-group.clearfix');
        expect(items.length).toBe(6);

        const name = items.at(1);
        const lab = name.find('.control-label');
        expect(lab.text()).toBe('名称：');
        const input = name.find('#name');
        expect(input.props().value).toBe(data.name);

        expect(items.at(0).props().disabled).not.toBeTruthy();

        const domainSelect = items.at(3).find('Select');
        expect(domainSelect.prop('titleField')).toBe(domainList.titleField);
        expect(domainSelect.prop('valueField')).toBe(domainList.valueField);
        expect(domainSelect.props().options).toBe(domainList.options);
        expect(domainSelect.props().value).toBe(data.domain);
    });

    it('render with popId="edit" to disabled input#id', () => {
        const cmp = shallow(<CentralizedControllerPopup popId='edit' className={className} title={title} data={data} domainList={domainList} modelList={modelList}/>);
        expect(cmp.find('#id').props().disabled).toBeTruthy();
    });

    it('simulate event', () => {
        const cmp = shallow(<CentralizedControllerPopup popId='edit' className={className} title={title} data={data} domainList={domainList} modelList={modelList}/>);

        let name = cmp.find('#name');
        expect(name.prop('value')).toBe(data.name);
        name.simulate('change', {target: {value: 'name02', id: 'name'}});
        name = cmp.find('#name');
        expect(name.props().value).toBe('name02');

        let modelSelect = cmp.find('#model');
        expect(modelSelect.prop('value')).toBe(data.model);
        modelSelect.simulate('change', {target: {value: 'model02', id: 'model'}});
        modelSelect = cmp.find('#model');
        expect(modelSelect.props().value).toBe('model02');
    });

    it('snapshot with popId="add"', () => {
        const cmp = renderer.create(<CentralizedControllerPopup popId='add' className={className} title={title} data={data} domainList={domainList} modelList={modelList}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
    
    it('snapshot with popId="edit"', () => {
        const cmp = renderer.create(<CentralizedControllerPopup popId='edit' className={className} title={title} data={data} domainList={domainList} modelList={modelList}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})