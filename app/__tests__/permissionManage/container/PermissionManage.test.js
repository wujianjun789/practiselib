import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import {PermissionManage} from '../../../src/permissionManage/container/index';
import Immutable from 'immutable';

const store = configureStore();
describe('<PermissionManage />',()=>{
    const store = configureStore();
    const columns = [
        {field:"username", title:"用户名称"},
        {field:"lastLoginDate", title:"最后登录时间"}
    ];
    const router = {push: jest.fn()};

    it('render normal', () =>{
        const root = mount(<Provider store={store}>
            <IntlProvider>
                <PermissionManage />
            </IntlProvider>
        </Provider>)
        const cmp = root.find('PermissionManage');
        const header = cmp.find('.heading');
        // const ins = cmp.instance();

        const search = root.state('search').toJS();
        const searchText = header.find('SearchText');
        expect(searchText.prop('placeholder')).toBe(search.placeholder);
        expect(searchText.prop('value')).toBe(search.value);

        const table = cmp.find('Table2');
        expect(table.prop('columns')).toEqual(ins.columns);
        expect(table.prop('data')).toEqual(root.state('datas'));

        const page = cmp.find('Page');
        const pageData = root.state('page');
        expect(page.prop('pageSize')).toBe(pageData.pageSize);
        expect(page.prop('current')).toBe(pageData.current);
        expect(page.prop('total')).toBe(pageData.total);
    });

    it('snapshot',() => {
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <PermissionManage />
            </IntlProvider>
        </Provider>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })
})