/**
 * Created by a on 2017/10/18.
 */
import React from 'react';
import {shallow, mount} from 'enzyme'
import renderer from 'react-test-renderer';

import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';

import {PlayerList} from '../../../src/mediaPublish/container/PlayerList';

const store = configureStore();
test('PlayerList renders', ()=>{
    const component = renderer.create(
        <Provider store={store}>
            <IntlProvider>
                <PlayerList />
            </IntlProvider>
        </Provider>
    )

    let playerList = component.toJSON();
    expect(playerList).toMatchSnapshot();
})

test('PlayerList div click', ()=>{
    const root = mount(<Provider store={store}>
        <IntlProvider>
            <PlayerList />
        </IntlProvider>
    </Provider>)
    const component = root.find('PlayerList');
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.playerList-container').length).toEqual(1);
})