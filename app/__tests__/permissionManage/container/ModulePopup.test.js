import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import ModulePopup from '../../../src/permissionManage/container/ModulePopup';
// import {Provider} from 'react-redux';
import Immutable from 'immutable';
// import configureStore from '../../../src/store/configureStore';

describe('<ModulePopup',()=>{
    // const store = configureStore();
    const className = 'user-module-edit-popup';
    const title = '模块权限管理';
    const modules = [
        {key: 'asset', title: '资产管理', link: '/assetManage/manage'},
        {key: 'permission', title: '权限管理', link: '/permissionManage'},
        {key: 'maintenance', title: '系统运维', link: '/systemOperation/gateway'},
        {key: 'control', title: '系统控制', link: '/'},
        {key: 'report', title: '报表管理', link: '/'},
        {key: 'publish', title: '媒体发布', link: '/'},
        {key: 'visual', title: '可视化', link: '/'},
        {key: 'domain', title: '域管理', link: '/domainManage/domainEdit'}
    ];
    const rowModules = ['permission','maintenance'];
    it('render normal',()=>{
        const cmp = shallow(<ModulePopup className={className} title={title} modules={modules} data = {rowModules}/>);
        const container = cmp.find(`.${className}`);
        expect(container.length).toBe(1);

        const allModule = container.find('.all-module-list');
        expect(allModule.length).toBe(1);
        const allModuleLi = allModule.find('li');
        expect(allModuleLi.length).toBe(modules.length);

        const moduleList = container.find('.module-list');
        expect(moduleList.length).toBe(1);
        const moduleLi = moduleList.find('li');
        expect(moduleLi.length).toBe(rowModules.length);
    })

    it('snapshot', () => {
        const cmp = renderer.create(<ModulePopup className={className} title={title} modules={modules} data = {rowModules}/>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    });
})
