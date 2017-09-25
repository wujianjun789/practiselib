import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from '../../../src/store/configureStore';
import App from '../../../src/app/container';
import {initialState as state} from '../../../src/app/reducer';

describe('<app /> HOC', () => {
    const store = configureStore();
    it('render normal', () => {
        const root = mount(<Provider store={store}>
            <App />
        </Provider>);

        const app = root.find('App');
        expect(app.length).toBe(1);
        expect(app.prop('title')).toBe(state.title);
        expect(app.prop('name')).toBe(state.name);
        expect(app.prop('items')).toEqual(state.items);
    });
})
