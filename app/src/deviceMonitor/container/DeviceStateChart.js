/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';

import Content from '../../components/Content';
import Progress from '../../components/Progress';

export default class DeviceStateChart extends Component{
    constructor(props){
        super(props);
        this.state = {
            monitorList:[
                {id:"gateway", name:"网关"},
                {id:"lc", name:"单灯控制器"},
                {id:"screen", name:"显示屏"},
                {id:"collect", name:"数据采集仪"}
            ],
            data:{
                "gateway":[{id:"fault", name:"故障/总数", cur:30, total:300}, {id:"online", name:"在线/总数", cur:120, total:300}],
                "lc":[{id:"fault", name:"故障/总数", cur:30, total:300}, {id:"online", name:"在线/总数", cur:120, total:300},
                    {id:"lightRate", name:"亮灯率", cur:150, total:300, IsPercent:true}],
                "screen":[{id:"fault", name:"故障/总数", cur:30, total:300}, {id:"online", name:"在线/总数", cur:120, total:300}],
                "collect":[{id:"fault", name:"故障/总数", cur:30, total:300}, {id:"online", name:"在线/总数", cur:120, total:300}]
            }
        }

    }

    render(){
        const {monitorList, data} = this.state;
        return <Content className="device-state-chart">
            {
                monitorList.map(device=>{
                    let list = data[device.id]
                    return <div key={device.id} className="col-sm-6">
                        <div className="heading">{device.name}</div>
                        <div className="body statistics-container">
                            {
                                list.map(pro=>{
                                    return <div key={device.id+pro.id} className="progress-container">
                                        <span className="title">{pro.name}</span>
                                        <Progress  className={pro.id} min={0} max={pro.total} cur={pro.cur} IsPercent={pro.IsPercent}/>
                                    </div>
                                })
                            }
                        </div>
                        <div className="footer"><span className="left">0</span><span className="right">100%</span></div>
                    </div>
                })
            }
        </Content>
    }
}