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

class TimeStrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: '输入策略名称',
                value: ''
            }),
            selectStrategy:{

            },
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 14
            }),
            deviceList:{titleKey:"name", valueKey:"name", options:[{id:1, name:"test灯"},{id:2, name:"test显示屏"}]},
            strategyList:[{id:1,time:"15:00", light:"50"},{id:2,time:"16:00", light:"关"}],
            data:Immutable.fromJS([
                {id:1, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日", deviceId:2},
                {id:2, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日", deviceId:1},{id:3, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日", deviceId:2},
                {id:4, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日", deviceId:1},{id:5, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日", deviceId:2},
                {id:6, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日", deviceId:1},{id:7, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日", deviceId:2},
                {id:8, name:"冬季路灯使用策略", timeRange:"10月1日-4月30日", deviceId:1},{id:9, name:"夏季路灯使用策略", timeRange:"5月1日-9月30日", deviceId:2},
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
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    requestSearch() {

    }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page:page});
    }

    initResult(data){
        this.setState({data:Immutable.fromJS(data)});
        if(data && data.length){
            this.setState({selectStrategy:data[0]});
        }
    }

    initStrategyList(data){
        this.setState({strategyList:data})
    }

    initDeviceList(data){
        this.setState({deviceList: Object.assign({}, this.state.deviceList, {options:data})})
    }

    addHandler(){
        const {actions} = this.props;
        const {deviceList, strategyList} = this.state;
        let initData = {
            name:"",
            deviceName:deviceList.options.length?deviceList.options[0][deviceList.valueKey]:""
        }
        actions.overlayerShow(<TimeStrategyPopup title="新建策略" data={initData}
                                                 deviceList={deviceList}
                                                 strategyList={strategyList}
                                                 onConfirm={(data)=>{console.log(data)}} onCancel={()=>{
                                                    actions.overlayerHide();
                                                 }}/>)
    }

    tableEdit(rowId){
        const {actions} = this.props;
        const {deviceList, strategyList} = this.state;
        let row = Immutable.fromJS(getObjectByKey(this.state.data.toJS(), 'id', rowId));
        let device = getObjectByKey(deviceList.options, 'id', row.get("deviceId"));
        let initData = {
            name: row.get("name"),
            deviceName: device?device.name:""
        }
        actions.overlayerShow(<TimeStrategyPopup title="修改策略" data={initData}
                    deviceList={deviceList}
                    strategyList={strategyList}
                    onConfirm={(data)=>{}} onCancel={()=>{
                        actions.overlayerHide();
                    }}/>)
    }

    tableDelete(rowId){
        const {actions} = this.props;
        actions.overlayerShow(<ConfirmPopup tips="是否删除选中策略？" iconClass="icon_popup_delete" cancel={()=>{
            actions.overlayerHide();
        }} confirm={()=>{

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
                <button id="sys-add" className="btn btn-default add-domain" onClick={this.addHandler}>添加</button>
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