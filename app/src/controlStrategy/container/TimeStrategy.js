/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../../../public/styles/systemOperation-strategy.less';

import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'

import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import TimeStrategyPopup from '../component/TimeStrategyPopup'
import ConfirmPopup from '../../components/ConfirmPopup'

import Immutable from 'immutable';
import {getObjectByKey} from '../../util/index';
import {dateStringFormat} from '../../util/string'
import {getMomentDate, momentDateFormat} from '../../util/time'

import {getAssetModelList} from '../../api/asset'
import {getStrategyListByName, getStrategyCountByName, addStrategy, updateStrategy, delStrategy} from '../../api/strategy'

class TimeStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            model:'time',
            search: Immutable.fromJS({
                placeholder: '输入策略名称',
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
            strategyList:[/*{id:1,time:"15:00", light:"50"},{id:2,time:"16:00", light:"关"}*/],
            data:Immutable.fromJS([
            ])
        }

        this.columns =  [
            {id: 0, field:"name", title:"策略名称"},
            {id: 1, field: "timeRange", title: "时间范围"}
        ];

        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.addHandler = this.addHandler.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.tableEdit = this.tableEdit.bind(this);
        this.tableDelete = this.tableDelete.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.initResult = this.initResult.bind(this);
        this.initStrategyList = this.initStrategyList.bind(this);
        this.initDeviceList = this.initDeviceList.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getAssetModelList(data=>this.mounted && this.initDeviceList(data));
        this.requestSearch();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch() {
        const {model, page, search} = this.state;
        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let name = search.get("value");
        getStrategyListByName(model, name, offset, limit, data=>{this.mounted && this.initResult(data)});
        getStrategyCountByName(model, name, data=>{this.mounted && this.initPageSize(data)})
    }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page:page});
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
                timeRange += "-"+dateStringFormat(exeR[1])
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

    initStrategyList(data){
        this.setState({strategyList:data})
    }

    initDeviceList(data){
        let list = data.map(model=>{
            return {id:model.key, name:model.name};
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
        actions.overlayerShow(<TimeStrategyPopup title="新建策略" data={initData} deviceList={deviceList} strategyList={strategyList}
                                                 onConfirm={(data)=>{
                                                    console.log(data)
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
        console.log(deviceList, row.get("deviceType"));
        let device = getObjectByKey(deviceList.options, 'id', row.get("deviceType"));
        console.log(device);
        let initData = {
            name: row.get("name"),
            device: device
        }

        let strategyList=[];
        row.get("strategy").map(strategy=>{
            strategyList.push({id:row.get("id"), time:strategy.getIn(["condition", "time"]), light:strategy.getIn(["rpc", "brightness"])})
        })

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
            exeRList = exeR(0).split("-");
            startTime = {year:0, month:exeRList[1], date:exeRList[2]};
        }

        if(expR && expR.size==2){
            expRList = expR.get(1).split("-");
            endTime = {year:expRList[0], month:expRList[1], date:expRList[2]};
        }else if(exeR && exeR.size==2){
            exeRList = exeR.get(1).split("-");
            endTime = {year:0, month:exeRList[1], date:exeRList[2]};
        }
        actions.overlayerShow(<TimeStrategyPopup title="修改策略" data={initData} deviceList={deviceList} strategyList={strategyList}
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

        actions.overlayerShow(<ConfirmPopup tips="是否删除选中策略？" iconClass="icon_popup_delete" cancel={()=>{
            actions.overlayerHide();
        }} confirm={()=>{
            delStrategy(rowId, ()=>{
                this.requestSearch();
                actions.overlayerHide();
            })
        }}/>)
    }

    tableClick(){

    }

    pageChange(current, pageSize){
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=> {
            this.requestSearch();
        });
    }

    searchSubmit(){
        this.requestSearch();
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    render(){
        const {search, selectDevice, page, data} = this.state;

        return <Content className="time-strategy">
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button id="sys-add" className="btn btn-primary add-domain" onClick={this.addHandler}>添加</button>
            </div>
            <div className="table-container">
                <Table isEdit={true} columns={this.columns} data={data} activeId={selectDevice && selectDevice.id}
                       rowClick={this.tableClick} rowEdit={this.tableEdit} rowDelete={this.tableDelete}/>
                <Page className={"page "+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                      current={page.get('current')} total={page.get('total')}  onChange={this.pageChange}/>
            </div>
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
)(TimeStrategy);