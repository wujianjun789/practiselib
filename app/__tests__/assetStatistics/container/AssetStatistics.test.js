/**
 * Created by a on 2017/7/21.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import {AssetStatistics} from '../../../src/assetStatistics/container/AssetStatistics';


test('AssetManage renders', ()=>{
    const component = renderer.create(
        <AssetStatistics />
    )

    let assetStatistics = component.toJSON();
    expect(assetStatistics).toMatchSnapshot();
})

test('AssetManage div click', ()=>{
    const component = shallow(<AssetStatistics />)
    expect(component.find('.heading').length).toEqual(1);
    expect(component.find('.table-container').length).toEqual(1);
})