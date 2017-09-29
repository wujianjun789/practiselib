/**
 * Created by a on 2017/9/29.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import Scene from '../../../src/smartLightControl/container/Scene';

const sceneList = [
    {id:1, name:"场景1", active:false, presets:[{id:1, name:"灯1"},{id:2, name:"屏幕"}]},
    {id:2, name:"场景2", active:false, presets:[{id:3, name:"灯1"},{id:4, name:"屏幕"}]}
];

test('renders Scene', ()=>{
    const component = renderer.create(
        <Scene />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Scene data', ()=>{
    const component = shallow(<Scene />);
    component.setState({ sceneList:sceneList});
    expect(component.find('.scene-item-container').length).toEqual(sceneList.length);
})