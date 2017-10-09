/**
 * Created by a on 2017/10/9.
 */
import React from 'react';
import {shallow} from 'enzyme'
import renderer from 'react-test-renderer';

import SystemRunningState from '../../../src/serviceMonitoring/container/SystemRunningState';

const monitorList = [
    {id:"cpu", name:"CPU", detail:"INTEL(R) XEON(R) CPU E5-1620 V3"},
    {id:"memory", name:"内存", detail:"16.0GB"},
    {id:"disk", name:"磁盘", detail:"500G"},
    {id:"network", name:"网络", detail:"INTEL(R) ETHER CONNECTION L217-LM"}
]

test('renders Scene', ()=>{
    const component = renderer.create(
        <SystemRunningState />
    ).toJSON();

    expect(component).toMatchSnapshot();
});

test('renders Scene data', ()=>{
    const component = shallow(<SystemRunningState />);
    component.setState({ monitorList:monitorList});
    expect(component.find('.monitor').length).toEqual(monitorList.length);
})