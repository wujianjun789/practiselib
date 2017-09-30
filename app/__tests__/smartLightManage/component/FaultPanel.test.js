/**
 * Created by a on 2017/9/30.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import FaultPanel from '../../../src/smartLightManage/component/FaultPanel';

test('renders Scene', ()=>{
    const component = renderer.create(
        <FaultPanel />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Scene data', ()=>{
    const component = shallow(<FaultPanel />);
})