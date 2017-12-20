/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import StrategySetPopup from '../../../src/smartLightControl/component/StrategySetPopup';

const store = configureStore();
test('renders StrategySetPopup', ()=>{
    const component = renderer.create(<Provider store={store}>
            <IntlProvider>
                <StrategySetPopup />
            </IntlProvider>
        </Provider>
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders StrategySetPopup class', ()=>{
    const component = shallow(<Provider store={store}>
        <IntlProvider>
            <StrategySetPopup />
        </IntlProvider>
    </Provider>)
    // expect(component.find('.strategy-set-popup').length).toEqual(1);
})