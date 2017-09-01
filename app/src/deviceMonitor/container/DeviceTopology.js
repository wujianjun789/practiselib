/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
export default class DeviceTopology extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <Content className="device-topology">
            设备拓扑图
        </Content>
    }
}