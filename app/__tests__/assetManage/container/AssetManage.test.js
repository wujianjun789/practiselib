/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import {SingleLamp} from '../../../src/assetManage/container/SingleLamp';


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
