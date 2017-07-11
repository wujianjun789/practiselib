import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import UserCenter from '../../../src/userCenter/containers/UserCenter';
import {initialState as state} from '../../../src/App/reducer';

describe('<UserCenter /> HOC', () => {
    const store = configureStore();
    it('render normal', () => {
        const root = mount(<Provider store={store}>
            <UserCenter />
        </Provider>);
    });
})