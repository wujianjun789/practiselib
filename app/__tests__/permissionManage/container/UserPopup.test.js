import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import UserPopup from '../../../src/permissionManage/container/UserPopup';
// import {Provider} from 'react-redux';
import Immutable from 'immutable';
// import configureStore from '../../../src/store/configureStore';

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
        const cmp = shallow(<UserPopup className={classNameAdd} title={titleAdd}/>);
        const container = cmp.find(`.${classNameAdd}`);
        expect(container.length).toBe(1);

        const panel = cmp.find('Panel');
        expect(panel.length).toBe(1);
        expect(panel.prop('title')).toBe(titleAdd);

        const inputCheck = cmp.find('InputCheck');
        expect(inputCheck.length).toBe(5);

        const select = cmp.find('Select');
        expect(select.length).toBe(1);
    })

    it('add snapshot', () => {
        const cmp = renderer.create(<UserPopup className={classNameAdd} title={titleAdd}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('edit snapshot', () => {
        const cmp = renderer.create(<UserPopup className={classNameEdit} title={titleEdit} data={data}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})
