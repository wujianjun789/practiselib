/**
 * Created by a on 2017/10/23.
 */
import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';


import PlayerArea from '../../../src/mediaPublish/container/PlayerArea';


const store = configureStore();
it('PlayerArea renders', ()=>{
    const root = mount(
        <Provider store={store}>
            <IntlProvider>
                <PlayerArea />
            </IntlProvider>
        </Provider>
    );

    expect(root.find('.player-area').length).toEqual(1);
})