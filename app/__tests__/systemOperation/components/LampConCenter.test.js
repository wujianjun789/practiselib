import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';
import {Gateway} from '../../../src/systemOperation/container/Gateway';
import Immutable from 'immutable';

describe('<Gateway /> component', () => {
    it('render normal', () => {
        const cmp = shallow(<Gateway />);
        const header = cmp.find('.heading');
        const select = header.find('Select');
        const domainList = cmp.state('domainList');
        expect(select.prop('titleField')).toBe(domainList.titleField);
        expect(select.prop('valueField')).toBe(domainList.valueField);
        expect(select.props().options).toEqual(domainList.options);
        expect(select.props().value).toBe(domainList.value);

        const search = cmp.state('search').toJS();
        const searchText = header.find('SearchText');
        expect(searchText.prop('placeholder')).toBe(search.placeholder);
        expect(searchText.prop('value')).toBe(search.value);

        const btn = header.find('#sys-add');
        expect(btn.text()).toBe('添加');

        cmp.setState({model: 'gateway'});
        const ins = cmp.instance();
        const table = cmp.find('Table');
        expect(table.prop('columns')).toEqual(ins.columns);
        expect(table.prop('data')).toEqual(cmp.state('data'));

        const page = cmp.find('Page');
        const pageData = cmp.state('page').toJS();
        expect(page.prop('pageSize')).toBe(pageData.pageSize);
        expect(page.prop('current')).toBe(pageData.current);
        expect(page.prop('total')).toBe(pageData.total);

        const sidebarInfo = cmp.find('SideBarInfo');
        expect(sidebarInfo.find('.device-statics-info').at(0).find('.panel-heading').text()).toBe('选中设备');
        expect(sidebarInfo.find('.whitelist .panel-heading').text()).toBe('白名单');
    });

    it('snapshot', () => {
        const cmp = renderer.create(<Gateway />);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})