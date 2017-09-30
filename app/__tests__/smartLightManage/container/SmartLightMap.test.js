/**
 * Created by a on 2017/9/30.
 */
import React from 'react';
import renderer from 'react-test-renderer';

import {shallow, mount} from 'enzyme'
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore'

import '../../../public/js/jquery-3.1.1.min';
import '../../../public/leaflet/leaflet';
import SmartLightMap from '../../../src/smartLightManage/container/SmartLightMap';

const store = configureStore();

test('renders smartLightMap', ()=>{
    const wrapper = renderer.create(
        <Provider store={store}>
            <SmartLightMap />
        </Provider>
    ).toJSON();

    expect(wrapper).toMatchSnapshot();
});

test('renders smartLightMap data', ()=>{
    const wrapper = mount(
        <Provider store={store}>
            <SmartLightMap />
        </Provider>
    );
console.log(wrapper.find('SmartLightMap').find('.search-container').length);
    expect(wrapper.find('.search-container').length).toEqual(1);
})