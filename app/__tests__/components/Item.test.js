import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Item from '../../src/course/Item';

test('render normal', () => {
    const component = renderer.create(
        <Item avatar="/images/1.jpg" name="LiuXia@sansi.com" />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('render actived', () => {
    const component = renderer.create(
        <Item avatar="/images/1.jpg" name="LiuXia@sansi.com" actived={true} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

test('vdom render normal', () => {
    const onClick = jest.fn();
    const item = mount(
        <Item avatar="/images/1.jpg" name="LiuXia@sansi.com" onClick={onClick} />
    );
    const avatar = item.find('.person-icon');
    expect(avatar.prop('style').backgroundImage).toBe('url(/images/1.jpg)');

    const name = item.find('.name');
    expect(name.text()).toBe('LiuXia@sansi.com');

    const actived = item.find('.entity.active');
    expect(actived.length).toBe(0);

    const entity = item.find('.entity');
    entity.simulate('click');
    expect(onClick).toBeCalled();
})

test('vdom render actived', () => {
    const item = mount(
        <Item avatar="/images/1.jpg" name="LiuXia@sansi.com" actived={true} />
    );
    const actived = item.find('.entity.active');
    expect(actived.length).toBe(1);
})