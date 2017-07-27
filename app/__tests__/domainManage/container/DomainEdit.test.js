/**
 * Created by a on 2017/7/27.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import {DomainEdit} from '../../../src/domainManage/container/DomainEdit';


test('DomainEdit renders', ()=>{
    const component = renderer.create(
        <DomainEdit />
    )

    let domainEdit = component.toJSON();
    expect(domainEdit).toMatchSnapshot();
})

test('DomainEdit div click', ()=>{
    const component = shallow(<DomainEdit />)
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.table-container').length).toEqual(1);
    
    expect
})