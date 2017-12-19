/**
 * Created by a on 2017/7/6.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import {shallow,mount} from 'enzyme';

import '../../public/js/jquery-3.1.1.min'
import '../../public/leaflet/leaflet';
window.d3 = require('../../public/js/d3.min')

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../src/store/configureStore';

import SideBarInfo from '../../src/components/SideBarInfo'

const store = configureStore();
test('SidebarInfo renders', ()=>{

    const component = renderer.create(<Provider store={store}>
            <IntlProvider>
                <SideBarInfo />
            </IntlProvider>
        </Provider>
    )

    let sideBarInfo = component.toJSON();
    expect(sideBarInfo).toMatchSnapshot();
})

test('SidebarInfo div click', ()=>{
    const root = mount(<Provider store={store}>
        <IntlProvider>
            <SideBarInfo />
        </IntlProvider>
    </Provider>
    )
    const component = root.find('SideBarInfo');
    component.find('.collapse-container').simulate('click');
    // expect(component.is('.sidebar-collapse')).toEqual(true);
})

