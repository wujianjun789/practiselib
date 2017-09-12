/** Created By ChrisWen
 *  17/09/04
 *  systemOperation/systemConfig/smartLightComponent;
 *  Declaring：We use smartLight as 智慧路灯,sysConfig as 系统配置模块,which is shortted from systemConfig;
 *  All componets were named follow the HumpRules,even if they were combinend;
 *  We detaching almost dataModel or functionModel to provide reUsing.
 */

//import BaseFunction/Component
import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import styleSheet and other common-componets
import '../../../public/styles/systemOperation-sysConfig.less';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import ConfirmPopup from '../../components/ConfirmPopup';
import Content from '../../components/Content.js';

//import functions
import { getDomainList } from '../../api/domain.js';
//import { DomainList } from '../model/sysDataHandle.js';
import { TreeData, getModelData, getModelNameById, getModelTypesById, getModelTypesNameById } from '../../data/systemModel';
import { getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel, getAssetsByModel, getAssetsBaseByModel } from '../../api/asset';
import { getPoleAssetById } from '../../api/pole.js';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer.js';
import { treeViewInit } from '../../common/actions/treeView';
import { getObjectByKey } from '../../util/index';
//import netRequestAPI
import { getPoleList } from '../../api/pole.js';

//import childrenComponentsModel
import SiderBarComponet from '../components/SideBarComponents.js';
import EditPopup from '../components/EditPopup.js';

//import initDataModel
import { sysDataHandle } from '../model/sysDataHandle.js';
import { sysInitStateModel } from '../model/sysInitStateModel.js';

export class sysConfigSmartLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            isEdit: false,
            collapse: false,
            //编辑 按钮的 Disabled 状态
            disabled: false,
            // page -> 分页器属性
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 0
            }),
            //search -> 搜索框属性
            search: Immutable.fromJS({
                placeholder: '输入设备名称',
                value: ''
            }),
            selectDevice: {
                id: "systemOperation",
                position: [],
                data: [],
                whiteCount: 0
            },
            //data -> EditPopup的数据
            data: [],
            tableData: Immutable.fromJS([]),
            //domainList -> 域名列表
            domainList: sysInitStateModel('domainList'),
            //modelList -> 模型列表
            modelList: sysInitStateModel('modelList'),
            //whiteListData -> 白名单列表
            //whiteListData: {},
            //EditPopup - Select -> 数据源
            equipmentSelectList: sysInitStateModel(),
            //sysDataHandle.equipmentSelectList,
            selectValue: sysDataHandle.equipmentSelectList,
            allEquipmentsData: []
        }
        //Table 数据相关
        this.columns = sysDataHandle.smartLight;

        //bind functions
        this.initDomainList = this.initDomainList.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.onConfirmed = this.onConfirmed.bind(this);
        this.onDeleted = this.onDeleted.bind(this);
        this.closeClick = this.closeClick.bind(this);
        this.equipmentSelect = this.equipmentSelect.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.editButtonClick = this.editButtonClick.bind(this);
    }


    //Hook functions
    componentWillMount() {
        this.mounted = true;
        let model = 'pole';
        getModelData(model, () => {
            this.props.actions.treeViewInit(TreeData);
            this.setState({
                model: model,
                modelList: {
                    ...this.state.modelList,
                    ...{
                        options: getModelTypesById(model).map(type => {
                            return {
                                ...type,
                                value: type.title
                            }
                        })
                    }
                }
            })
        });
        getDomainList(data => {
            this.mounted && this.initDomainList(data);
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /* Declare functions
    * Init functions --- all componets init functions are here.
    * when componenetWillMount,we call this function to provide DomainList to be choosen.
    */
    initDomainList(data) {
        let newObject = sysDataHandle.init(data);
        let domainList = {
            ...this.state.domainList,
            ...newObject
        };
        this.setState({
            domainList: domainList
        }, () => this.requestSearch());
    }

    initAssetList(data) {
        let list = data.map((asset, index) => {
            let domainName = '';
            // Data is a array.Each object(asset) has a property --- domainId.Use domain Id to find domainName.
            // First, need to judge the domainList has already exeists;
            if (this.state.domainList.options.length && asset.domainId) {
                let domain = getObjectByKey(this.state.domainList.options, 'id', asset.domainId);
                domainName = domain ? domain.name : "";
            }
            //return a new object that contains all properties that we need;
            return {
                ...asset,
                ...asset,
                ...asset.extend,
                ...asset.geoPoint,
                ...{
                    domainName: domainName
                },
                ...{
                    typeName: getModelTypesNameById(this.state.model, asset.extend.type)
                }
            }
        });
        this.setState({
            tableData: Immutable.fromJS(list)
        }, () => this.initSelectDevice(data));
    }

    initSelectDevice(data) {
        // console.log('initSelectDevice', data);
        if (data.length) {
            let item = data[0];
            this.updateSelectDevice(item);
        } else {
            let newDevice = {
                ...this.state.selectDevice,
                ...{
                    data: []
                }
            };
            this.setState({
                selectDevice: newDevice
            });
        }
    }

    initPageSize(data) {
        let page = this.state.page.set('total', data.count);
        this.setState({
            page: page
        });
    }

    //SearchText Functions
    //Base search function.In this function,we will call initFunctions to provide AssetData or other functions.
    //When this function is called,almost datas will be updated or init again.
    requestSearch() {
        console.log('成功调用requestSearch!');
        const {model, domainList, search, page} = this.state;
        let domain = domainList.options.length ? domainList.options[domainList.index] : null;
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1) * size;
        getSearchCount(domain ? domain.id : null, model, name, data => {
            this.mounted && this.initPageSize(data)
        })
        getSearchAssets(domain ? domain.id : null, model, name, offset, size, data => {
            this.initAssetList(data);
        })
    }

    searchChange(value) {
        this.setState({
            search: this.state.search.update('value', () => value)
        });
    }
    searchSubmit() {
        let page = this.state.page.set('current', 1);
        this.setState({
            page: page
        }, () => {
            this.requestSearch();
        });
    }

    //Select functions --- all componets slectfunctions are here.
    //Basic selectFunction with no ImmutableData.
    mainSelect(event, dataList) {
        let newObject = sysDataHandle.select(event, dataList);
        let newDataList = {
            ...dataList,
            ...newObject
        };
        return newDataList;
    }

    //This is the DomainSelect function,bind in <Select/>
    domainSelect(event) {
        let {domainList} = this.state;
        let newDataList = this.mainSelect(event, domainList);
        console.log('newDataList', newDataList);
        this.setState({
            domainList: newDataList
        }, () => this.requestSearch())
    }

    equipmentSelect(event) {
        let {equipmentSelectList} = this.state;
        let newDataList = this.mainSelect(event, equipmentSelectList);
        this.searchAssetsByModel(newDataList);
        this.setState({
            equipmentSelectList: newDataList
        }, () => {
            this.showPopup();
            this.requestSearch();
        })
    }

    //When Page componet is changed,we call this function to provide data in other Pages.
    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({
            page: page
        }, () => {
            this.requestSearch();
        });
    }

    //This function can update the data that you choose.The data is setted in state,can be read in some Componets here.
    //Base function.
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
        selectDevice.position.splice(0);
        selectDevice.position.push({
            ...{
                "device_id": item.id,
                "device_type": 'DEVICE'
            },
            ...item.geoPoint
        });
        this.setState({
            selectDevice: selectDevice
        });
    }

    initEditPopup(id, response) {
        let asset = response;
        let {equipmentSelectList} = this.state;

        /*  Redirect equipmentSelectList's initData.For some reason,there still exeits some logic mistake.
         *  options: options are displayed in <Select /> componets in EditPopup,such as ['灯','显示屏','传感器']
         *  value: value is the model that we need to search all the same assets
         */
        equipmentSelectList.options = sysDataHandle.equipmentSelectList.options;
        equipmentSelectList.value = equipmentSelectList.value.length === 0 ? equipmentSelectList.options[0].value : equipmentSelectList.value;
        this.searchAssetsByModel(equipmentSelectList);
        this.setState({
            data: asset
        }, () => {
            this.showPopup();
        });
    }

    searchAssetsByModel(equipmentSelectList) {
        let {index, options} = equipmentSelectList;
        let assetModel = options[index].title;
        getAssetsBaseByModel(assetModel, data => {
            console.log('AssetsModel', data);
            this.setState({
                allEquipmentsData: data
            }, () => this.showPopup())
        })
        console.log('assetModel', assetModel);
    }

    //Declaring the Table Component Function
    rowClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    //EditPopup functions
    //Basic functions.Controning the EditPopup whether showing or hidden. 
    editButtonClick() {
        const {selectDevice} = this.state;
        const id = selectDevice.data[0].id;
        getPoleAssetById(id, (id, response) => {
            this.initEditPopup(id, response);
        });
    }

    showPopup() {
        const {selectDevice, allEquipmentsData} = this.state;
        const {overlayerShow} = this.props.actions;
        this.requestSearch();
        overlayerShow(<EditPopup title='新建/修改智慧路灯' onConfirmed={ this.onConfirmed } onDeleted={ this.onDeleted } closeClick={ this.closeClick } onChange={ this.equipmentSelect } data={ this.state.data }
                        equipmentSelectList={ this.state.equipmentSelectList } selectValue={ this.state.selectValue } allEquipmentsData={ allEquipmentsData } />);
    }

    //Bind on EditPopup - Confirm_Button.
    onConfirmed() {
        this.closeClick();
    }
    //This is the basic closePopup function.Each function will call closeClick if they need close the popup.
    closeClick() {
        this.props.actions.overlayerHide();
    }
    onDeleted() {
        alert('DELETE!');
    }

    //Animating functions --- controling the SideBar whether showing or hidden with its styles;
    collpseHandler() {
        this.setState({
            collapse: !this.state.collapse
        })
    }


    render() {
        const {collapse, search, data, page, domainList, modelList, selectDevice} = this.state;
        let initSelectDeviceName = selectDevice.data.length ? selectDevice.data[0].name : '';
        let activeId = selectDevice.data.length && selectDevice.data[0].id;
        return (
            <div id='sysConfigSmartLight'>
              <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
                <header>
                  <Select id="domain" {...domainList} onChange={ this.domainSelect } />
                  <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } onChange={ this.searchChange } submit={ this.searchSubmit } />
                </header>
                <div className="table-container">
                  <Table className="dataTable" columns={ this.columns } data={ this.state.tableData } rowClick={ this.rowClick } activeId={ activeId } />
                  <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }
                  />
                </div>
                <SideBarInfo collpseHandler={ this.collpseHandler }>
                  <SiderBarComponet onClick={ this.editButtonClick } disabled={ initSelectDeviceName ? false : true } name={ initSelectDeviceName } />
                </SideBarInfo>
              </Content>
            </div>
        )
    }
}

const mapStateToProps = () => {
    return {}
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        treeViewInit,
        overlayerShow,
        overlayerHide
    }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(sysConfigSmartLight);