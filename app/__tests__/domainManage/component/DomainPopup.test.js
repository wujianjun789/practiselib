/**
 * Created by a on 2017/10/11.
 */
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import DomainPopup from '../../../src/domainManage/component/DomainPopup';
global.d3 = require('../../../public/js/d3.min');

const initData = { title: "",
    data:{domainName:"", prevDomain:""},
    domainList:{titleKey:'name', valueKey:'name', options:[]}
}

it('DomainEditTopology mount', () => {
    const store = configureStore();

    it('simulate add-domain btn click', () => {
        const root = mount(
            <Provider store={store}>
                <DomainPopup title={initData.title} data={initData.data} domainList={initData.domainList}/>
            </Provider>
        );

        expect(root.hasClass('domain-popup')).toBe(true);
        expect(root.hasClass('popup-map')).toBe(true);
        expect(roo.find('MapView').length).toBe(1);
    });
});