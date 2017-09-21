import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import {DomainPopup} from '../../../src/permissionManage/container/DomainPopup';
import {Provider} from 'react-redux';
import Immutable from 'immutable';
import configureStore from '../../../src/store/configureStore';

describe('<DomainPopup',()=>{
    // const store = configureStore();
    const className = 'user-domain-edit-popup';
    const title = '用户域管理';
    
    it('render normal',()=>{
        const onClick = jest.fn();
        const cmp = shallow(<DomainPopup className={className} title={title} onClick={onClick}/>);
        const container = cmp.find(`.${className}`);
        expect(container.length).toBe(1);

        const panel = cmp.find('Panel');
        expect(panel.length).toBe(1);
        expect(panel.prop('title')).toBe(title);
        
        const domainPer = panel.find('.domain-per');
        expect(domainPer.length).toBe(1);

        const domainContent = panel.find('.domain-content');
        expect(domainContent.length).toBe(1);

        const domainTree = panel.find('.domain-tree');
        expect(domainTree.length).toBe(1);

        const domainList = panel.find('.domain-list');
        expect(domainList.length).toBe(1);
        
        const searchText = domainTree.find('SearchText');
        expect(searchText.length).toBe(1);

        const deleteSpan = domainList.find('icon-table-delete');
        deleteSpan[0]&&deleteSpan[0].simulate('click');
        expect(onClick).toHaveBeenCalledTimes(deleteSpan[0]?1:0);

    })

    it('snapshot',() => {
        const cmp = renderer.create(<DomainPopup />);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })
})