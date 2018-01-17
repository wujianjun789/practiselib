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
import AddGatewayPopup from '../component/AddGatewayPopup'

import Immutable from 'immutable';
import {dateStringFormat} from '../../util/string'
import {getMomentDate, momentDateFormat} from '../../util/time'

import {getModelData, getModelList} from '../../data/assetModels'

// import {getStrategyListByName, getStrategyCountByName, addStrategy, updateStrategy, delStrategy} from '../../api/strategy'
import {getStrategyDeviceConfig} from '../../util/network'

import { DatePicker} from 'antd';
import {getObjectByKeyObj,getIndexByKey,getProByKey,getIndexsByKey,spliceInArray,getObjectByKey,getListKeyByKey,IsExitInArray2,IsExitInArray3,getListByKey2} from '../../util/algorithm'
import {getLightLevelConfig} from '../../util/network'
import {getStrategyList,getGroupListPlan,getNoGroupStrategy,delStrategy,delGroup,addStrategy,updateStrategy,updateGroup} from '../../api/plan';

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
            },
            property:{
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
    }

    componentWillMount(){
        this.mounted = true;
        this.requestSearch();
        this.initDeviceData('selectedDevicesData',this.state.selectedDevicesData);
        this.initDeviceData('allDevicesData',this.state.allDevicesData);    
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    setHeight = ()=>{
        console.log(document.getElementsByClassName('select-devices')[0])
        document.getElementsByClassName('select-devices')[0].style.height = document.getElementsByClassName('content')[0].scrollHeight + "px";         
    }

    formatIntl=(formatId)=>{
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
    }

    requestSearch=() =>{
        getGroupListPlan(data=>{
            data.map(item=>{
                item.plans=getListByKey2(item.plans,'type',0);
            })
            getNoGroupStrategy(res=>{
                if(res.length){
                    res.map(item=>{
                        item.groupId = 0;
                    })
                    data.push({
                        id:0,
                        name:"未分组",
                        plans:res
                    })
                }
                this.initTableData('strategyData',data);
            })
        })
    }

    initTableData=(key,data)=>{
        let result = [];
        const {search} = this.state;
        data.map(parent=>{
            if(parent.name.indexOf(search.get("value"))>-1){
                parent.collapsed = false;
                result.push(parent);
                if(parent.plans){
                    parent.plans.map(item=>{
                        item.hidden = parent.collapsed;
                        item.timeRange = dateStringFormat(item.start)+"-"+dateStringFormat(item.end)
                        result.push(item);
                    })
                }
            }
            else{
                parent.plans.map(item=>{
                    if(item.name.indexOf(search.get("value"))>-1){
                        parent.collapsed = false;
                        result.push(parent);

                        item.hidden = parent.collapsed;
                        item.timeRange = dateStringFormat(item.start)+"-"+dateStringFormat(item.end)
                        result.push(item);
                    }
                })
            }
        })
        result.length>0 && result.map(item=>{
            item.key = (item.plans?"group":"plan")+item.id;
        });

        this.setState({[key]:Immutable.fromJS(result),selectItem:result.length>0?result[0]:{}},()=>{
            console.log(this.state.selectItem)
        });
    }

    initDeviceData=(key,data)=>{
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

    addHandler=()=>{
        const {actions} = this.props;
        actions.overlayerShow(<TimeStrategyPopup intl={this.props.intl} title={this.formatIntl('app.add.strategy')} 
                                                 onConfirm={(data)=>{
                                                    data.type=0;
                                                    addStrategy(data, ()=>{
                                                        this.requestSearch();
                                                        actions.overlayerHide();
                                                     })
                                                 }} onCancel={()=>{
                                                    actions.overlayerHide();
                                                 }}/>)
    }

    tableEdit=(rowKey)=>{
        const {actions} = this.props;

        let row = getObjectByKey(this.state.strategyData, 'key', rowKey);
        if(row.get('plans')){
            actions.overlayerShow(<TimeGroupPopup className="time-group-popup" intl={this.props.intl} title="修改组" name ={row.get('name')}
                onConfirm={(data)=>{
                    updateGroup({id:row.get("id"),name:data},()=>{
                        this.requestSearch();
                        actions.overlayerHide();                        
                    })
                console.log(data)
                }} onCancel={()=>{
                actions.overlayerHide();
            }}/>)
            return;
        }
        
        actions.overlayerShow(<TimeStrategyPopup isEdit intl={this.props.intl} title="修改策略" data={row.toJS()}
                    onConfirm={(data)=>{
                        data.id = row.get("id");
                        data.type = 0;
                        updateStrategy(data, ()=>{
                            this.requestSearch();
                            actions.overlayerHide();
                        })
                    }} onCancel={()=>{
                        actions.overlayerHide();
                    }}/>)
    }

    tableDelete=(rowKey)=>{
        const {actions} = this.props;
        const item = getObjectByKey(this.state.strategyData,'key',rowKey);
        actions.overlayerShow(<ConfirmPopup tips={this.formatIntl(item.get('plans')?'delete.group':'delete.strategy')} iconClass="icon_popup_delete" cancel={()=>{
            actions.overlayerHide();
        }} confirm={()=>{
            item.get('plans')?
            delGroup(item.get("id"),()=>{
                this.requestSearch();
                actions.overlayerHide();
            }):
            delStrategy(item.get("id"), ()=>{
                this.requestSearch();
                actions.overlayerHide();
            })
        }}/>)
    }

    tableClick=(row)=>{
        this.updateSelectItem(row.toJS());
    }

    updateSelectItem=(item) =>{
        let selectItem = item;
        if(!item.plans){
            selectItem.start=item.start.split('T')[0];
            selectItem.end=item.end.split('T')[0];
            selectItem.retryNumber=item.retryNumber;
            selectItem.retryInterval=item.retryInterval;
            
        }
       
        this.setState({
            selectItem: selectItem
        });
    }

    searchSubmit=()=> {
        this.requestSearch();
    }

    searchChange=(value)=>{
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    collapseHandler=(id)=> {
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) },()=>{
            if(id == "devicesExpanded" && this.state.sidebarInfo[id]){
                this.setHeight();
            }
        });
	}

    onChange=(id,value)=> {
        console.log(id)
    }

    updateGroupName=()=>{

    }

    expandDevice=()=>{

    }

    collapseClick=(id,key,data)=>{
        let plans;
        if(key=="strategy"){
            let parentId = getProByKey(data,"key",id,"id");
            plans = getIndexsByKey(data,'groupId',parentId);
        }
        else{
            plans = getIndexsByKey(data,"parentId",id);
        }
        plans.length !== 0 && plans.map(item=>{
            data = data.setIn([item,'hidden'],!data.getIn([item,"hidden"]));
        });
        this.setState({[`${key}Data`]:data.setIn([getIndexByKey(data,key=="strategy"?"key":"id",id),"collapsed"],!getProByKey(data,key=="strategy"?"key":"id",id,"collapsed"))});
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

    addGateway=()=>{
        const {actions} = this.props;
        actions.overlayerShow(<AddGatewayPopup className="add-gateway-popup" intl={this.props.intl} title="添加网关"
                onConfirm={(data)=>{
                    console.log(data);
                    actions.overlayerHide();
                }} onCancel={()=>{
                actions.overlayerHide();
            }}/>)
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
                <Table className="strategy" keyField="key" isEdit={true} columns={this.columns} data={strategyData} activeId={selectItem && selectItem.key}
                       rowClick={this.tableClick} rowEdit={this.tableEdit} rowDelete={this.tableDelete} collapseClick={this.collapseClick}/>
            </div>
            <div className={`container-fluid sidebar-info ${sidebarInfo.collapsed ? "sidebar-collapse" : ""}`}>
                <div className="row collapse-container" onClick={()=>this.collapseHandler('collapsed')}>
                    <span className={sidebarInfo.collapsed ? "icon_horizontal"  :"icon_vertical"}></span>
                </div>
                {
                    !selectItem.id || selectItem.plans?
                    <div className="panel panel-default group-info">
                        <div className="panel-heading" onClick={() => { !sidebarInfo.collapsed && this.collapseHandler('propertyCollapsed') }}>
                            <span className={sidebarInfo.collapsed ? "icon_select" :
                                "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>选中组
                        </div>
                        <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'collapsed' : '')}>
                            <div className='form-group'>
                                <label>{this.formatIntl('app.strategy.group.name')}</label>
                                <div className='input-container'>
                                    <input type='text' className='form-control' value={selectItem.name?selectItem.name:''} disabled="disabled"/>
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
                                    <label>{this.formatIntl('app.strategy.level')}</label>
                                    <div className='input-container'>
                                        <select className='form-control' value={selectItem.level} disabled="disabled"></select>
                                    </div>
                                </div>

                                <div className='form-group date-range'>
                                    <label>{this.formatIntl('app.date.range')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.start} disabled="disabled"/>
                                        <span>{this.formatIntl('mediaPublish.to')}</span>
                                        <input type='text' className='form-control' value={selectItem.end} disabled="disabled"/>
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <label>{this.formatIntl('app.strategy.retryNumber')}</label>
                                    <div className='input-container'>
                                        <input type='text' className='form-control' value={selectItem.retryNumber} disabled="disabled"/>
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
                            <button className="btn btn-gray" onClick={() => {this.addGateway()}}>{this.formatIntl('button.add.gateway')}</button>                                   
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