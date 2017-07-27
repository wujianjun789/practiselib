/**
 * Created by a on 2017/7/27.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer'

import '../../public/js/jquery-3.1.1.min'
import '../../public/leaflet/leaflet';
window.d3 = require('../../public/js/d3.min')

import MapView from '../../src/components/MapView';

let data = {
    position: {
        "device_id": 1,
            "device_type": 'DEVICE',
            x: 121.49971691534425,
            y: 31.239658843127756
    },
    data: {
        id: 1,
            name: '上海市'
    }
}
test('MapView renders', ()=>{

    const component = renderer.create(
        <MapView mapData={data} />
    )

    let mapView = component.toJSON();
    expect(mapView).toMatchSnapshot();
})

test('MapView div click', ()=>{
    const component = shallow(<MapView mapData={data}/>)
})