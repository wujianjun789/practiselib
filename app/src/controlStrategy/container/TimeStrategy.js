/**
 * Created by a on 2017/8/14.
 */
import React,{Component, Children} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'

import {injectIntl} from 'react-intl';

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import TimeStrategyPopup from '../component/TimeStrategyPopup'
import ConfirmPopup from '../../components/ConfirmPopup'

import Immutable from 'immutable';
import {getObjectByKey} from '../../util/index';
import {dateStringFormat} from '../../util/string'
import {getMomentDate, momentDateFormat} from '../../util/time'

import {getModelData, getModelList} from '../../data/assetModels'

import {getStrategyListByName, getStrategyCountByName, addStrategy, updateStrategy, delStrategy} from '../../api/strategy'
import {getStrategyDeviceConfig} from '../../util/network'

import { DatePicker} from 'antd';

class TimeStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:'time',
            search: Immutable.fromJS({
                placeholder: this.formatIntl('app.input.strategy.name'),
                value: ''
            }),
            selectStrategy:{

            },
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 0
            }),
            deviceList:{titleKey:"name", valueKey:"name", options:[/*{id:1, name:"test灯"},{id:2, name:"test显示屏"}*/]},
            strategyList:[/*{id:"start", time:"00:00", light:0}, {id:"end", time:"24:00", light:0}*/],
            data:Immutable.fromJS([
                {
                    id:'001',
                    name:'时间调光组1',
                    timeRange:'1月10日-4月30日',
                    childs:[
                        {
                            id:1,
                            name:'冬季路灯使用策略1',
                            timeRange:'1月10日-4月30日',
                        },
                        {
                            id:2,
                            name:'冬季路灯使用策略2',
                            timeRange:'1月10日-4月30日',
                        }
                    ],
                    hidden:false,
                },
                {
                    id:'002',
                    name:'时间调光组2',
                    timeRange:'5月1日-6月30日',
                    hidden:true,
                    childs:[
                        {
                            id:1,
                            name:'春季路灯使用策略1',
                            timeRange:'5月1日-6月30日',
                        },
                        {
                            id:2,
                            name:'春季路灯使用策略2',
                            timeRange:'5月10日-6月30日',
                        }
                    ]
                },
                {
                    id:'002',
                    name:'时间调光组2',
                    timeRange:'5月1日-6月30日',
                    hidden:false,
                }
            ]),
            sidebarInfo: {
                collapsed: false,
                propertyCollapsed: false,
                parameterCollapsed: false,
                devicesCollapsed: false,
                devicesExpanded:false
            },
            selectItem: {
                id: "",
                name: "",
                type: " ",
                starDate:"",
                endDate:"",
                retryCount:"",
                retryInterval:""
            },
            property:{
                lng:'',
                lat:'',
                domain:'',
                time:'',
                light:''
            },
            domainList:[{id:1,name:'闵行区'},{id:2,name:'徐汇区'},{id:3,name:'长宁区'},{id:4,name:'莘庄镇'},],
            lightList:[{id:1,name:"10"},{id:1,name:"20"},{id:1,name:"30"}]
        }
        this.deviceDefault = [/*"lc", "screen"*/]
        this.columns =  [
            {id: 0, field:"name", title:this.formatIntl('app.strategy.name')},
            {id: 1, field: "timeRange", title: this.formatIntl('app.time.range')}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        // this.pageChange = this.pageChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.tableEdit = this.tableEdit.bind(this);
        this.tableDelete = this.tableDelete.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        // this.initPageSize = this.initPageSize.bind(this);
        this.initResult = this.initResult.bind(this);
        // this.initStrategyList = this.initStrategyList.bind(this);
        this.initDeviceList = this.initDeviceList.bind(this);

        this.formatIntl = this.formatIntl.bind(this);
        this.collapseHandler = this.collapseHandler.bind(this);
        this.updateSelectItem = this.updateSelectItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateGroupName = this.updateGroupName.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getStrategyDeviceConfig(data=>{
            this.mounted && this.setState(this.deviceDefault=data, ()=>{
                getModelData(()=>this.mounted && this.initDeviceList(getModelList()));
            })
        })

        this.requestSearch();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    requestSearch() {
        const {model, page, search} = this.state;
        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let name = search.get("value");
        getStrategyListByName(model, name, offset, limit, data=>{this.mounted && this.initResult(data)});
        // getStrategyCountByName(model, name, data=>{this.mounted && this.initPageSize(data)})
    }

    // initPageSize(data){
    //     let page = this.state.page.set('total', data.count);
    //     this.setState({page:page});
    // }

    initResult(data){
        let list = data.map(strategy=>{
            let expR = strategy.expire.expireRange;
            let exeR = strategy.expire.executionRange;
            let timeRange = "";
            if(expR && expR.length){
                timeRange += dateStringFormat(expR[0]);
            }
            else if(exeR && exeR.length){
                timeRange += dateStringFormat(exeR[0], false);
            }

            if(expR && expR.length==2){
                timeRange += "-"+dateStringFormat(expR[1]);
            }
            else if(exeR && exeR.length==2){
                timeRange += "-"+dateStringFormat(exeR[1], false)
            }
            return {id:strategy.id, name:strategy.name, timeRange:timeRange, deviceType:strategy.asset,
                                week:strategy.expire.week, asset:strategy.asset,strategy:strategy.strategy,
                expire:strategy.expire};
        })

        this.setState({data:Immutable.fromJS(list)});
        if(data && data.length){
            this.setState({selectStrategy:data[0]});
        }
    }

    // initStrategyList(data){
    //     this.setState({strategyList:data})
    // }

    initDeviceList(data){
        let list = [];
        this.deviceDefault.map(key=>{
            let model = getObjectByKey(data, 'id', key)
            if(model){
                list.push({id:model.id, name:model.name})
            }
        })

        this.setState({deviceList: Object.assign({}, this.state.deviceList, {options:list})})
    }

    addHandler(){
        const {actions} = this.props;
        const {model, deviceList, strategyList} = this.state;
        let initData = {
            name:"",
            device:deviceList.options.length?deviceList.options[0]:null
        }

        actions.overlayerShow(<TimeStrategyPopup intl={this.props.intl} title={this.formatIntl('app.add.strategy')} data={initData} deviceList={deviceList} strategyList={strategyList}
                                                 onConfirm={(data)=>{
                                                    let weekList = data.workTime.map(day=>{
                                                            return day.get("active")?1:0
                                                        });

                                                    let year = data.startTime.year.get("value");
                                                    let expireRangeList = [];
                                                    let executionRangeList = [];
                                                    if(year==0){
                                                        executionRangeList.push(data.startTime.month.get("value")+"-"+data.startTime.date.get("value"),
                                                        data.endTime.month.get("value")+"-"+data.endTime.date.get("value"));
                                                    }else{
                                                        expireRangeList.push(data.startTime.year.get("value")+"-"+data.startTime.month.get("value")+"-"+data.startTime.date.get("value"),
                                                        data.endTime.year.get("value")+"-"+data.endTime.month.get("value")+"-"+data.endTime.date.get("value"));
                                                    }

                                                    let object = {};
                                                    object.name = data.name;
                                                    object.type = model,
                                                    object.asset = data.device.id;
                                                    object.expire ={
                                                        expireRange:expireRangeList,
                                                        executionRange:executionRangeList,
                                                        week:parseInt(weekList.join(""), 2)
                                                    }

                                                    object.strategy = data.strategyList.map(strategy=>{
                                                        return {"condition":{"time":strategy.time}, "rpc":{"brightness":strategy.light}}
                                                    });
                                                    addStrategy(object, ()=>{
                                                        this.requestSearch();
                                                        actions.overlayerHide();
                                                    })
                                                 }} onCancel={()=>{
                                                    actions.overlayerHide();
                                                 }}/>)
    }

    tableEdit(rowId){
        const {actions} = this.props;
        const {model, deviceList} = this.state;
        let row = Immutable.fromJS(getObjectByKey(this.state.data.toJS(), 'id', rowId));
        let device = getObjectByKey(deviceList.options, 'id', row.get("deviceType"));
        let initData = {
            name: row.get("name"),
            device: device
        }

        let strategyList=[];
        // let Isrepeat = false;
        // strategyList.push({id:row.get("id"), time:"00:00", light:0})
        row.get("strategy").map(strategy=>{
            let strategyTime = strategy.getIn(["condition", "time"]);
            // if(strategyTime.indexOf("00:00")>-1){
            //     strategyList.splice(0, 1, {id:row.get("id"), time:strategyTime, light:strategy.getIn(["rpc", "brightness"])});
            // }else{
                strategyList.push({id:row.get("id"), time:strategyTime, light:strategy.getIn(["rpc", "brightness"])});
            // }


        })

        // if(!Isrepeat){
        //     strategyList.push({id:row.get("id"), time:"24:00", light:0});
        // }


        let expR = row.getIn(["expire", "expireRange"])
        let exeR = row.getIn(["expire", "executionRange"])
        let expRList = [];
        let exeRList = [];

        let startTime = {};
        let endTime = {};
        if(expR && expR.size){
            expRList = expR.get(0).split("-");
            startTime = {year:expRList[0], month:expRList[1], date:expRList[2]};
        }else if(exeR && exeR.size){
            exeRList = exeR.get(0).split("-");
            startTime = {year:0, month:exeRList[0], date:exeRList[1]};
        }

        if(expR && expR.size==2){
            expRList = expR.get(1).split("-");
            endTime = {year:expRList[0], month:expRList[1], date:expRList[2]};
        }else if(exeR && exeR.size==2){
            exeRList = exeR.get(1).split("-");
            endTime = {year:0, month:exeRList[0], date:exeRList[1]};
        }
        actions.overlayerShow(<TimeStrategyPopup intl={this.props.intl} title="修改策略" data={initData} deviceList={deviceList} strategyList={strategyList}
                                                 workTime={row.get("week")} startTime={startTime} endTime={endTime}
                    onConfirm={(data)=>{
                        let weekList = data.workTime.map(day=>{
                                return day.get("active")?1:0
                            });

                        let year = data.startTime.year.get("value");
                        let expireRangeList = [];
                        let executionRangeList = [];
                        if(year==0){
                            executionRangeList.push(data.startTime.month.get("value")+"-"+data.startTime.date.get("value"),
                            data.endTime.month.get("value")+"-"+data.endTime.date.get("value"));
                        }else{
                            expireRangeList.push(data.startTime.year.get("value")+"-"+data.startTime.month.get("value")+"-"+data.startTime.date.get("value"),
                            data.endTime.year.get("value")+"-"+data.endTime.month.get("value")+"-"+data.endTime.date.get("value"));
                        }
                        let object = {};
                        object.id = rowId;
                        object.name = data.name;
                        object.type = model;
                        object.asset = data.device.id;
                        object.expire ={
                            expireRange:expireRangeList,
                            executionRange:executionRangeList,
                            week:parseInt(weekList.join(""), 2)
                        }

                        object.strategy = data.strategyList.map(strategy=>{
                            return {"condition":{"time":strategy.time}, "rpc":{"brightness":strategy.light}}
                        });
                        updateStrategy(object, ()=>{
                            this.requestSearch();
                            actions.overlayerHide();
                        })
                    }} onCancel={()=>{
                        actions.overlayerHide();
                    }}/>)
    }

    tableDelete(rowId){
        const {actions} = this.props;

        actions.overlayerShow(<ConfirmPopup tips={this.formatIntl('delete.strategy')} iconClass="icon_popup_delete" cancel={()=>{
            actions.overlayerHide();
        }} confirm={()=>{
            delStrategy(rowId, ()=>{
                this.requestSearch();
                actions.overlayerHide();
            })
        }}/>)
    }

    tableClick(row){
        this.updateSelectItem(row.toJS());
    }

    updateSelectItem(item) {
        let selectDevice = this.state.selectDevice;
        
        this.setState({
            selectDevice: selectDevice
        });
    }


    // pageChange(current, pageSize){
    //     let page = this.state.page.set('current', current);
    //     this.setState({page: page}, ()=> {
    //         this.requestSearch();
    //     });
    // }

    searchSubmit() {
        let page = this.state.page.set('current', 1);
        this.setState({page:page},()=>{
            this.requestSearch();
        });    
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    collapseHandler(id) {
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) });
	}

    onChange(id,value) {
        console.log(id)
    }

    updateGroupName(){

    }

    expandDevice(){

    }

    render(){
        const {search, selectDevice, page, data, sidebarInfo, selectItem,property,domainList,lightList} = this.state;

        return <Content className={`time-strategy ${sidebarInfo.collapsed ? 'collapse' : ''}`}>
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button  className="btn btn-primary add-strategy" onClick={this.addHandler}>{this.formatIntl('button.add')}</button>
            </div>
            <div className="table-container">
                <Table isEdit={true} columns={this.columns} data={data} activeId={selectDevice && selectDevice.id}
                       rowClick={this.tableClick} rowEdit={this.tableEdit} rowDelete={this.tableDelete}/>
                {/* <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                      current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/> */}
            </div>
            <div className={`container-fluid sidebar-info ${sidebarInfo.collapsed ? "sidebar-collapse" : ""}`}>
                <div className="row collapse-container" onClick={()=>this.collapseHandler('collapsed')}>
                    <span className={sidebarInfo.collapsed ? "icon_horizontal"  :"icon_vertical"}></span>
                </div>
                {
                    selectItem.type == "group"?
                    <div className="panel panel-default group-info">
                        <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed') }}>
                            <span className={sidebarInfo.collapsed ? "icon_info" :
                                "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>选中组
                        </div>
                        <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                            <div className='form-group'>
                                <label>组名称</label>
                                <div className='input-container'>
                                    <input type='text' className='form-control' placeholder="输入名称" onChange={e=>this.onChange("name",e)}/>
                                </div>
                            </div>
                            <button className="btn btn-primary pull-right" onClick={this.updateGroupName}>{this.formatIntl('button.apply')}</button>                            
                        </div>
                    </div>
                    :
                    <div className="panel-strategy">
                        <div className="panel panel-default">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_info" :
                                    "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>选中策略
                            </div>
                            <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                                <div className='form-group'>
                                    <label>策略名称</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.name} disabled="disabled"/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>策略类别</label>
                                    <div className='input-container'>
                                        <select className='form-control' value={selectItem.type} disabled="disabled"></select>
                                    </div>
                                </div>

                                <div className='form-group date-range'>
                                    <label>日期范围</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.starDate} disabled="disabled"/>
                                        <span>至</span>
                                        <input type='text' className='form-control' value={selectItem.endDate} disabled="disabled"/>
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <label>重试次数</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.retryCount} disabled="disabled"/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>重试间隔</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.retryInterval} disabled="disabled"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default strategy-info">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('parameterCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_info" :
                                    "glyphicon " + (sidebarInfo.parameterCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>调整参数
                            </div>
                            <div className={"panel-body " + (sidebarInfo.parameterCollapsed ? 'collapsed' : '')}>
                                <div className='form-group'>
                                    <label>经度</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={property.lng} onChange={e=>this.onChange("lng",e)}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>纬度</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={property.lat} onChange={e=>this.onChange("lat",e)}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>选择域</label>
                                    <div className='input-container'>
                                        <select className='form-control' value={property.domain} onChange={e=>this.onChange("domain",e)}>
                                        {
                                            domainList.map((item, index) => {
                                                return <option key={index} value={item.name}>{item.name}</option>
                                            })
                                        }
                                        </select>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>时间</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={property.time} onChange={e=>this.onChange("time",e)}/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>亮度</label>
                                    <div className='input-container'>
                                        <select className='form-control' value={property.light} onChange={e=>this.onChange("light",e)}>
                                        {
                                            lightList.map((item, index) => {
                                                return <option key={index} value={item.name}>{item.name}</option>
                                            })
                                        }
                                        </select>
                                    </div>
                                </div>
                                <button className="btn btn-primary pull-right" onClick={this.updateGroupName}>{this.formatIntl('button.apply')}</button>                            
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('devicesCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_info" :
                                    "glyphicon " + (sidebarInfo.devicesCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>包含设备
                            </div>
                            <div className={"panel-body " + (sidebarInfo.devicesCollapsed ? 'collapsed' : '')}>
                                <div className="header">
                                    <span>{`包含：${60}个设备`}</span>
                                    <button className="btn btn-primary pull-right" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('devicesExpanded') }}>{this.formatIntl('button.modify')}</button>                                   
                                </div>
                            </div>
                        </div>
                    </div>
                }
                
                
            </div>
            {/* <div className="select-devices"> 

            </div> */}
        </Content>
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(TimeStrategy));