import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';

import {DomainPopup} from '../../../src/permissionManage/container/DomainPopup';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';
import Immutable from 'immutable';

const store = configureStore();
describe('<DomainPopup',()=>{

    const className = 'user-domain-edit-popup';
    const title = '用户域管理';
    
    it('render normal',()=>{
        const onClick = jest.fn();
        const root = shallow(<Provider store={store}>
            <IntlProvider>
                <DomainPopup className={className} title={title} onClick={onClick}/>
            </IntlProvider>
        </Provider>);
        const cmp = root.find('DomainPopup')
        const container = cmp.find(`.${className}`);
        expect(container.length).toBe(1);

        expect(cmp.length).toBe(1);
        expect(cmp.prop('title')).toBe(title);
        
        const domainPer = cmp.find('.domain-per');
        expect(domainPer.length).toBe(1);

        const domainContent = cmp.find('.domain-content');
        expect(domainContent.length).toBe(1);

        const domainTree = cmp.find('.domain-tree');
        expect(domainTree.length).toBe(1);

        const domainList = cmp.find('.domain-list');
        expect(domainList.length).toBe(1);
        
        const searchText = domainTree.find('SearchText');
        expect(searchText.length).toBe(1);

        const deleteSpan = domainList.find('icon-table-delete');
        deleteSpan[0]&&deleteSpan[0].simulate('click');
        expect(onClick).toHaveBeenCalledTimes(deleteSpan[0]?1:0);

    })

    it('snapshot',() => {
        const cmp = renderer.create(<Provider store={store}>
            <IntlProvider>
                <DomainPopup />
            </IntlProvider>
        </Provider>);
        const tree = cmp.toJSON();
        expect(tree).toMatchSnapshot();
    })
})