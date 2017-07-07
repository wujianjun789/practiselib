import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import Login from '../../../src/login/container/Login';
import {initialState as state} from '../../../src/login/reducer';

describe('<login /> HOC', () => {
    const store = configureStore();
    it('render normal', () => {
        const root = mount(<Provider store={store}>
            <Login />
        </Provider>);

        const login = root.find('Login');
        expect(login.length).toBe(1);
        expect(login.prop('data')).toBe(state);
    });
})