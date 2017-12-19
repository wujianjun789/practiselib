import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import UserPopup from '../../../src/permissionManage/container/UserPopup';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import Immutable from 'immutable';

const store = configureStore();
describe('<UserPopup',()=>{
    // const store = configureStore();
    const classNameAdd = 'user-add-popup';
    const titleAdd = '添加用户';
    const classNameEdit = 'user-edit-popup';
    const titleEdit = '用户资料';
    const data = {
        firstName:"xx",
        id:1,
        lastName:"s",
        modules:['permission','maintenance'],
        roleId:{index: 3, value: "系统管理员"},
        username:"admin"
    }
    it('render normal add',()=>{
        const root = shallow(<Provider store={store}>
            <IntlProvider>
                <UserPopup className={classNameAdd} title={titleAdd}/>
            </IntlProvider>
        </Provider>);
        const cmp = root.find('UserPopup');
        const container = cmp.find(`.${classNameAdd}`);
        expect(container.length).toBe(1);

        expect(cmp.prop('title')).toBe(titleAdd);
console.log('cmp:',cmp.find('InputCheck'));
        // const inputCheck = cmp.find('InputCheck');
        // expect(inputCheck.length).toBe(5);

        // const select = cmp.find('Select');
        // expect(select.length).toBe(1);
    })

    it('add snapshot', () => {
        const cmp = renderer.create(<Provider store={store}>
                <IntlProvider>
                    <UserPopup className={classNameAdd} title={titleAdd}/>
                </IntlProvider>
            </Provider>
        );
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('edit snapshot', () => {
        const cmp = renderer.create(<Provider store={store}>
                <IntlProvider>
                    <UserPopup className={classNameEdit} title={titleEdit} data={data}/>
                </IntlProvider>
            </Provider>
        );
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})
