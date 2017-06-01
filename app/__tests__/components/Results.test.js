import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Results from '../../src/course/Results';
import Item from '../../src/course/Item';
const results = [
    { avatar: "/images/1.jpg", name: "Liuxia@sansi.com" },
    { avatar: "", name: "Hello World" },
]
const active = 0;

test('render', () => {
    const component = renderer.create(
        <Results results={results} active={active} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
})

 

test('vdom render', () => {
    const onActive = jest.fn();
    const doms = mount(
         <Results results={results} active={active} onActive={onActive}/>
    );
    const entities = doms.find('.entity');
    expect(entities.length).toBe(2);
    const e_active = entities.at(0);
    expect(e_active.find('.name').text()).toBe('Liuxia@sansi.com');
    const Item_active = doms.find(Item).at(0);
    expect(Item_active.prop('actived')).toBe(true);
    doms.find(Item).at(1).prop('onClick')();
    expect(onActive).toBeCalled();
})




