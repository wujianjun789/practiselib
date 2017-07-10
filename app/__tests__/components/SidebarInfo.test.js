/**
 * Created by a on 2017/7/6.
 */
import React from 'react';
import renderer from 'react-test-renderer'
import {shallow} from 'enzyme';

import '../../public/js/jquery-3.1.1.min'
import '../../public/leaflet/leaflet';
window.d3 = require('../../public/js/d3.min')

import SideBarInfo from '../../src/components/SideBarInfo'

test('SidebarInfo renders', ()=>{

    const component = renderer.create(
        <SideBarInfo />
    )

    let sideBarInfo = component.toJSON();
    expect(sideBarInfo).toMatchSnapshot();
})

test('SidebarInfo div click', ()=>{
    const component = shallow(<SideBarInfo />)

    component.find('.collapse-container').simulate('click');
    expect(component.is('.sidebar-collapse')).toEqual(true);
})

