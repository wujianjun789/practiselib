/**
 * Created by a on 2017/9/8.
 */
import React,{Component} from 'react';
import {findDOMNode} from 'react-dom';

import Content from '../../components/Content'
import {getCurDate, drawCur, TIME_FORMAT} from '../util/chart'

import {momentDateFormat, getMomentDate} from '../../util/time'
export default class ServiceMonitoring extends Component{
    constructor(props){
        super(props);
        this.state = {
            monitorList:[
                {id:"cpu", name:"CPU", detail:"INTEL(R) XEON(R) CPU E5-1620 V3"},
                {id:"memory", name:"内存", detail:"16.0GB"},
                {id:"disk", name:"磁盘", detail:"500G"},
                {id:"network", name:"网络", detail:"INTEL(R) ETHER CONNECTION L217-LM"}
            ],
            data:{
                "cpu":{id:"cpu", min:0, max:100, list:getCurDate()},
                "memory":{id:"memory", min:0, max:100, list:getCurDate()},
                "disk":{id:"disk", min:0, max:100, list:getCurDate()},
                "network":{id:"network", min:0, max:100, list:getCurDate()}
            }
        }

        this.renderChart = this.renderChart.bind(this);
        this.initResult = this.initResult.bind(this);
    }

    componentWillMount(){

    }

    componentDidMount(){
        setInterval(()=>{
            this.initResult();
        },1000)
    }

    componentDidUpdate(){

    }

    initResult(){
        for(let key in this.state.data)
        {
            if(this.state.data[key].list.length>=24){
                this.state.data[key].list.shift();
            }
            this.state.data[key].list.push({x:momentDateFormat(getMomentDate(), TIME_FORMAT), y:parseInt(Math.random()*100)})
        }

        this.setState({data:this.state.data},()=>{
            for(let key in this.state.data){
                drawCur(key,Object.assign({}, {width:1000, height:240},this.state.data[key]))
            }
        })
    }

    renderChart(ref, id){
        if(!ref){
            return;
        }
        console.log("%%%%%%%%%%%%%%%", ref);
        drawCur(id, Object.assign({}, {width:ref.parentNode.offsetWidth, height:ref.parentNode.offsetHeight*0.95},this.state.data[id]))
    }

    render(){
        const {monitorList} = this.state;
        return <Content>
            {
                monitorList.map(mon=>{
                    return <div key={mon.id} className="col-sm-6">
                        <div className="heading"><span className="name">{mon.name}</span>{mon.detail}<span className="right">100%</span></div>
                        <div className={"chart "+mon.id} id={mon.id} ref={ref=>this.renderChart(ref, mon.id)}></div>
                    </div>
                })
            }
        </Content>
    }
}