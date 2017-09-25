/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import {SingleLamp} from '../../../src/assetManage/container/SingleLamp';
import {Gateway} from '../../../src/assetManage/container/Gateway';
import {Pole} from '../../../src/assetManage/container/Pole';
import {Screen} from '../../../src/assetManage/container/Screen';
import {Sensor} from '../../../src/assetManage/container/Sensor';
import {Xes} from '../../../src/assetManage/container/Xes';

test('AssetManage renders', ()=>{
    const component = renderer.create(
        <SingleLamp />
    )

    let assetManage = component.toJSON();
    expect(assetManage).toMatchSnapshot();
})

test('AssetManage div click', ()=>{
    const component = shallow(<SingleLamp />)
    expect(component.find('.property').length).toEqual(1);
    expect(component.find('.type').length).toEqual(1);
})
