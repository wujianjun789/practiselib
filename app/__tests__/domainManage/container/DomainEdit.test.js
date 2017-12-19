/**
 * Created by a on 2017/7/27.
 */
import React from 'react';
import {shallow, mount} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import {DomainEditList} from '../../../src/domainManage/container/DomainEditList';

const store = configureStore();
test('DomainEdit renders', ()=>{
    const component = renderer.create(<Provider store={store}>
            <IntlProvider>
                <DomainEditList />
            </IntlProvider>
        </Provider>
    )

    let domainEdit = component.toJSON();
    expect(domainEdit).toMatchSnapshot();
})

test('DomainEdit div click', ()=>{
    const root = mount(<Provider store={store}>
            <IntlProvider>
                <DomainEditList />
            </IntlProvider>
        </Provider>
        )
    const component = root.find('DomainEditList');
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.table-container').length).toEqual(1);
})