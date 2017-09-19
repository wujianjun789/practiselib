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
import { intersection } from '../model/sysAlgorithm.js';
import { addNotify } from '../../common/actions/notifyPopup';
//import netRequestAPI
import { getPoleList, requestPoleAssetById, getPoleAssetsListByPoleId } from '../../api/pole.js';

//import childrenComponentsModel
import SiderBarComponet from '../components/SideBarComponents.js';
import EditPopup from '../components/EditPopup.js';

//import initDataModel
import { sysDataHandle } from '../model/sysDataHandle.js';
import { sysInitStateModel } from '../model/sysInitStateModel.js';

//import algorithmModel
const promiseQueue = require('../model/algorithmModel/promiseQueue.js');

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
            //This state save all equipments --- whether they were added in pole or not.
            allEquipmentsData: [],
            //This state save all equipments that added into pole.
            allPoleEquipmentsData: []
        }
        //Table 数据相关
        this.columns = sysDataHandle.smartLight;

        //bind functions
        this.initDomainList = this.initDomainList.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.onConfirmed = this.onConfirmed.bind(this);
        this.closeClick = this.closeClick.bind(this);
        this.equipmentSelect = this.equipmentSelect.bind(this);
        this.rowClick = this.rowClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.editButtonClick = this.editButtonClick.bind(this);
        this.showMessage = this.showMessage.bind(this);
    }


    //Hook functions
    componentWillMount() {
        this.mounted = true;
        let model = 'pole';
        //getModelData(model, data => console.log('DATA', data))
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
        let list = data.filter(item => item.extendType === 'pole').map((asset, index) => {
            let domainName = '';
            // Data is a array.Each object(asset) has a property --- domainId.Use domain Id to find domainName.
            // First, need to judge the domainList has already exeists;
            if (this.state.domainList.options.length && asset.domainId) {
                let domain = getObjectByKey(this.state.domainList.options, 'id', asset.domainId);
                domainName = domain ? domain.name : "";
            }
            /* By each pole's ID,request this pole's all asset model.Counting eatch asset than setState.
             *  There is one thing should be regonized --- this callback function is asynchronousFunction.
             *  The countObjects will be setted after list has been setted in final.
             */
            getPoleAssetsListByPoleId(asset.id, data => {
                let lcCount = 0,
                    screenCount = 0,
                    sensorCount = 0,
                    cameraCount = 0,
                    chargePoleCount = 0;
                data.map(item => {
                    if (item.extendType === 'lc') {
                        lcCount++;
                    } else if (item.extendType === 'screen') {
                        screenCount++;
                    } else if (item.extendType === 'sensor') {
                        sensorCount++;
                    } else if (item.extendType === 'camera') {
                        cameraCount++;
                    } else if (item.extendType === 'chargePole') {
                        chargePoleCount++;
                    }
                })
                const x = this.state.tableData.get(index).set('lcCount', lcCount).set('screenCount', screenCount).set('sensorCount', sensorCount).set('cameraCount', cameraCount).set('chargePoleCount', chargePoleCount);
                const tableData = this.state.tableData.set(index, x);
                this.setState({
                    tableData: tableData
                })
            })
            //return a new object that contains all properties that we need;
            return {
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
        let poleData = data.filter(item => item.extendType === 'pole');
        if (poleData.length) {
            let item = poleData[0];
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
        // console.log('成功调用requestSearch!');
        const {model, domainList, search, page} = this.state;
        let domain = domainList.options.length ? domainList.options[domainList.index].id : null;
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1) * size;
        // let searchModel = {
        //     domain: domainList.options.length ? domainList.options[domainList.index].id : null,
        //     name: search.get('value'),
        //     cur: page.get('current'),
        //     size: page.get('pageSize')
        // };
        // searchModel.offset = (searchModel.cur - 1) * searchModel.size;
        // console.log('searchModel', searchModel)

        getSearchCount(domain, model, name, data => {
            this.mounted && this.initPageSize(data)
        })
        getSearchAssets(domain, model, name, offset, size, data => {
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
        //console.log('item', item);
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

    //Declaring the Table Component Function
    rowClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    //EditPopup functions
    //Basic functions.Controning the EditPopup whether showing or hidden. 
    editButtonClick() {
        this.showPopup();
    }

    /*This function will show the EditPopup,provide this componet all properties if they were needed.
     *However,this componet is not the childComponent for sysConfigSmartLightComponet,for its all state are in redux,not local componet.
     */
    showPopup() {
        const {selectDevice, allEquipmentsData, allPoleEquipmentsData} = this.state;
        const {overlayerShow} = this.props.actions;
        overlayerShow(< EditPopup title='新建/修改智慧路灯' onConfirmed={ this.onConfirmed } onDeleted={ this.onDeleted } closeClick={ this.closeClick } onChange={ this.equipmentSelect } equipmentSelectList={ this.state.equipmentSelectList }
                        selectValue={ this.state.selectValue } allEquipmentsData={ allEquipmentsData } allPoleEquipmentsData={ allPoleEquipmentsData } mainSelect={ this.mainSelect.bind(this) } selectDevice={ this.state.selectDevice }
                        showPopup={ this.showPopup.bind(this) } showMessage={ this.showMessage } />);
    }

    //Bind on EditPopup - Confirm_Button.
    onConfirmed() {
        this.closeClick();

    }
    //This is the basic closePopup function.Each function will call closeClick if they need close the popup.
    closeClick() {
        this.requestSearch()

        this.props.actions.overlayerHide();
    }

    //Animating functions --- controling the SideBar whether showing or hidden with its styles;
    collpseHandler() {
        this.setState({
            collapse: !this.state.collapse
        })
    }

    //This function provide notifyMessage(green block in center if you completed some correct operations successfully)
    showMessage(statusCode, meaasge) {
        this.props.actions.addNotify(statusCode, meaasge);
    }

    render() {
        const {collapse, search, data, page, domainList, modelList, selectDevice} = this.state;
        let initSelectDeviceName = selectDevice.data.length ? selectDevice.data[0].name : '';
        let activeId = selectDevice.data.length && selectDevice.data[0].id;
        return ( <div id='sysConfigSmartLight'>
                   <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
                     <header>
                       <Select id="domain" { ...domainList } onChange={ this.domainSelect } />
                       <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } onChange={ this.searchChange } submit={ this.searchSubmit } />
                     </header>
                     <div className="table-container">
                       <Table className="dataTable" columns={ this.columns } data={ this.state.tableData } rowClick={ this.rowClick } activeId={ activeId } />
                       <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }
                       />
                     </div>
                     <SideBarInfo mapDevice={ selectDevice } collpseHandler={ this.collpseHandler }>
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
        overlayerHide,
        addNotify: addNotify
    }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(sysConfigSmartLight);