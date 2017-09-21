import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import WhiteListPopup from '../../../src/systemOperation/components/WhiteListPopup';

 describe('<WhiteListPopup />', () => {
    let className="white-popup";
    let data = [
            {id: '00158D0000CABAD5',name:'xxx1'},
            {id: '00158D0000CABAD5',name:'xxx2'},
        ]
    it('render normal', () => {
        const cmp = shallow(<WhiteListPopup className={className}/>);
        cmp.setState({whiteList:data});
        const {columns} = cmp.instance();
        expect(cmp.find(`.${className}`).length).toBe(1);

        let tHead = cmp.find('.table-header');
        let headCell = tHead.find('.tables-cell');
        expect(headCell.length).toBe(3);
        expect(headCell.at(0).text()).toBe('名称');
        expect(headCell.at(1).text()).toBe('编号');

        let tBody = cmp.find('.table-body');
        let items = tBody.find('.body-row');
        expect(items.length).toBe(data.length);
        
        let item0 = items.at(0);
        let cells = item0.find('.tables-cell');
        expect(cells.length).toBe(3);
        expect(cells.at(0).text()).toBe(data[0][columns[0].field]);
        expect(cells.at(1).text()).toBe(data[0][columns[1].field]);
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
        const cmp = mount(<WhiteListPopup overlayerHide={overlayerHide} />);

        let searchText = cmp.find('SearchText');
        let searchInput = searchText.find('input');
        searchInput.simulate('change', {target: {value: 'change'}});
        expect(searchText.prop('value')).toBe('change');

    });

    it('snapshot', () => {
        const cmp = renderer.create(<WhiteListPopup className={className} />);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
 })