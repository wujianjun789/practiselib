import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Results from '../../src/course/Results';

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
    const doms = mount(
         <Results results={results} active={active} />
    );
    const entities = doms.find('.entity');
    expect(entities.length).toBe(2);
    const e_active = entities.at(0);
    expect(e_active.find('.name').text()).toBe('Liuxia@sansi.com');
    
})




