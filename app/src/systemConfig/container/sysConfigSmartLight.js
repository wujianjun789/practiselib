/** Created By ChrisWen
 *  17/09/04
 *  systemOperation/systemConfig/smartLightComponent;
 *  Declaring：We use smartLight as 智慧路灯,sysConfig as 系统配置模块,which is shortted from systemConfig;
 *  All componets were named follow the HumpRules,even if they were combinend;
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
import { DomainList } from '../model/domainList.js';
import { getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel } from '../../api/asset';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer.js';
import { treeViewInit } from '../../common/actions/treeView';

//import childrenComponentsModel
import SiderBarComponet from '../components/sidebarComponents.js';
import EditPopup from '../components/EditPopup.js';

//import initDataModel
import { sysInitData } from '../model/sysInitData.js';

export class sysConfigSmartLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
            isEdit: false,
            collapse: false,
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
            //data -> dataTable的数据
            data: sysInitData.equipmentList,
            //domainList -> 域名列表
            domainList: {
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: []
            },
            //modelList -> 模型列表
            modelList: {
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: []
            },
            //whiteListData -> 白名单列表
            whiteListData: {},
            //EditPopup - Select -> 数据源
            equipmentSelectList: Immutable.fromJS({
                list: sysInitData.equipmentSelectList
            // ,index: 0,
            // value: '访客'
            })
        }
        //Table 数据相关
        this.columns = sysInitData.smartLight;

        //bind functions
        this.initDomainList = this.initDomainList.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.showPopup = this.showPopup.bind(this);
        this.collpseHandler = this.collpseHandler.bind(this);
        this.onConfirmed = this.onConfirmed.bind(this);
        this.onDeleted = this.onDeleted.bind(this);
        this.closeClick = this.closeClick.bind(this);
        this.onEquipmentSelectChange = this.onEquipmentSelectChange.bind(this);
    }

    //Hook functions
    componentWillMount() {
        this.mounted = true;
        getDomainList(data => {
            this.mounted && this.initDomainList(data);
        });
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    //Declare functions
    //This is the basic closePopup function.Each function will call closeClick if they need close the popup.
    closeClick() {
        this.props.actions.overlayerHide();
    }

    // when componenetWillMount,we call this function to provide DomainList to be choosen.
    initDomainList(data) {
        let newObject = DomainList.init(data);
        let domainList = {
            ...this.state.domainList,
            ...newObject
        };
        this.setState({
            domainList: domainList
        });
    }

    //This is the DomainSelect function,bind in <Select/>
    domainSelect(event) {
        let {domainList} = this.state;
        let newObj = DomainList.select(event, domainList);
        let newDomainList = {
            ...domainList,
            ...newObj
        };
        this.setState({
            domainList: newDomainList
        }, () => {
            this.requestSearch()
        });
    }

    requestSearch() {
        //console.log(this.state.domainList)
    }

    //Bind on EditPopup - Confirm_Button.
    onConfirmed() {
        console.log('在最上层调用onConfirm');
        this.closeClick();
    }



    onDeleted() {
        alert('DELETE!');
    }

    showPopup() {
        const {model, selectDevice, domainList, modelList, whiteListData} = this.state;
        const {overlayerShow, overlayerHide} = this.props.actions;
        overlayerShow(<EditPopup title='新建/修改智慧路灯' onConfirmed={ this.onConfirmed } onDeleted={ this.onDeleted } closeClick={ this.closeClick } onChange={ this.onEquipmentSelectChange } equipmentSelectList={ this.state.equipmentSelectList }
                        data={ this.state.data } />);
    }

    collpseHandler() {
        this.setState({
            collapse: !this.state.collapse
        })
    }

    onEquipmentSelectChange() {
        console.log('最上层调用该函数');
    }

    render() {
        const {collapse, search, data, page, domainList} = this.state;
        return (
            <div id='sysConfigSmartLight'>
              <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
                <header>
                  <Select id="domain" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }
                  />
                  <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } />
                </header>
                <div className="table-container">
                  <Table className="dataTable" columns={ this.columns } />
                  <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } />
                </div>
                <SideBarInfo collpseHandler={ this.collpseHandler }>
                  <SiderBarComponet onClick={ this.showPopup } />
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