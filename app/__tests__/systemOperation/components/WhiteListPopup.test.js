import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import WhiteListPopup from '../../../src/systemOperation/components/WhiteListPopup';

 describe('<WhiteListPopup />', () => {
    let className="white-popup";
    let data = [
            {id:1,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:2,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:3,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'},
            {id:4,name: '灯集中控制器', number: '00158D0000CABAD5', model: 8080, lng: '000.000.000.000', lat: '000.000.000.000'}
        ]
    it('render normal', () => {
        const cmp = shallow(<WhiteListPopup className={className} data={data}/>);
        expect(cmp.find(`.${className}`).length).toBe(1);

        let tHead = cmp.find('.table-header');
        let headCell = tHead.find('.tables-cell');
        expect(headCell.length).toBe(3);
        expect(headCell.at(1).text()).toBe('编号');
        expect(headCell.at(2).text()).toBe('');

        let tBody = cmp.find('.table-body');
        let items = tBody.find('.body-row');
        expect(items.length).toBe(data.length);
        
        let item3 = items.at(2);
        let cells = item3.find('.tables-cell');
        expect(cells.length).toBe(3);
        expect(cells.at(0).text()).toBe(data[2].name);
        expect(cells.at(1).text()).toBe(data[2].number);
        expect(cells.at(2).find('span').hasClass('glyphicon glyphicon-trash')).toBeTruthy();

        expect(cmp.find('Panel').props().title).toBe('白名单');
        
        let searchText = cmp.find('SearchText');
        expect(searchText.prop('placeholder')).toBe('输入素材名称');
        expect(searchText.prop('value')).toBe('');
        
        expect(cmp.find('.search-group .btn-primary').text()).toBe('添加');
    });

    it('Behavior interaction', () => {
        let fn = jest.fn();
        let overlayerHide = jest.fn();
        const cmp = mount(<WhiteListPopup data={data} onAdd={fn} searchSubmit={fn} overlayerHide={overlayerHide} itemDelete={fn}/>);

        let addBtn = cmp.find('.search-group button');
        addBtn.simulate('click');
        expect(fn).toHaveBeenCalledTimes(1);

        let searchText = cmp.find('SearchText');
        let searchInput = searchText.find('input');
        searchInput.simulate('change', {target: {value: 'change'}});
        expect(searchText.prop('value')).toBe('change');

        let items = cmp.find('.table-body .body-row');
        
        items.at(1).find('.glyphicon.glyphicon-trash').simulate('click');
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('snapshot', () => {
        const cmp = renderer.create(<WhiteListPopup className={className} data={data} />);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
 })