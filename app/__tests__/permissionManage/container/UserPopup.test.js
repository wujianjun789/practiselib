import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {UserPopup} from '../../../src/permissionManage/container/UserPopup';
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
        
    }
    const modules = [
        {key: 'asset', title: '资产管理', link: '/assetManage/manage'},
        {key: 'permission', title: '权限管理', link: '/permissionManage'},
        {key: 'maintenance', title: '系统运维', link: '/systemOperation/lampConCenter'},
        {key: 'control', title: '系统控制', link: '/'},
        {key: 'report', title: '报表管理', link: '/'},
        {key: 'publish', title: '媒体发布', link: '/'},
        {key: 'visual', title: '可视化', link: '/'},
        {key: 'domain', title: '域管理', link: '/domainManage/domainEdit'}
    ]
    it('render normal add',()=>{
        const cmp = shallow(<UserPopup className={classNameAdd} title={titleAdd} modules={modules}/>);
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
})