import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import {IntlProvider} from 'react-intl-redux';
import configureStore from '../../../src/store/configureStore';
import Overlayer from '../../../src/common/containers/Overlayer';
import {initialState as state} from '../../../src/app/reducer';

describe('<Overlayer /> HOC', () => {
    const store = configureStore();
    it('render normal', () => {
        const root = mount(<Provider store = {store}>
            <IntlProvider>
                <Overlayer />
            </IntlProvider>
        </Provider>);

        const overlayer = root.find('Overlayer');
        expect(overlayer.length).toBe(1);
        expect(overlayer.prop('isShowDialog')).toBe(state.isShowDialog);
        expect(overlayer.prop('page')).toBe(state.page);
    })
})