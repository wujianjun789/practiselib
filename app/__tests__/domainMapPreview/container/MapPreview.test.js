/**
 * Created by a on 2017/7/27.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../../public/js/jquery-3.1.1.min'
import '../../../public/leaflet/leaflet';
window.d3 = require('../../../public/js/d3.min')

import MapPreview from '../../../src/domainMapPreview/container/MapPreview';


test('MapPreview renders', ()=>{
    const component = renderer.create(
        <MapPreview />
    )

    let mapPreview = component.toJSON();
    expect(mapPreview).toMatchSnapshot();
})

test('MapPreview div click', ()=>{
    const component = shallow(<MapPreview />)
})