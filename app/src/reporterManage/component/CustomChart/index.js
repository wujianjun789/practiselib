import React from 'react' 
import echarts from 'echarts';

import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import './style.less'
import option from './option'
export default class CustomChart extends React.Component{
    constructor(props){
        super(props);
        const {start,end,data,unit}=this.props;
        this.state={
            start,end,data,unit
        }
    }
    componentDidMount(){
        this.myChart=echarts.init(document.getElementById('custom-chart'));
        this.draw()
    }
    componentWillReceivePros(nextProps){
        const {start,end,data,unit}=this.props;
        if(start!==this.props.start||end!==this.props.end||data!==this.props.data||unit!==this.props.unit){
            this.setState({start,end,data,unit},this.draw)
        }
    }
    draw=()=>{
        let {start,end,data,unit}=this.state;

        if (data.length) {
            option.title.text = ''
        } else {
            option.title.text = '暂无数据，模拟测试'
             //测试所用数据
             data=[
                {timestamp:'2018-03-01',value:30},
                {timestamp:'2018-03-02',value:50},
                {timestamp:'2018-03-05',value:60},
                {timestamp:'2018-03-08',value:10},
                {timestamp:'2018-03-09',value:80},
                {timestamp:'2018-03-10',value:20},
                {timestamp:'2018-03-15',value:90},
                {timestamp:'2018-03-19',value:100},
                {timestamp:'2018-03-20',value:20},
                {timestamp:'2018-03-30',value:33},
                {timestamp:'2018-03-31',value:65}
            ]
        }
        const xData=data.map((item)=>item.timestamp);
        const yData=data.map((item)=>item.value)
        option.xAxis.data=xData;
        option.series[0].data=yData;
        this.myChart.setOption(option)
    }
    render(){
        return(
            <div class='customchart-container'>
                <div id='custom-chart'>
                </div>
            </div>
        )
    }
}