import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Search from '../../src/course/Search';



test('render normal', () => {
    const component = renderer.create(
        <Search value='hello' />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('render empty', () => {
    const component = renderer.create(
        <Search value='' />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('vdom render normal', () => {
    const search = mount(
        <Search value='hello' />
    );
    const input = search.find('input');
    expect(input.prop('value')).toBe('hello');

    const button = search.find('button.hidden');
    expect(button.length).toBe(0);

})

test('vdom render when value is empty', () => {
    const search = mount(
        <Search value='' />
    );
    const button = search.find('button.hidden');
    expect(button.length).toBe(1);
})




