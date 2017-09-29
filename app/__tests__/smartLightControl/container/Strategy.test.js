/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import {Strategy} from '../../../src/smartLightControl/container/Strategy';

test('renders Strategy', ()=>{
    const component = renderer.create(
        <Strategy />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Strategy class', ()=>{
    const component = shallow(<Strategy />)
    expect(component.find('.collapsed').length).toEqual(0);
    component.setState({ collapse: true});
    expect(component.find('.collapsed').length).toEqual(1);
})