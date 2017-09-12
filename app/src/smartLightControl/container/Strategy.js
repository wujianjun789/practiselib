/**
 * Created by a on 2017/9/1.
 */
import React,{Component} from 'react';
import Content from '../../components/Content'

import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';

import {timeStrategy} from '../util/chart'
import Immutable from 'immutable';
export default class Strategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'},{id:2, value:'设备多少'}], index:0, value:'场景序号',placeholder:"排序"}),
            strategy:Immutable.fromJS({list:[{id:1, value:'时间策略'},{id:2, value:'传感器策略'},{id:3, value:'经纬度策略'}],index:0, value:'时间策略',placeholder:'策略类型'}),
            search:Immutable.fromJS({placeholder:'输入策略名称', value:''}),

            collapse:false,
            page: Immutable.fromJS({
                pageSize:10,
                current: 1,
                total: 0
            }),

            selectDevice:{
               /* id:1, strategyName:"策略1", strategyType:'传感器策略', deviceType:'灯', setState:'已设定',
                deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                strategyList:[]*/
            },

            data:Immutable.fromJS([
                {id:1, strategyName:"策略1", strategyType:'传感器策略', deviceType:'灯', setState:'已设定',
                    deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                    strategyList:[]},
                {id:2, strategyName:"策略2", strategyType:'传感器策略', deviceType:'屏幕', setState:'未设定',
                    deviceList:[{id:1, name:"屏幕", groupName:"疏影路组"},{id:2, name:"屏幕", groupName:"莘北路组"}],
                    strategyList:[]}
            ])
        }

        this.columns = [{field:"strategyName", title:"策略名称"}, {field:"strategyType", title:"策略类型"},
            {field:"deviceType", title:"设备种类"}, {field:"setState", title:"设定状态"}]

        this.timeStrategy = null;
        this.renderChart = this.renderChart.bind(this);
        this.updateChart = this.updateChart.bind(this);

        this.onChange = this.onChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.setHandler = this.setHandler.bind(this);
    }

    setHandler(){

    }

    tableClick(row){
        this.setState({selectDevice:row.toJS()}, ()=>{
            this.updateChart();
        });
    }

    onChange(key, value){
        switch(key){
            case "sort":
            case "strategy":
                this.setState({[key]:this.state[key].update('index', v=>value)})
                this.setState({[key]:this.state[key].update('value', v=>{
                    return this.state[key].getIn(['list', value, 'value']);
                })})
                break;
            case "search":
                this.setState({search:this.state.search.update("value", v=>value)});
                break;
            case "page":
                let page = this.state.page.set('current', value);
                this.setState({page: page}, ()=>{
                });
                break;
        }
    }

    collpseHandler(){
        this.setState({collapse: !this.state.collapse})
    }

    updateChart(){
        const {chartId} = this.state;
        if(!chartId) {
            return;
        }

        let IsStart = false;
        let IsEnd = false;
        const {strategyList} = this.state.selectDevice;
        if(!strategyList){
            return;
        }
        let chartList = strategyList.map(strategy=>{
            if(strategy.time.indexOf("00:00")>-1){
                IsStart = true;
            }

            if(strategy.time.indexOf("24:00")>-1){
                IsEnd = true;
            }
            return {x:strategy.time, y:/*strategy.light=="关"||strategy.light=="开"?0:*/strategy.light}
        })

        if(!IsStart){
            chartList.unshift({x:"00:00", y:0});
        }
        if(!IsEnd){
            chartList.push({x:"24:00", y:0});
        }
        if(chartList){
            this.timeStrategy && this.timeStrategy.destory();
            this.timeStrategy = timeStrategy({id:chartId, data:chartList});
        }
    }

    renderChart(ref){
        if(ref){
            this.setState({chartId:ref.id}, ()=>{
                this.updateChart();
            });
        }
    }

    render(){
        const {sort, strategy, search, selectDevice, page, collapse, data} = this.state;

        return (
            <Content className={collapse?'collapsed':''}>
                <div className="heading">
                    <Select className="sort" data={sort}
                            onChange={(selectIndex)=>this.onChange("sort", selectIndex)}/>
                    <Select className="strategy" data={strategy}
                     onChange={(selectIndex)=>this.onChange("strategy", selectIndex)}/>
                    <SearchText className="search" placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={value=>this.onChange("search", value)} submit={()=>this.searchSubmit()}/>
                </div>
                <div className="table-container">
                    <Table columns={this.columns} data={data} activeId={selectDevice.id} rowClick={(row)=>this.tableClick(row)}/>
                    <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                          current={page.get('current')} total={page.get('total')} onChange={(current,page)=>this.onChange("page", current)} />
                </div>
                <SideBarInfo IsHaveMap={false} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default strategy-info">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选中设备
                        </div>
                        <div className="panel-body strategy-property">
                            <span className="strategy-name">{selectDevice.strategyName}</span>
                            <button id="sys-update" className="btn btn-primary pull-right" onClick={this.setHandler} disabled={data.size==0 ? true : false}>设定
                            </button>
                        </div>
                    </div>
                    <div className="panel panel-default strategy-param">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>策略参数
                        </div>
                        <div className="panel-body strategy-chart" id="strategyChart" ref={this.renderChart}>

                        </div>
                    </div>
                    <div className="panel panel-default strategy-device">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>包含目标设备
                        </div>
                        <div className="panel-body">
                            <ul>
                            {
                                selectDevice.deviceList && selectDevice.deviceList.map(device=>{
                                    return <li key={device.id}><span>{device.name}</span>({device.groupName})</li>
                                })
                            }
                            </ul>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>
        )
    }
}