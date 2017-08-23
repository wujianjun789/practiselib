/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import {SingleLamp} from '../../../src/assetStatistics/container/SingleLamp';


test('AssetStatistics renders', ()=>{
    const component = renderer.create(
        <SingleLamp />
    )

    let assetStatistics = component.toJSON();
    expect(assetStatistics).toMatchSnapshot();
})

test('AssetStatistics div click', ()=>{
    const component = shallow(<SingleLamp />)
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.table-container').length).toEqual(1);
})