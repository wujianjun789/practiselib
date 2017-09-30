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
    const closeClick = jest.fn();
    const component = shallow(<FaultPanel closeBtn={true} closeClick={closeClick}/>);
    expect(component.find('.panel').length).toEqual(1);

    component.find('button').simulate('click');
    expect(closeClick).toHaveBeenCalledTimes(1);
})