/** Created By ChrisWen
 *  系统配置/智慧路灯模块
 *  约定： 以 smartLight 命名 智慧路灯,sysConfig 代表系统配置模块（systemConfig）
 *  拼接命名根据驼峰原则进行对应的大小写转化
 *  约定： sysConfigSmartLightChildren 对象提供该模块所有区域组件的子组件
 */

//import 基础库
import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

//import 各区域组件和样式表
import '../../../public/styles/systemOperation-sysConfig.less';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import ConfirmPopup from '../../components/ConfirmPopup';
import Content from '../../components/Content.js';

//import 功能函数/模型
import { sysInitData } from '../initData/index.js';
import { getDomainList } from '../../api/domain.js';
import { DomainList } from '../model/domainList.js';
import { getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel } from '../../api/asset';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer.js';
import { treeViewInit } from '../../common/actions/treeView';

//import 各区域组件子组件
import { sysConfigSmartLightChildren } from '../components/smartLightComponents.js';


export class sysConfigSmartLight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            model: '',
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
            data: Immutable.fromJS([]),
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
            whiteListData: {}
        }
        //Table 数据相关
        this.columns = sysInitData.smartLight;

        //bind functions
        this.initDomainList = this.initDomainList.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
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
    initDomainList(data) {
        let newObj = DomainList.init(data);
        let domainList = {
            ...this.state.domainList,
            ...newObj
        };
        this.setState({
            domainList: domainList
        });
    }

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

    domainHandler(e) {
        const {model, selectDevice, domainList, modelList, whiteListData} = this.state;
        const {overlayerShow, overlayerHide} = this.props.actions;
        let id = e.target.id;
        let curType = modelList.options.length ? modelList.options[0] : null;

        switch (id) {
            case 'sys-add':
            case 'sys-update':
            case 'sys-delete':
            case 'whitelist':
            default:
                return false;
        }
    }

    render() {
        const {collapse, search, data, page, domainList} = this.state;
        const SideBarInfoChildren = sysConfigSmartLightChildren.sideBar();

        return (
            <Content id='sysConfigSmartLight' className={ 'offset-right ' + (collapse ? 'collapsed' : '') }>
              <header>
                <Select id="domain" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }
                />
                <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } />
                <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
              </header>
              <div className="table-container">
                <Table className="dataTable" columns={ this.columns } data={ data } />
                <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } />
              </div>
              <SideBarInfo>
                { SideBarInfoChildren }
              </SideBarInfo>
            </Content>
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