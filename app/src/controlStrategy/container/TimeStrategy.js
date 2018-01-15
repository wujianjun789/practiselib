/**
 * Created by a on 2017/8/14.
 */
import React,{Component, Children} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table3'
import Page from '../../components/Page'

import {injectIntl} from 'react-intl';

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import TimeStrategyPopup from '../component/TimeStrategyPopup'
import ConfirmPopup from '../../components/ConfirmPopup'
import TimeGroupPopup from '../component/TimeGroupPopup'

import Immutable from 'immutable';
import {dateStringFormat} from '../../util/string'
import {getMomentDate, momentDateFormat} from '../../util/time'

import {getModelData, getModelList} from '../../data/assetModels'

import {getStrategyListByName, getStrategyCountByName, addStrategy, updateStrategy, delStrategy} from '../../api/strategy'
import {getStrategyDeviceConfig} from '../../util/network'

import { DatePicker} from 'antd';
import {getObjectByKeyObj,getIndexByKey,getProByKey,getIndexsByKey,spliceInArray,getObjectByKey,getListKeyByKey,IsExitInArray2,IsExitInArray3} from '../../util/algorithm'
import {getLightLevelConfig} from '../../util/network'

class TimeStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:'time',
            search: Immutable.fromJS({
                placeholder: this.formatIntl('app.input.strategy.name'),
                value: ''
            }),
            selectStrategy:{},
            deviceList:{titleKey:"name", valueKey:"name", options:[/*{id:1, name:"test灯"},{id:2, name:"test显示屏"}*/]},
            strategyData:Immutable.fromJS([]),
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
            selectedDevicesData:[
                {
                    id:1,
                    name:'网关1',
                    type:'网关',
                    childs:[
                        {
                            id:2,
                            name:'设备1',
                            type:'灯',
                            parentId:1                            
                        }
                    ]
                },
                {
                    id:3,
                    name:'网关2',
                    type:'网关',
                    childs:[
                        {
                            id:4,
                            name:'设备2',
                            type:'灯',
                            parentId:3
                        },
                        {
                            id:5,
                            name:'设备3',
                            type:'灯',
                            parentId:3                          
                        },
                    ],
                },
            ],
            allDevicesData:[
                {
                    id:1,
                    name:'网关1',
                    type:'网关',
                    childs:[
                        {
                            id:2,
                            name:'设备1',
                            type:'灯',
                            parentId:1                            
                        },
                        {
                            id:6,
                            name:'设备4',
                            type:'灯',
                            parentId:1                            
                        },
                        {
                            id:7,
                            name:'设备5',
                            type:'灯',
                            parentId:1                            
                        },
                    ]
                },
                {
                    id:3,
                    name:'网关2',
                    type:'网关',
                    childs:[
                        {
                            id:4,
                            name:'设备2',
                            type:'灯',
                            parentId:3
                        },
                        {
                            id:5,
                            name:'设备3',
                            type:'灯',
                            parentId:3                          
                        },
                        {
                            id:8,
                            name:'设备6',
                            type:'灯',
                            parentId:3                            
                        },
                    ],
                },
                {
                    id:9,
                    name:'网关3',
                    type:'网关',
                    childs:[
                        {
                            id:10,
                            name:'设备7',
                            type:'灯',
                            parentId:9
                        },
                    ],
                },
            ],
            domainList:[{id:1,name:'闵行区'},{id:2,name:'徐汇区'},{id:3,name:'长宁区'},{id:4,name:'莘庄镇'},],
            lightList:[{id:1,name:"10"},{id:1,name:"20"},{id:1,name:"30"}],
            allDevices:{
                allChecked:false,
                checked:[]
            }
        }
        this.deviceDefault = [/*"lc", "screen"*/]
        this.columns =  [
            {id: 0, field:"name", title:this.formatIntl('app.strategy.name')},
            {id: 1, field: "timeRange", title: this.formatIntl('app.time.range')}
        ];

        this.deviceColumns = [
            {id: 0, field:"name", title:this.formatIntl('app.device.name')},
            {id: 1, field: "type", title: this.formatIntl('app.type')}
        ]

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.tableEdit = this.tableEdit.bind(this);
        this.tableDelete = this.tableDelete.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initResult = this.initResult.bind(this);
        this.initDeviceList = this.initDeviceList.bind(this);

        this.formatIntl = this.formatIntl.bind(this);
        this.collapseHandler = this.collapseHandler.bind(this);
        this.updateSelectItem = this.updateSelectItem.bind(this);
        this.onChange = this.onChange.bind(this);
        this.updateGroupName = this.updateGroupName.bind(this);
        this.initTableData = this.initTableData.bind(this);
        this.collapseClick = this.collapseClick.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getStrategyDeviceConfig(data=>{
            this.mounted && this.setState(this.deviceDefault=data, ()=>{
                getModelData(()=>this.mounted && this.initDeviceList(getModelList()));
            })
        })

        // this.requestSearch();
        const data = [
            {
                id:'001',
                name:'时间调光组1',
                timeRange:'1月10日-4月30日',
                type:"group",
                childs:[
                    {
                        id:1,
                        name:'冬季路灯使用策略1',
                        timeRange:'1月10日-4月30日',
                        parentId:'001',
                        type:"strategy",                        
                    },
                    {
                        id:2,
                        name:'冬季路灯使用策略2',
                        timeRange:'1月10日-4月30日',
                        parentId:'001' ,
                        type:"strategy",                        
                                               
                    }
                ],
            },
            {
                id:'002',
                name:'时间调光组2',
                timeRange:'5月1日-6月30日',
                type:"group",                
                childs:[
                    {
                        id:3,
                        name:'春季路灯使用策略1',
                        timeRange:'5月1日-6月30日',
                        parentId:'002',
                        type:"strategy",                        
                        
                    },
                    {
                        id:4,
                        name:'春季路灯使用策略2',
                        timeRange:'5月10日-6月30日',
                        parentId:'002',
                        type:"strategy",                        
                        
                    }
                ]
            },
            {
                id:'0',
                name:'未分组',
                timeRange:'',
                childs:[
                    {
                        id:5,
                        name:'策略1',
                        timeRange:'5月1日-6月30日',
                        parentId:'0',
                        type:"strategy",                        
                        
                    },
                    {
                        id:6,
                        name:'策略2',
                        timeRange:'5月10日-6月30日',
                        parentId:'0' ,
                        type:"strategy",                        
                                               
                    }
                ]
            }
        ]
        this.initTableData('strategyData',data);
        this.initTableData('selectedDevicesData',this.state.selectedDevicesData);
        this.initTableData('allDevicesData',this.state.allDevicesData);    
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    setHeight = ()=>{
        console.log(document.getElementsByClassName('select-devices')[0])
        document.getElementsByClassName('select-devices')[0].style.height = document.getElementsByClassName('content')[0].scrollHeight + "px";         
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

    initTableData(key,data){
        let result = [];
        data.map(parent=>{
            parent.collapsed = false;
            result.push(parent);
            if(parent.childs){
                parent.childs.map(item=>{
                    item.hidden = parent.collapsed;
                    result.push(item);
                })
            }
        })
        this.setState({[key]:Immutable.fromJS(result)});
    }

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
            let model = getObjectByKeyObj(data, 'id', key)
            if(model){
                list.push({id:model.id, name:model.name})
            }
        })

        this.setState({deviceList: Object.assign({}, this.state.deviceList, {options:list})})
    }

    addHandler(){
        const {actions} = this.props;
        actions.overlayerShow(<TimeStrategyPopup intl={this.props.intl} title={this.formatIntl('app.add.strategy')} groupList=''
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
                                                    object.expire ={
                                                        expireRange:expireRangeList,
                                                        executionRange:executionRangeList,
                                                    }

                                                    // object.strategy = data.strategyList.map(strategy=>{
                                                    //     return {"condition":{"time":strategy.time}, "rpc":{"brightness":strategy.light}}
                                                    // });
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

        let row = getObjectByKey(this.state.strategyData, 'id', rowId);
        if(row.get('type')=="group"){
            actions.overlayerShow(<TimeGroupPopup className="time-group-popup" intl={this.props.intl} title="修改组" name ={row.get('name')}
                onConfirm={(data)=>{
                    console.log(data)
                }} onCancel={()=>{
                actions.overlayerHide();
            }}/>)
            return;
        }
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
        actions.overlayerShow(<TimeStrategyPopup intl={this.props.intl} title="修改策略" startTime={startTime} endTime={endTime}
                    onConfirm={(data)=>{
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
                        object.expire ={
                            expireRange:expireRangeList,
                            executionRange:executionRangeList,
                            week:parseInt(weekList.join(""), 2)
                        }

                        // object.strategy = data.strategyList.map(strategy=>{
                        //     return {"condition":{"time":strategy.time}, "rpc":{"brightness":strategy.light}}
                        // });
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

        actions.overlayerShow(<ConfirmPopup tips={this.formatIntl(getObjectByKey(this.state.strategyData,'id',rowId).get('type') == "group"?'delete.group':'delete.strategy')} iconClass="icon_popup_delete" cancel={()=>{
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
        this.setState({
            selectItem: item
        });
    }

    searchSubmit() {
        // this.setState({page:page},()=>{
            this.requestSearch();
        // });    
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    collapseHandler(id) {
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) },()=>{
            if(id == "devicesExpanded" && this.state.sidebarInfo[id]){
                this.setHeight();
            }
        });
	}

    onChange(id,value) {
        console.log(id)
    }

    updateGroupName(){

    }

    expandDevice(){

    }

    collapseClick(id,key,data){
        let childs = getIndexsByKey(data,'parentId',id);
        childs.length !== 0 && childs.map(item=>{
            data = data.setIn([item,'hidden'],!data.getIn([item,"hidden"]));
        });
        this.setState({[`${key}Data`]:data.setIn([getIndexByKey(data,"id",id),"collapsed"],!getProByKey(data,"id",id,"collapsed"))});
    }
    
    allCheckChange = (value)=>{
        const {allDevices,allDevicesData} = this.state;
        let checked = [];
        value && allDevicesData.map(item=>{
            checked.push(item.get("id"));
        })
        this.setState({allDevices:{
            allChecked:value,
            checked:checked
        }})
    }

    rowCheckChange = (id, value)=>{
        let {allDevices,allDevicesData} = this.state;
        value?allDevices.checked.push(id):spliceInArray(allDevices.checked,id);
        let obj = getObjectByKey(allDevicesData,"id",id);
        let childs = [];
        if(obj.get('childs')){
            childs=getListKeyByKey(allDevicesData,'parentId',id,'id');
            childs.map(item=>{
                value?!allDevices.checked.includes(item) && allDevices.checked.push(item):spliceInArray(allDevices.checked,item);
            })
        }
        else{
            childs=getListKeyByKey(allDevicesData,'parentId',obj.get('parentId'),'id');
            if(value){
                IsExitInArray3(allDevices.checked,childs) && allDevices.checked.push(obj.get('parentId'));
            }
            else{
                IsExitInArray2(allDevices.checked,childs) && spliceInArray(allDevices.checked,obj.get('parentId'));
            }
        }
        allDevices.allChecked = allDevicesData.size == allDevices.checked.length;
        this.setState({allDevices:allDevices});
    }

    render(){
        const {search, selectedDevicesData,allDevicesData, page, strategyData, sidebarInfo, selectItem,property,domainList,lightList,allDevices} = this.state;

        return <Content className={`time-strategy ${sidebarInfo.collapsed ? 'collapse' : sidebarInfo.devicesExpanded?'select-devices-collapse':''}`}>
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button  className="btn btn-primary add-strategy" onClick={this.addHandler}>{this.formatIntl('button.add')}</button>
            </div>
            <div className="table-container">
                <Table className="strategy" isEdit={true} columns={this.columns} data={strategyData} activeId={selectItem && selectItem.id}
                       rowClick={this.tableClick} rowEdit={this.tableEdit} rowDelete={this.tableDelete} collapseClick={this.collapseClick}/>
            </div>
            <div className={`container-fluid sidebar-info ${sidebarInfo.collapsed ? "sidebar-collapse" : ""}`}>
                <div className="row collapse-container" onClick={()=>this.collapseHandler('collapsed')}>
                    <span className={sidebarInfo.collapsed ? "icon_horizontal"  :"icon_vertical"}></span>
                </div>
                {
                    selectItem.type == "group"?
                    <div className="panel panel-default group-info">
                        <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed') }}>
                            <span className={sidebarInfo.collapsed ? "icon_select" :
                                "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>选中组
                        </div>
                        <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                            <div className='form-group'>
                                <label>{this.formatIntl('app.strategy.group.name')}</label>
                                <div className='input-container'>
                                    <input type='text' className='form-control' value={selectItem.name} disabled="disabled"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="panel-strategy">
                        <div className="panel panel-default">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_select" :
                                    "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>选中策略
                            </div>
                            <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                                <div className='form-group'>
                                    <label>{this.formatIntl('app.strategy.name')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.name} disabled="disabled"/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>{this.formatIntl('app.strategy.type')}</label>
                                    <div className='input-container'>
                                        <select className='form-control' value={selectItem.type} disabled="disabled"></select>
                                    </div>
                                </div>

                                <div className='form-group date-range'>
                                    <label>{this.formatIntl('app.date.range')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.starDate} disabled="disabled"/>
                                        <span>{this.formatIntl('mediaPublish.to')}</span>
                                        <input type='text' className='form-control' value={selectItem.endDate} disabled="disabled"/>
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <label>{this.formatIntl('app.strategy.retryCount')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.retryCount} disabled="disabled"/>
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>{this.formatIntl('app.strategy.retryInterval')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.retryInterval} disabled="disabled"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default strategy-info">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('parameterCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_control" :
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
                        <div className="panel panel-default device-info">
                            <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('devicesCollapsed') }}>
                                <span className={sidebarInfo.collapsed ? "icon_device_list" :
                                    "glyphicon " + (sidebarInfo.devicesCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>包含设备
                            </div>
                            <div className={"panel-body " + (sidebarInfo.devicesCollapsed ? 'collapsed' : '')}>
                                <div className="header">
                                    <span>{`包含：${60}个设备`}</span>
                                    <button className="btn btn-primary pull-right" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('devicesExpanded') }}>{this.formatIntl('button.modify')}</button>                                   
                                </div>
                                <Table className="selectedDevices" columns={this.deviceColumns} data={selectedDevicesData} collapseClick={this.collapseClick}/>
                            </div>
                        </div>
                    </div>
                }
                
                
            </div>
            {sidebarInfo.devicesExpanded && <div className='container-fluid sidebar-info sidebar-devices'>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <span className="glyphicon glyphicon-triangle-bottom"></span>选择设备
                    </div>
                    <div className="panel-body">
                        <div>
                            <button className="btn btn-gray" onClick={() => {}}>{this.formatIntl('button.add.gateway')}</button>                                   
                            <button className="btn btn-primary pull-right" onClick={() => {this.collapseHandler('devicesExpanded') }}>{this.formatIntl('button.modify')}</button>                                                               
                        </div>
                        <Table  className="allDevices" columns={this.deviceColumns} data={allDevicesData} allChecked={allDevices.allChecked} checked={allDevices.checked} collapseClick={this.collapseClick} allCheckChange={this.allCheckChange} rowCheckChange={this.rowCheckChange}/>
                    </div>
                </div>
            </div>}
            {sidebarInfo.devicesExpanded && <div className="select-devices"></div>}
            
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