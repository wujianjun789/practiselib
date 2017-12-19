/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow,mount} from 'enzyme'
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';
import Strategy from '../../../src/smartLightControl/container/Strategy';

const store = configureStore();
test('renders Strategy', ()=>{
    const component = renderer.create(
        <Provider store={store}>
            <IntlProvider>
                <Strategy/>
            </IntlProvider>
        </Provider>
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Strategy class', ()=>{
    const root = mount(<Provider store={store}>
        <IntlProvider>
            <Strategy/>
        </IntlProvider>
    </Provider>);
    const component = root.find('Strategy');
console.log(component);
    expect(component.find('.collapsed').length).toEqual(0);
    root.setState({ collapse: true});
    // expect(component.find('.collapsed').length).toEqual(1);
})