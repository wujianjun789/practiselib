/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import Content from '../../components/Content'
import SearchText from '../../components/SearchText'
import Table from '../../components/Table'
import Page from '../../components/Page'
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer'
import Immutable from 'immutable';
import ConfirmPopup from '../../components/ConfirmPopup'
import LatlngStrategyPopup from '../component/LatlngStrategyPopup';
import {getObjectByKey} from '../../util/algorithm'
import {getAssetModelList} from '../../api/asset'
import {getStrategyListByName,getStrategyCountByName,updateStrategy,addStrategy,delStrategy} from '../../api/strategy'

export class Latlngtrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: '输入策略名称',
                value: ''
            }),
            page: {
                pageSize: 10,
                current: 1,
                total: 1
            },
            datas:Immutable.fromJS([
                {id:1, name:"经纬度使用策略", lng:"000.000.000.000",lat:"000.000.000.000"},
                {id:2, name:"经纬度使用策略", lng:"000.000.000.000",lat:"000.000.000.000"},
            ]),
            deviceList:{titleField:"title", valueField:"value", options:[]},            
            popupInfo:{
                
            }
        }

        this.columns =  [
            {id: 0, field:"name", title:"策略名称"},
            {id: 1, field: "lng", title: "经度"},
            {id: 2, field: "lat", title: "纬度"}
        ];
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.requestData = this.requestData.bind(this);
        this.dataHandle = this.dataHandle.bind(this);
        this.onClick = this.onClick.bind(this);
        this.rowEdit = this.rowEdit.bind(this);
        this.rowDelete = this.rowDelete.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.confirmClick = this.confirmClick.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        this.requestData();        
        getAssetModelList(res=>this.mounted && this.initDeviceList(res));
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    initDeviceList(data){
        let list = data.map(model=>{
            return {value:model.key, title:model.name};
        })

        this.setState({deviceList: Object.assign({}, this.state.deviceList, {options:list})})
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        let search = this.state.search.get('value');
        this.requestData(search);
    }

    requestData(username){
        const {search, page} = this.state;
        let cur = page.current;
        let size = page.pageSize;
        let offset = (cur-1)*size;
        getStrategyListByName('latlng',username,offset,size,(response)=>{this.mounted && this.dataHandle(response)});
        getStrategyCountByName('latlng', username, data=>{this.mounted && this.initPageSize(data)})
    }

    initPageSize(data){
        this.setState({page:Object.assign({},this.state.page,{total:data.count})});
    }

    dataHandle(datas){
        this.setState({datas:Immutable.fromJS(datas)})
    }

    onClick(){
        this.props.action.overlayerShow(<LatlngStrategyPopup className='latlng-strategy-popup' title="新建策略" deviceList={this.state.deviceList} onConfirm={this.confirmClick}/>);
    }

    rowEdit(id){
        let popupInfo = getObjectByKey(this.state.datas,'id',id);
        this.props.action.overlayerShow(<LatlngStrategyPopup className='latlng-strategy-popup' title="修改策略" isEdit data={popupInfo.toJS()} deviceList={this.state.deviceList} onConfirm={this.confirmClick}/>);
    }

    rowDelete(id){
        this.props.action.overlayerShow(<ConfirmPopup tips="是否删除选中策略？" iconClass="icon_popup_delete" cancel={()=>{this.props.action.overlayerHide()}} confirm={()=>{
            this.props.action.overlayerHide()
            let page = Object.assign(this.state.page,{current:1});
            this.setState({page:page},delStrategy(id,this.requestData))
        }}/>);
    }

    pageChange(current){
        this.setState({page: Object.assign({}, this.state.page, {current: current})}, this.requestData);
        
    }

    confirmClick(datas,isEdit){
        if(isEdit){
            updateStrategy(datas,()=>this.requestData());
        }
        else{
            this.setState({page:Object.assign({}, this.state.page, {current: 1})},addStrategy(datas,()=>this.requestData()))
        }
    }

    render(){
        const {search, page, datas} = this.state;
        
        return <Content className="latlng-strategy">
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
                <button className="btn btn-primary" onClick={this.onClick}>添加</button>
            </div>
            <div className="table-container">
                <Table isEdit={true} columns={this.columns} data={datas} rowDelete={this.rowDelete} rowEdit={this.rowEdit}/>
                <Page className={"page "+(page.total==0?"hidden":'')} showSizeChanger pageSize={page.pageSize}
                        current={page.current} total={page.total}  onChange={this.pageChange}/>
            </div>
        </Content>
    }
}

const mapStateToprops = (state, ownProps) => {
    return{
    }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
    return {
        action: bindActionCreators({
            overlayerShow:overlayerShow,
            overlayerHide:overlayerHide,
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(Latlngtrategy) 