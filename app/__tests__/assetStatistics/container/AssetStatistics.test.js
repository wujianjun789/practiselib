/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow,mount} from 'enzyme'
import renderer from 'react-test-renderer'

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import SingleLamp from '../../../src/assetStatistics/container/SingleLamp';

const store = configureStore();
test('AssetStatistics renders', ()=>{
    const component = renderer.create(<Provider store={store}>
            <IntlProvider>
                <SingleLamp />
            </IntlProvider>
        </Provider>
    )

    let assetStatistics = component.toJSON();
    expect(assetStatistics).toMatchSnapshot();
})

test('AssetStatistics div click', ()=>{
    const root = mount(<Provider store={store}>
        <IntlProvider>
            <SingleLamp />
        </IntlProvider>
    </Provider>)
    const component = root.find('SingleLamp');
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.table-container').length).toEqual(1);
})