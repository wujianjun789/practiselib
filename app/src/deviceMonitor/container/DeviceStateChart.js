/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
export default class DeviceStateChart extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <Content className="device-state-chart">
            设备状态图
        </Content>
    }
}