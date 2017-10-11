/**
 * Created by a on 2017/10/11.
 */
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import Overlayer from '../../../src/common/containers/Overlayer';
import DomainEditTopology from '../../../src/domainManage/container/DomainEditTopology';
global.d3 = require('../../../public/js/d3.min');

it('TimeStrategy mount', () => {
    const store = configureStore();

    it('simulate add-domain btn click', () => {
        const root = mount(
            <Provider store={store}>
                <div>
                    <DomainEditTopology />
                    <Overlayer />
                </div>
            </Provider>
        );

        const btn = root.find('.add-domain');
        let event = {target: {id: 'add-domain'}};
        btn.simulate('click', event);
        let domainPopup = root.find('DomainPopup');
        expect(domainPopup.length).toBe(1);
        expect(domainPopup.hasClass('domain-popup')).toBe(true);
        expect(domainPopup.prop('title')).toBe('添加域');
        expect(domainPopup.prop('data').id).toEqual(undefined);
    });
});