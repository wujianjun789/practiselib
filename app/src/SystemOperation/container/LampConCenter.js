/**
 * Created by a on 2017/8/1.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../../../public/styles/lampConCenter.less';
import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import WhiteListPopup from '../components/WhiteListPopup';
import CentralizedControllerPopup from '../components/CentralizedControllerPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import Content from '../../components/Content';
import {domainSelectChange, searchSubmit, pageChange} from '../action/lampConCenter';

export class LampConCenter extends Component{
    constructor(props){
        super(props);
        this.state = {
            listMode: true,
            collapse: false,
            search: Immutable.fromJS({
                placeholder: '  输入设备名称',
                value: ''
            }),
            selectDomain: {
                id:"domain",
                latlng:{lng: 121.49971691534425,
                    lat: 31.239658843127756},
                position: [{
                    "device_id": 1,
                    "device_type": 'DEVICE',
                    lng: 121.49971691534425,
                    lat: 31.239658843127756
                }],
                data: [{
                    id: 1,
                    name: '灯集中控制器'
                }]
            },
            data: {
                id: 0,
                name: '设备1',
                model: 'model01',
                domain: 'domain01',
                lng: 121.49971691534425,
                lat: 31.239658843127756
            }
        }

        this.columns = [
            {id: 1, field: "deviceName", title: "设备名称"},
            {id:2, field: "model", title: "型号"},
            {id:3, field: "deviceID", title: "设备编号"},
            {id:4, field: "model", title: "端口号"},
            {id:5, field: "lng", title: "经度"},
            {id:6, field: "lat", title: "纬度"},
        ];

        // this.onToggle = this.onToggle.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.popupCancel = this.popupCancel.bind(this);
        this.popupConfirm = this.popupConfirm.bind(this);

        // this.requestSearch = this.requestSearch.bind(this);
        // this.initPageSize = this.initPageSize.bind(this);
        // this.initDomainList = this.initDomainList.bind(this);
    }
    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
    }

    // requestSearch(){
    //     const {search, page} = this.state
    //     let name = search.get('value');
    //     let cur = page.get('current');
    //     let size = page.get('pageSize');
    //     let offset = (cur-1)*size;
    //     getDomainCountByName(name, data=>{this.mounted && this.initPageSize(data)})
    //     getDomainListByName(name, offset, size, data=>{this.mounted && this.initDomainList(data)})
    // }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page:page});
    }

    initDomainList(data){
        this.setState({data:Immutable.fromJS(data)});
        if(data.length){
            let item1 = data[0]
            let selectDomain = this.state.selectDomain;
            selectDomain.data.id = item1.id;
            selectDomain.data.name = item1.name;
            this.setState({selectDomain:selectDomain});
        }
    }

    popupCancel() {
        this.props.actions.overlayerHide();
    }

    popupConfirm() {
        this.props.actions.overlayerHide();
    }

    domainHandler(e){
        let id = e.target.id;
        const {selectDomain} = this.state
        const {lampConCenter} = this.props;
        const popupInfo = lampConCenter.get('popupInfo').toJS();
        const {domainList, modelList, whiteListData} = popupInfo;
        const {overlayerShow, overlayerHide} = this.props.actions;
        switch(id) {
            case 'sys-add':
                let dataInit = {
                    id: '',
                    name: '',
                    model: '',
                    domain: '',
                    lng: 121.49971691534425,
                    lat: 31.239658843127756
                };
                overlayerShow(<CentralizedControllerPopup popId="add" className="centralized-popup" title="添加设备" data={dataInit} domainList={domainList} modelList={modelList} overlayerHide={overlayerHide}/>);
                break;
            case 'sys-update':
                overlayerShow(<CentralizedControllerPopup popId="edit" className="centralized-popup" title="灯集中控制器" data={this.state.data} domainList={domainList} modelList={modelList} overlayerHide={overlayerHide}/>);
                break;
            case 'sys-delete':
                overlayerShow(<ConfirmPopup tips="是否删除选中设备？" iconClass="icon_popup_delete" cancel={ this.popupCancel } confirm={ this.popupConfirm }/>)
                break;
            case 'sys-whitelist':
                overlayerShow(<WhiteListPopup className="whitelist-popup" data={whiteListData} overlayerHide={overlayerHide}/>)
                break;
        }
    }

    pageChange(current, pageSize) {
        this.props.actions.pageChange(current, pageSize);
    }

    tableClick(row){
        let {selectDomain} = this.state;
        selectDomain.data.id = row.get('id');
        selectDomain.data.name = row.get('name');
        this.setState({selectDomain:selectDomain});
    }

    searchSubmit(){
        this.props.actions.searchSubmit(this.state.search.get('value'));
        this.setState({search:this.state.search.update('value', () => '')});
    }

    searchChange(value){
        this.setState({search:this.state.search.update('value', () => value)});
    }

    // onToggle(node) {
    //     let mode = undefined;

    //     if(node.id == "list-mode"){
    //         mode = true;
    //     }else if(node.id == 'topology-mode'){
    //         mode = false;
    //     }

    //     mode != undefined && this.setState({listMode:mode});
    // }
    
    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }

    domainSelect(e) {
        this.props.actions.domainSelectChange(e.target.value);
    }


    render() {
        const {listMode, collapse, search, selectDomain} = this.state;
        const page = this.props.lampConCenter.get('page');
        const data = this.props.lampConCenter.get('data');
        const domain = this.props.lampConCenter.get('domain').toJS();
        return <Content className={'offset-right '+(collapse?'collapsed':'')}>
                <div className="heading">
                    <Select titleField={domain.titleField} valueField={domain.valueField} options={domain.options} value={domain.value} onChange={this.domainSelect}/>
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                                onChange={this.searchChange} submit={this.searchSubmit}/>
                    <button id="sys-add" className="btn btn-default add-domain" onClick={this.domainHandler}>添加</button>
                </div>
                <div className="list-mode">
                    <div className="table-container">
                        <Table columns={this.columns} data={data} activeId={selectDomain.data.id}
                                rowClick={this.tableClick}/>
                        <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                                current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                    </div>
                </div>
                <SideBarInfo mapDevice={selectDomain} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <span className="icon_sys_select"></span>选中设备
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{selectDomain.data[0].name}</span>
                            <button id="sys-update" className="btn btn-primary pull-right" onClick={this.domainHandler}>编辑</button>
                            <button id="sys-delete" className="btn btn-danger pull-right" onClick={this.domainHandler}>删除</button>
                        </div>
                    </div>
                    <div className="panel panel-default device-statics-info whitelist">
                        <div className="panel-heading">
                            <span className="icon_sys_whitelist"></span>白名单
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name">{`包含：${selectDomain.data.length} 个项目`}</span>
                            <button id="sys-whitelist" className="btn btn-primary pull-right" onClick={this.domainHandler}>编辑</button>
                        </div>
                    </div>
                </SideBarInfo>
            </Content>
    }
}

const mapStateToProps = (state, ownProps) => {
    let {lampConCenter} = state;
    return {
        lampConCenter
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        domainSelectChange,
        searchSubmit,
        pageChange,
        overlayerShow,
        overlayerHide
    }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LampConCenter);