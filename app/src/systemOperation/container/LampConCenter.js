/**
 * Created by a on 2017/8/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import WhiteListPopup from '../components/WhiteListPopup';
import CentralizedControllerPopup from '../components/CentralizedControllerPopup';
import ConfirmPopup from '../../components/ConfirmPopup';
import Immutable from 'immutable';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';

import Content from '../../components/Content';

import { TreeData, getModelData, getModelList, getModelTypesById, getModelTypesNameById } from '../../data/systemModel'

import { getDomainList } from '../../api/domain'
import { getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel } from '../../api/asset'

import { getObjectByKey } from '../../util/index'

import { treeViewInit } from '../../common/actions/treeView'
export class LampConCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: "",
            collapse: false,
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 0
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
                data: []
            },
            domainList: {
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: [
                    {
                        id: 1,
                        title: 'domain01',
                        value: 'domain01'
                    },
                    {
                        id: 2,
                        title: 'domain02',
                        value: 'domain02'
                    },
                    {
                        id: 3,
                        title: 'domain03',
                        value: 'domain03'
                    },
                    {
                        id: 4,
                        title: 'domain04',
                        value: 'domain04'
                    },
                    {
                        id: 5,
                        title: 'domain05',
                        value: 'domain05'
                    },
                    {
                        id: 6,
                        title: 'domain06',
                        value: 'domain06'
                    },
                    {
                        id: 7,
                        title: 'domain07',
                        value: 'domain07'
                    }
                ]
            },
            modelList: {
                titleField: 'title',
                valueField: 'value',
                options: [
                    {
                        id: 1,
                        title: 'model01',
                        value: 'model01'
                    },
                    {
                        id: 2,
                        title: 'model02',
                        value: 'model02'
                    },
                    {
                        id: 3,
                        title: 'model03',
                        value: 'model03'
                    },
                    {
                        id: 4,
                        title: 'model04',
                        value: 'model04'
                    },
                    {
                        id: 5,
                        title: 'model05',
                        value: 'model05'
                    },
                    {
                        id: 6,
                        title: 'model06',
                        value: 'model06'
                    },
                    {
                        id: 7,
                        title: 'model07',
                        value: 'model07'
                    }
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
            data: Immutable.fromJS([ /*{
                id: 0,
                name: '设备1',
                model: 'model01',
                domain: 'domain01',
                lng: 121.49971691534425,
                lat: 31.239658843127756
            }*/ ])
        }

        this.columns = [
            {
                id: 0,
                field: "domainName",
                title: "域"
            },
            {
                id: 1,
                field: "name",
                title: "设备名称"
            },
            {
                id: 2,
                field: "typeName",
                title: "型号"
            },
            {
                id: 3,
                field: "id",
                title: "设备编号"
            },
            {
                id: 5,
                field: "lng",
                title: "经度"
            },
            {
                id: 6,
                field: "lat",
                title: "纬度"
            },
        ];

        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        this.domainSelect = this.domainSelect.bind(this);

        this.popupCancel = this.popupCancel.bind(this);
        this.popupConfirm = this.popupConfirm.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.initDomainList = this.initDomainList.bind(this);
        this.initAssetList = this.initAssetList.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        const {route} = this.props;
        let model = route && route.path;
        getModelData(model, () => {
            if (this.mounted) {
                this.props.actions.treeViewInit(TreeData);
                this.setState({
                    model: model,
                    modelList: Object.assign({}, this.state.modelList, {
                        options: getModelTypesById(model).map((type) => {
                            return {
                                id: type.id,
                                title: type.title,
                                value: type.title
                            }
                        })
                    })
                });
                getDomainList(data => {
                    this.mounted && this.initDomainList(data)
                })
            }
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    requestSearch() {
        const {model, domainList, search, page} = this.state
        let domain = domainList.options.length ? domainList.options[domainList.index] : null;
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1) * size;
        getSearchCount(domain ? domain.id : null, model, name, data => {
            this.mounted && this.initPageSize(data)
        })

        getSearchAssets(domain ? domain.id : null, model, name, offset, size, data => {
            this.mounted && this.initAssetList(data)
        })
    }

    initPageSize(data) {
        let page = this.state.page.set('total', data.count);
        this.setState({
            page: page
        });
    }

    initDomainList(data) {
        let domainList = Object.assign({}, this.state.domainList, {
            index: 0
        }, {
            value: data.length ? data[0].name : ""
        }, {
            options: data
        });
        this.setState({
            domainList: domainList
        });
        this.requestSearch();
    }

    initAssetList(data) {
        let list = data.map((asset, index) => {
            let domainName = "";
            if (this.state.domainList.options.length && asset.domainId) {
                let domain = getObjectByKey(this.state.domainList.options, 'id', asset.domainId)
                domainName = domain ? domain.name : "";
            }
            return Object.assign({}, asset, asset.extend, asset.geoPoint, {
                domainName: domainName
            },
                {
                    typeName: getModelTypesNameById(this.state.model, asset.extend.type)
                });
        })

        this.setState({
            data: Immutable.fromJS(list)
        });
        if (list.length) {
            let item = list[0]
            this.updateSelectDevice(item);
        } else {
            this.setState({
                selectDevice: Object.assign({}, this.state.selectDevice, {
                    data: []
                })
            });
        }
    }

    popupCancel() {
        this.props.actions.overlayerHide();
    }

    popupConfirm() {
        const {model, selectDevice} = this.state;
        delAssetsByModel(model, selectDevice.data.length && selectDevice.data[0].id, () => {
            this.requestSearch();
            this.props.actions.overlayerHide();
        })

    }

    domainHandler(e) {
        let id = e.target.id;
        const {model, selectDevice, domainList, modelList, whitelistData} = this.state;
        const {overlayerShow, overlayerHide} = this.props.actions;
        let curType = modelList.options.length ? modelList.options[0] : null;
        switch (id) {
            case 'sys-add':
                const dataInit = {
                    id: '',
                    name: '',
                    model: curType ? curType.title : "",
                    modelId: curType ? curType.id : "",
                    domain: domainList.value,
                    domainId: domainList.options.length ? domainList.options[domainList.index].id : "",
                    lng: "",
                    lat: ""
                };

                overlayerShow(<CentralizedControllerPopup popId="add" className="centralized-popup" title="添加设备" model={ this.state.model } data={ dataInit } domainList={ domainList }
                                modelList={ modelList } overlayerHide={ overlayerHide } onConfirm={ (data) => {
                                                                                                        postAssetsByModel(model, data, () => {
                                                                                                            this.requestSearch();
                                                                                                        });
                                                                                                    } } />);
                break;
            case 'sys-update':
                let latlng = selectDevice.position.length ? selectDevice.position[0] : {
                    lat: "",
                    lng: ""
                }
                let data = selectDevice.data.length ? selectDevice.data[0] : null;
                const dataInit2 = {
                    id: data ? data.id : null,
                    name: data ? data.name : null,
                    model: data ? getModelTypesNameById(model, data.type) : "",
                    modelId: data ? data.type : null,
                    domain: selectDevice.domainName,
                    domainId: selectDevice.domainId,
                    lng: latlng.lng,
                    lat: latlng.lat
                }
                overlayerShow(<CentralizedControllerPopup popId="edit" className="centralized-popup" title="灯集中控制器" data={ dataInit2 } domainList={ domainList } modelList={ modelList }
                                overlayerHide={ overlayerHide } onConfirm={ data => {
                                                                                updateAssetsByModel(model, data, (data) => {
                                                                                    this.requestSearch();
                                                                                    overlayerHide();
                                                                                })
                                                                            } } />);
                break;
            case 'sys-delete':
                overlayerShow(<ConfirmPopup tips="是否删除选中设备？" iconClass="icon_popup_delete" cancel={ this.popupCancel } confirm={ this.popupConfirm } />)
                break;
            case 'sys-whitelist':
                let data2 = selectDevice.data.length?selectDevice.data[0]:null;
                overlayerShow(<WhiteListPopup className="whitelist-popup" id = {data2.id} data={whitelistData} overlayerHide={overlayerHide}/>)
                // overlayerShow(<WhiteListPopup className="whitelist-popup" data={ whitelistData } overlayerHide={ overlayerHide } />)
                break;
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({
            page: page
        }, () => {
            this.requestSearch();
        });
    }

    tableClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    updateSelectDevice(item) {
        let selectDevice = this.state.selectDevice;
        selectDevice.latlng = item.geoPoint;
        selectDevice.data.splice(0);
        selectDevice.data.push({
            id: item.id,
            type: item.extend.type,
            name: item.name
        });
        selectDevice.domainId = item.domainId;
        selectDevice.domainName = item.domainName;
        selectDevice.position.splice(0);
        selectDevice.position.push(Object.assign({}, {
            "device_id": item.id,
            "device_type": 'DEVICE'
        }, item.geoPoint));
        this.setState({
            selectDevice: selectDevice
        });
    }

    searchSubmit() {
        // this.setState({search: this.state.search.update('value', () => '')}, ()=>{
        this.requestSearch();
    // });
    }

    searchChange(value) {
        this.setState({
            search: this.state.search.update('value', () => value)
        });
    }

    collpseHandler() {
        this.setState({
            collapse: !this.state.collapse
        })
    }


    domainSelect(event) {
        // this.props.actions.domainSelectChange(index);
        let index = event.target.selectedIndex;
        let {domainList} = this.state;
        domainList.index = index;
        domainList.value = domainList.options[index].name;
        this.setState({
            domainList: domainList
        }, () => {
            this.requestSearch();
        })
    }

    render() {
        const {model, collapse, page, search, selectDevice, domainList, data} = this.state;
        return <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
                 <div className="heading">
                   <Select id="domain" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }
                   />
                   <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } onChange={ this.searchChange } submit={ this.searchSubmit } />
                   <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
                 </div>
                 <div className='lcc'>
                   <div className="table-container">
                     <Table columns={ this.columns } data={ data } activeId={ selectDevice.data.length && selectDevice.data[0].id } rowClick={ this.tableClick } />
                     <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }
                     />
                   </div>
                 </div>
                 <SideBarInfo mapDevice={ selectDevice } collpseHandler={ this.collpseHandler }>
                   <div className="panel panel-default device-statics-info">
                     <div className="panel-heading">
                       <span className="icon_sys_select"></span>选中设备
                     </div>
                     <div className="panel-body domain-property">
                       <span className="domain-name">{ selectDevice.data.length ? selectDevice.data[0].name : '' }</span>
                       <button id="sys-update" className="btn btn-primary pull-right" onClick={ this.domainHandler } disabled={ data.size == 0 ? true : false }>编辑
                       </button>
                       <button id="sys-delete" className="btn btn-danger pull-right" onClick={ this.domainHandler } disabled={ data.size == 0 ? true : false }>删除
                       </button>
                     </div>
                   </div>
                   <div className="panel panel-default device-statics-info whitelist">
                     <div className="panel-heading">
                       <span className="icon_sys_whitelist"></span>白名单
                     </div>
                     <div className="panel-body domain-property">
                       <span className="domain-name">{ `包含：${selectDevice.data.length} 个项目` }</span>
                       <button id="sys-whitelist" className="btn btn-primary pull-right" onClick={ this.domainHandler } disabled={ data.size == 0 ? true : false }>
                         编辑
                       </button>
                     </div>
                   </div>
                 </SideBarInfo>
               </Content>
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
        treeViewInit,
        overlayerShow,
        overlayerHide
    }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(LampConCenter);