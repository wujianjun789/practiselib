import { Provider } from 'react-redux';
import * as React from 'react';
import configureStore from '../../src/store/configureStore'
import Page, { Course } from '../../src/containers/pages/Course'
import Results from '../../src/course/Results'
import Search from '../../src/course/Search'
import Item from '../../src/course/Item'
import { mount } from 'enzyme';
import { SEARCH, ACTIVE_CHANGE } from '../../src/actionTypes'
describe('test course', () => {
    const results = [
        { avatar: "/images/1.jpg", name: "LiuXia@sansi.com" },
        { avatar: "", name: "Hello World" },
    ]
    const active = 0;
    test('normal', () => {
        const root = mount(
            <Course search="LiuXia" results={results} active={0} />
        );
        const sear = root.find(Search);
        const lis = root.find(Results);
        expect(lis.prop('results')).toEqual([{ avatar: "/images/1.jpg", name: "LiuXia@sansi.com" }]);
    })

    test('test search', () => {
        const store = configureStore()
        const root = mount(<Provider store={store}>
            <Page />
        </Provider>);
        const sear = root.find(Search);
        const lis = root.find(Results)

        const input = sear.find('input');
        input.simulate('change', { target: { value: 'LiuXia' } })

        expect(lis.prop('results')).toEqual([{ avatar: "/images/1.jpg", name: "LiuXia@sansi.com" }]);
    })


    test('test active', () => {
        const store = configureStore()
        const root = mount(<Provider store={store}>
            <Page />
        </Provider>);
        const sear = root.find(Search);
        const lis = root.find(Results)
        const ite = root.find(Item).at(1)
        const item = ite.find('.entity');
        item.simulate('click');
        expect(ite.prop('actived')).toEqual(true);



    })
})