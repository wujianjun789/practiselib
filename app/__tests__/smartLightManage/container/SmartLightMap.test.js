/**
 * Created by a on 2017/9/30.
 */
import React from 'react';
import renderer from 'react-test-renderer';

import {shallow, mount} from 'enzyme'
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore'

import '../../../public/js/jquery-3.1.1.min';
import '../../../public/leaflet/leaflet';
import SmartLightMap from '../../../src/smartLightManage/container/SmartLightMap';

const store = configureStore();

test('renders smartLightMap', ()=>{
    const wrapper = renderer.create(
        <Provider store={store}>
            <IntlProvider>
                <SmartLightMap />
            </IntlProvider>
        </Provider>
    ).toJSON();

    expect(wrapper).toMatchSnapshot();
});

test('renders smartLightMap data', ()=>{
    const wrapper = mount(
        <Provider store={store}>
            <IntlProvider>
                <SmartLightMap />
            </IntlProvider>
        </Provider>
    );

    expect(wrapper.find('.search-container').length).toEqual(1);
    expect(wrapper.find('.search-container').find('.pole-info').length).toEqual(1);
    expect(wrapper.find('.filter-container').length).toEqual(1);

    expect(wrapper.find('.select-active').length).toEqual(0);
    // wrapper.setState({interactive:true});
    // wrapper.update();
    // expect(wrapper.find('.select-active').length).toEqual(1);
    wrapper.find('.filter-container').find('ul').childAt(0).simulate('click');
    expect(wrapper.find('.filter-container').find('ul').childAt(0).hasClass('active')).toBeTruthy();
})