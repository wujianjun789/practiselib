/**
 * Created by m on 2017/10/17
 */
import '../../../public/styles/systemOperation-deviceMaintenance.less';

import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select.1';
import Immutable from 'immutable';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import Checkbox from '../../components/Checkbox';
import DeviceNumberModifyPopup from '../component/DeviceNumberModifyPopup';

import Content from '../../components/Content';

import {TreeData, getModelData, getModelNameById, getModelTypesById, getModelTypesNameById } from '../../data/systemModel';

import { treeViewInit } from '../../common/actions/treeView'

export class DeviceReplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allChecked: false,
            model: "devicereplace",
            collapse: false,
            page: Immutable.fromJS({
                total: 15,
                curent: 1,
                limit: 10
            }),
            search: Immutable.fromJS({
                value: '',
                placeholder: '请输入设备编号',
            }),
            selectDevice: {
                id: '',
                position: [],
                data: []
            },
            domainList: {
                titleField: 'name',
                valueField: 'value',
                index: 0,
                value: "",
                options: [
                    {id: 1, title: 'domain01', value: 'domain01'},
                    {id: 1, title: 'domain02', value: 'domain02'}
                ]
            },
            categoryList: {
                titleField: 'name',
                valueField: 'value',
                index: 0,
                value: '',
                options: [
                    {id: 1, title: 'category01', value: 'category01'}, 
                    {id: 2, title: 'category02', value: 'category02'}
                ]
            },
            // modelList: {
            //     titleField: 'title',
            //     valueField: 'value',
            //     options: [
            //         {id: 1, title: 'model01', value: 'model01'}
            //     ]
            // }
        }
        this.columns = [
            {id: 0, field: "deviceName", title: "设备名称"},
            {id: 1, field: "deviceCategory", title: "设备类别"},
            {id: 2, field: "domainName", title: "域"},
            {id: 3, field: "deviceNumber", title: "设备编号"}
        ];
        this.collpseHandler = this.collpseHandler.bind(this);
        // this.searchChange = this.searchChange.bind(this);
        // this.tableClick = this.tableClick.bind(this);
        // this.updateSelectDevice = this.updateSelectDevice.bind(this);
        // this.searchSubmit = this.searchSubmit.bind(this);
        // this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        // this.domainSelect = this.domainSelect.bind(this);

        // this.popupCancel = this.popupCancel.bind(this);
        // this.popupConfirm = this.popupConfirm.bind(this);

        // this.requestSearch = this.requestSearch.bind(this);
        // this.initPageSize = this.initPageSize.bind(this);
        // this.initDomainList = this.initDomainList.bind(this);
        // this.initAssetList = this.initAssetList.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        const {route} = this.props;
        let {model} = this.state;
        getModelData(model, ()=>{
            if (this.mounted) {
                this.props.actions.treeViewInit(TreeData);
                this.setState({
                    model: model
                    // modelList: Object.assgin({}, this.state.modelList, {})
                });
                getDomainList(data=> {
                    this.mounted && this.initDomainList(data)
                })
            }
        })
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {

    }

    requestSearch(){
        const { model, domainList, search, page } = this.state
        let domain = domainList.options.length?domainList.options[domainList.index]:null;
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1)*size;
        getSearchCount(domain?domain.id:null, model, name, data=> {
            this.mounted && this.initPageSize(data)
        })

        getSearchAsset(domain?domain.id:null, model, name, offset, size, data=> {
            this.mounted && this.initAssetList(data)
        })
    }

    initPageSize(data) {
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    initDomainList(data) {
        let domainList = Object.assgin({}, this.state.domainList, {index: 0}, {value: data.length?data[0].name: ""}, {options: data});
        this.setState({domainList: domainList});
        this.requestSearch();
    }

    initCategoryList(data) {
        let categoryList = Object.assgin({}, this.state.categoryList, {index: 0}, {value: data.length?data[0].name: ""}, {options: data});
        this.setState({categoryList: categoryList});
        this.requestSearch();
    }



    initAssetList(data) {

    }

    popupReplacCancel() {
        this.props.actions.overlayerHide();
    }
    
    popupUpdateCancel() {
        this.props.actions.overlayerHide();
    }

    popupReplaceConfirm() {
        //
    }

    popupUpdateConfirm() {
        //
    }

    domainHandler(e) {
        console.log(e)
        let id = e.target.id;
        const {} = this.state
        const {overlayerHide, overlayerShow} = this.props.actions;
        switch (id) {
            case "device_replace_batch": 

            break;
            case "device_num_modify":
                const dataInit = {
                    title: "修改设备编号",
                    selectDeviceName: "被选中设备的名称",
                    selectDeviceNumber: "别选中的设备编号",
                };
                overlayerShow(<DeviceNumberModifyPopup className="device_num_modify_popup" data={dataInit}
                    overlayerHide={overlayerHide} onConfirm={()=>{
                        console.log("更新设备编号")
                    }}/>);
            break;

        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=> {
            this.requestSearch();
        })
    }

    tableClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    updateSelectDevice(item) {
        let selectdevice = this.state.selectDevice;

    }

    onChange(e) {
        const id = e.target.id;
        switch(id){
            case 'checkbox':
            this.setState({allChecked: e.target.checked});
            break;
        }
    }

    collpseHandler() {
        console.log("调用cool")
        this.setState({
            collapse: !this.state.collapse
        })
    }

    render() {
        const {model, collapse, page, search, selectDevice, domainList, data, categoryList, allChecked} = this.state;
        return <Content className={'offset-right' + (collapse?' collapsed':' ')} id = 'sysDeviceMaintenanceReplace'>
                <div className="heading">
                    {/* {<Checkbox onChange={onChange}>Checkbox</Checkbox>} */}
                    {<Checkbox onChange = {this.onChange} allChecked = {allChecked} id='checkbox'></Checkbox>}
                    {/* <input type="checkbox" className="" ></input> */}
                    <Select id="domain"  titleField={domainList.valueField} valueField={domainList.valueField}
                            options={domainList.options} value={domainList.value} onChange={this.domainSelect}/>
                    <Select id="category"  titleField={categoryList.valueField} valueField={categoryList.valueField} 
                            options={categoryList.options} value={categoryList.value} onChange={this.domainSelect}/>
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                        onChange={this.searchChange} submit={this.searchSubmit} />
                    <button id="device_replace_batch" className="btn btn-primary add-domain" onClick = {this.domainHandler}>批量更换</button>
                </div>
                <div className="body">
                    <div className="table-container">
                        <Table columns={this.columns} data={data} activeId={selectDevice.data.length && selectDevice.data[0].id}
                            rowClick={this.tableClick}/>
                        <Page className={"page"+(page.get('total')==0?"hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
                            current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                    </div>
                </div>
                <SideBarInfo mapDevice={selectDevice} collpseHandler={this.collpseHandler}>
                    <div className="panel panel-default device-statics-info">
                        <div className="panel-heading">
                            <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20 " 
                                width="200" height="200"/></svg>选中设备
                        </div>
                        <div className="panel-body domain-property">
                            <span className="domain-name" title = {selectDevice.data.length?selectDevice.data[0].name:''}>{selectDevice.data.length?selectDevice.data[0].name:''}</span>
                            <button id="device_num_modify" className="btn btn-primary pull-right" onClick = {this.domainHandler}>修改</button>
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
        },dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReplace);

