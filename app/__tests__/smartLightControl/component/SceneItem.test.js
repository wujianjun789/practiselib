/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import SceneItem from '../../../src/smartLightControl/component/SceneItem';

test('renders SceneItem', ()=>{
    const sceneItem = renderer.create(
        <SceneItem />
    ).toJSON();

    expect(sceneItem).toMatchSnapshot();
});

test('renders SceneItem class', ()=>{
    const component = shallow(<SceneItem />)
    expect(component.find('.scene-item').length).toEqual(1);
})