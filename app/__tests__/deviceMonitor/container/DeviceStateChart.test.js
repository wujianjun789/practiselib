/**
 * Created by a on 2017/10/9.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import DeviceStateChart from '../../../src/deviceMonitor/container/DeviceStateChart';

const monitorList = [
    {id:"gateway", name:"网关"},
    {id:"lc", name:"单灯控制器"},
    {id:"screen", name:"显示屏"},
    {id:"collect", name:"数据采集仪"}
]

test('renders Scene', ()=>{
    const component = renderer.create(
        <DeviceStateChart />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Scene data', ()=>{
    const component = shallow(<DeviceStateChart />);
    component.setState({ monitorList:monitorList});
    expect(component.find('.monitor').length).toEqual(monitorList.length);
})