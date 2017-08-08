/**
 * Created by a on 2017/8/1.
 */
import React, {Component} from 'react';
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

import {getModelData, firstChild, getModelList, getModelNameById} from '../../data/systemModel'

import {getDomainList} from '../../api/domain'
import {getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel} from '../../api/asset'

import {getObjectByKey} from '../../util/index'
export class LampConCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: "",
            collapse: false,
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 21
            }),
            search: Immutable.fromJS({
                placeholder: '输入设备名称',
                value: ''
            }),
            selectDevice: {
                id: "systemOperation",
                // latlng:{lng: 121.49971691534425,
                //     lat: 31.239658843127756},
                position: [],
                data: [{
                    id: 1,
                    name: '灯集中控制器'
                }]
            },
            domainList: {
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: [
                    {id: 1, title: 'domain01', value: 'domain01'},
                    {id: 2, title: 'domain02', value: 'domain02'},
                    {id: 3, title: 'domain03', value: 'domain03'},
                    {id: 4, title: 'domain04', value: 'domain04'},
                    {id: 5, title: 'domain05', value: 'domain05'},
                    {id: 6, title: 'domain06', value: 'domain06'},
                    {id: 7, title: 'domain07', value: 'domain07'}
                ]
            },
            modelList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {id: 1, title: 'model01', value: 'model01'},
                    {id: 2, title: 'model02', value: 'model02'},
                    {id: 3, title: 'model03', value: 'model03'},
                    {id: 4, title: 'model04', value: 'model04'},
                    {id: 5, title: 'model05', value: 'model05'},
                    {id: 6, title: 'model06', value: 'model06'},
                    {id: 7, title: 'model07', value: 'model07'}
                ]
            },
            whitelistData: [
                {
                    id: 1,
                    name: '灯集中控制器',
                    number: '00158D0000CABAD5',
                    model: 8080,
                    lng: '000.000.000.000',
                    lat: '000.000.000.000'
                },
                {
                    id: 2,
                    name: '灯集中控制器',
                    number: '00158D0000CABAD5',
                    model: 8080,
                    lng: '000.000.000.000',
                    lat: '000.000.000.000'
                }
            ],
            data: Immutable.fromJS([/*{
                id: 0,
                name: '设备1',
                model: 'model01',
                domain: 'domain01',
                lng: 121.49971691534425,
                lat: 31.239658843127756
            }*/])
        }

        this.columns = {
            "lc": [
                {id: 0, field:"domainName", title:"域"},
                {id: 1, field: "name", title: "设备名称"},
                {id: 2, field: "typeName", title: "型号"},
                {id: 3, field: "id", title: "设备编号"},
                {id: 5, field: "lng", title: "经度"},
                {id: 6, field: "lat", title: "纬度"},
            ],
            "lcc": [
                {id: 0, field:"domainName", title:"域"},
                {id: 1, field: "name", title: "设备名称"},
                {id: 2, field: "typeName", title: "型号"},
                {id: 3, field: "id", title: "设备编号"},
                {id: 5, field: "lng", title: "经度"},
                {id: 6, field: "lat", title: "纬度"},
            ]
        };

        this.onToggle = this.onToggle.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        this.domainSelect = this.domainSelect.bind(this);

        this.renderDeviceTable = this.renderDeviceTable.bind(this);

        this.popupCancel = this.popupCancel.bind(this);
        this.popupConfirm = this.popupConfirm.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.initDomainList = this.initDomainList.bind(this);
        this.initAssetList = this.initAssetList.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        getModelData(()=> {
            if (this.mounted) {
                this.setState({
                    model: firstChild.id,
                    modelList: Object.assign({}, this.state.modelList, {options: getModelList()})
                });
                getDomainList(data=> {
                    this.mounted && this.initDomainList(data)
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const {sidebarNode} = nextProps;
        if (sidebarNode) {
            this.onToggle(sidebarNode);
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    requestSearch() {
        const {model, domainList, search, page} = this.state
        let domain = domainList.options[domainList.index];
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1) * size;
        getSearchCount(domain.id, model, name, data=> {
            this.mounted && this.initPageSize(data)
        })
        getSearchAssets(domain.id, model, name, offset, size, data=> {
            this.mounted && this.initAssetList(data)
        })
    }

    initPageSize(data) {
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    initDomainList(data) {
        let domainList = Object.assign({}, this.state.domainList, {index: 0}, {value: data.length ? data[0].name : ""}, {options: data});
        this.setState({domainList: domainList});
        this.requestSearch();
    }

    initAssetList(data) {
        let list = data.map((asset, index)=> {
            return Object.assign({}, asset, asset.extend, asset.geoPoint, {domainName: getObjectByKey(this.state.domainList.options, 'id', asset.domainId).name},
                {typeName:getModelNameById(asset.extendType)});
        })

        this.setState({data: Immutable.fromJS(list)});
        if (data.length) {
            let item = data[0]
            this.updateSelectDevice(item);
        }
    }

    popupCancel() {
        this.props.actions.overlayerHide();
    }

    popupConfirm() {
        const {model, selectDevice} = this.state;
        delAssetsByModel(model, selectDevice.data.id, ()=>{
            this.requestSearch();
            this.props.actions.overlayerHide();
        })

    }

    domainHandler(e) {
        let id = e.target.id;
        const {model, selectDevice, domainList, modelList, whitelistData} = this.state
        const {overlayerShow, overlayerHide} = this.props.actions;
        switch (id) {
            case 'sys-add':
                const dataInit = {
                    id: '',
                    name: '',
                    model: getModelNameById(model),
                    modelId: model,
                    domain: domainList.value,
                    domainId: domainList.options[domainList.index].id,
                    lng: "",
                    lat: ""
                };

                overlayerShow(<CentralizedControllerPopup popId="add" className="centralized-popup" title="添加设备"
                                                          data={dataInit} domainList={domainList} modelList={modelList}
                                                          overlayerHide={overlayerHide} onConfirm={(data)=>{
                                                                postAssetsByModel(data.modelId, data, ()=>{
                                                                    this.requestSearch();
                                                                });
                                                          }}/>);
                break;
            case 'sys-update':
                let latlng = selectDevice.position.length?selectDevice.position[0]:{lat:"",lng:""}
                const dataInit2 = {
                    id: selectDevice.data.id,
                    name: selectDevice.data.name,
                    model: getModelNameById(model),
                    modelId: model,
                    domain: selectDevice.domainName,
                    domainId: selectDevice.domainId,
                    lng: latlng.lng,
                    lat: latlng.lat
                }
                overlayerShow(<CentralizedControllerPopup popId="edit" className="centralized-popup" title="灯集中控制器"
                                                          data={dataInit2} domainList={domainList} modelList={modelList}
                                                          overlayerHide={overlayerHide} onConfirm={data=>{
                                                                updateAssetsByModel(data.modelId, data, (data)=>{
                                                                    this.requestSearch();
                                                                    overlayerHide();
                                                                })
                                                          }}/>);
                break;
            case 'sys-delete':
                overlayerShow(<ConfirmPopup tips="是否删除选中设备？" iconClass="icon_popup_delete" cancel={ this.popupCancel }
                                            confirm={ this.popupConfirm }/>)
                break;
            case 'sys-whitelist':
                overlayerShow(<WhiteListPopup className="whitelist-popup" data={whitelistData} overlayerHide={overlayerHide}/>)
                break;
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=> {
            this.requestSearch();
        });
    }

    tableClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    updateSelectDevice(item) {
        let selectDevice = this.state.selectDevice;
        selectDevice.latlng = item.geoPoint;
        selectDevice.data.id = item.id;
        selectDevice.domainId = item.domainId;
        selectDevice.data.name = item.name;
        selectDevice.position.push(Object.assign({}, {"device_id": item.id, "device_type": 'DEVICE'}, item.geoPoint));
        this.setState({selectDevice: selectDevice});
    }

    searchSubmit() {
        this.props.actions.searchSubmit(this.state.search.get('value'));
        this.setState({search: this.state.search.update('value', () => '')});
        this.requestSearch();
    }

    searchChange(value) {
        this.setState({search: this.state.search.update('value', () => value)});
    }

    onToggle(node) {

        node != undefined && this.setState({model: node.id}, ()=>{
            this.requestSearch();
        });
    }

    collpseHandler() {
        this.setState({collapse: !this.state.collapse})
    }


    domainSelect(event) {
        // this.props.actions.domainSelectChange(index);
        let index = event.target.selectedIndex;
        let {domainList} = this.state;
        domainList.index = index;
        domainList.value = domainList.options[index].name;
        this.setState({domainList: domainList})
    }

    renderDeviceTable(model, data, selectDevice) {
        switch (model) {
            case "lc":
            case "lcc":
                return <Table columns={this.columns[model]} data={data} activeId={selectDevice.data.id}
                              rowClick={this.tableClick}/>
        }

    }

    render() {
        const {model, collapse, page, search, selectDevice, domainList, data} = this.state;
        return <Content className={'offset-right '+(collapse?'collapsed':'')}>
            <div className="heading">
                <Select titleField={domainList.valueField} valueField={domainList.valueField}
                        options={domainList.options} value={domainList.value} onChange={this.domainSelect}/>
                <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                            onChange={this.searchChange} submit={this.searchSubmit}/>
                <button id="sys-add" className="btn btn-default add-domain" onClick={this.domainHandler}>添加</button>
            </div>
            <div className={model}>
                <div className="table-container">
                    {
                        this.renderDeviceTable(model, data, selectDevice)
                    }
                    <Page className="page" showSizeChanger pageSize={page.get('pageSize')}
                          current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                </div>
            </div>
            <SideBarInfo mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                <div className="panel panel-default device-statics-info">
                    <div className="panel-heading">
                        <span className="icon_sys_select"></span>选中设备
                    </div>
                    <div className="panel-body domain-property">
                        <span className="domain-name">{selectDevice.data[0].name}</span>
                        <button id="sys-update" className="btn btn-primary pull-right" onClick={this.domainHandler}>编辑
                        </button>
                        <button id="sys-delete" className="btn btn-danger pull-right" onClick={this.domainHandler}>删除
                        </button>
                    </div>
                </div>
                <div className="panel panel-default device-statics-info whitelist">
                    <div className="panel-heading">
                        <span className="icon_sys_whitelist"></span>白名单
                    </div>
                    <div className="panel-body domain-property">
                        <span className="domain-name">{`包含：${selectDevice.data.length} 个项目`}</span>
                        <button id="sys-whitelist" className="btn btn-primary pull-right" onClick={this.domainHandler}>
                            编辑
                        </button>
                    </div>
                </div>
            </SideBarInfo>
        </Content>
    }
}

const mapStateToProps = (state, ownProps) => {
    let {lampConCenter} = state;
    return {
        sidebarNode: state.sysOperation.get('sidebarNode')
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