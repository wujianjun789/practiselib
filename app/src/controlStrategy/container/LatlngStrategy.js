/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';

import {injectIntl} from 'react-intl';

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
import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup'

export class Latlngtrategy extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: Immutable.fromJS({
                placeholder: this.formatIntl('app.input.strategy.name'),
                value: ''
            }),
            page: {
                pageSize: 10,
                current: 1,
                total: 0
            },
            datas:Immutable.fromJS([]),
            deviceList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 'screen', title: this.formatIntl('app.screen')},
                    {value: 'lc', title: this.formatIntl('app.lamp')}
                ]
            },
            orderList:{
                titleField: 'title',
                valueField: 'value',
                options: [
                    {value: 0, title: this.formatIntl('app.close')},
                    {value: 50, title: this.formatIntl('app.brightness')+'50'},
                    {value: 100, title: this.formatIntl('app.brightness')+'100'}
                ]
            },          
            popupInfo:{
                
            }
        }

        this.columns =  [
            {id: 0, field:"name", title:this.formatIntl('app.strategy.name')},
            {id: 1, field: "lng", title: this.formatIntl('map.lng')},
            {id: 2, field: "lat", title: this.formatIntl('map.lat')}
        ];

        this.formatIntl = this.formatIntl.bind(this);

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
        // getAssetModelList(res=>this.mounted && this.initDeviceList(res));
    }

    componentWillUnmount(){
        this.mounted = false;
        this.props.actions.removeAllNotify();        
    }

    formatIntl(formatId){
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    // initDeviceList(data){
    //     let list = data.map(model=>{
    //         return {value:model.key, title:model.name};
    //     })

    //     this.setState({deviceList: Object.assign({}, this.state.deviceList, {options:list})})
    // }

    searchChange(value){
        this.setState({search:this.state.search.update('value', v=>value)});
    }

    searchSubmit(){
        let search = this.state.search.get('value');
        this.requestData(search);
    }

    requestData(username){
        const {search, page} = this.state;
        if(username){
            page.current = 1;
            this.setState({page:page})
        }
        let cur = page.current;
        let size = page.pageSize;
        let offset = (cur-1)*size;
        getStrategyListByName('latlng',search.get('value'),offset,size,(response)=>{this.mounted && this.dataHandle(response)});
        getStrategyCountByName('latlng', search.get('value'), data=>{this.mounted && this.initPageSize(data)})
    }

    initPageSize(data){
        this.setState({page:Object.assign({},this.state.page,{total:data.count})});
    }

    dataHandle(datas){
        this.setState({datas:Immutable.fromJS(datas)})
    }

    onClick(){
        this.props.actions.overlayerShow(<LatlngStrategyPopup intl={this.props.intl} className='latlng-strategy-popup' title={this.formatIntl('app.add.strategy')} deviceList={this.state.deviceList} orderList={this.state.orderList}
        onConfirm={this.confirmClick} onCancel={()=>{this.props.actions.overlayerHide();this.props.actions.removeAllNotify()}}/>);
    }

    rowEdit(id){
        let popupInfo = getObjectByKey(this.state.datas,'id',id);
        this.props.actions.overlayerShow(<LatlngStrategyPopup intl={this.props.intl} className='latlng-strategy-popup' title={this.formatIntl('app.edit.strategy')} isEdit data={popupInfo.toJS()} deviceList={this.state.deviceList} orderList={this.state.orderList}
        onConfirm={this.confirmClick} onCancel={()=>{this.props.actions.overlayerHide();this.props.actions.removeAllNotify()}}/>);
    }

    rowDelete(id){
        this.props.actions.overlayerShow(<ConfirmPopup tips={this.formatIntl('delete.strategy')} iconClass="icon_popup_delete" cancel={()=>{this.props.actions.overlayerHide()}} confirm={()=>{
            this.props.actions.overlayerHide()
            let page = Object.assign(this.state.page,{current:1});
            this.setState({page:page},delStrategy(id,this.requestData))
        }}/>);
    }

    pageChange(current){
        this.setState({page: Object.assign({}, this.state.page, {current: current})}, this.requestData);
        
    }

    confirmClick(datas,isEdit){
        if(isEdit){
            updateStrategy(datas,()=>{
                this.props.actions.addNotify(1, this.formatIntl('sysOperation.domain.edit.success'));
                this.requestData();
            })
        }
        else{
            this.setState({page:Object.assign({}, this.state.page, {current: 1})},addStrategy(datas,()=>{
                this.props.actions.addNotify(1, this.formatIntl('sysOperation.domain.add.success'));
                this.requestData();
            }))
        }
        // this.props.actions.overlayerHide();        
    }

    render(){
        const {search, page, datas} = this.state;
        
        return <Content className="latlng-strategy">
            <div className="heading">
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')} onChange={this.searchChange} submit={this.searchSubmit}/>
                <button className="btn btn-primary" onClick={this.onClick}>{this.formatIntl('button.add')}</button>
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
        actions: bindActionCreators({
            overlayerShow:overlayerShow,
            overlayerHide:overlayerHide,
            addNotify: addNotify,
            removeAllNotify: removeAllNotify
        }, dispatch)
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(injectIntl(Latlngtrategy))