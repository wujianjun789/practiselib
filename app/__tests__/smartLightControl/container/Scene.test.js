/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow, mount} from 'enzyme'
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import Scene from '../../../src/smartLightControl/container/Scene';

const sceneList = [
    {id:1, name:"场景1", active:false, presets:[{id:1, name:"灯1"},{id:2, name:"屏幕"}]},
    {id:2, name:"场景2", active:false, presets:[{id:3, name:"灯1"},{id:4, name:"屏幕"}]}
];

const store = configureStore();
test('renders Scene', ()=>{
    const component = renderer.create(<Provider store={store}>
            <IntlProvider>
                <Scene />
            </IntlProvider>
        </Provider>
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Scene data', ()=>{
    const root = mount(<Provider store={store}>
            <IntlProvider>
                <Scene />
            </IntlProvider>
        </Provider>);
    const component = root.find('Scene')
    root.setState({ sceneList:sceneList});
    // expect(component.find('.scene-item-container').length).toEqual(sceneList.length);
})