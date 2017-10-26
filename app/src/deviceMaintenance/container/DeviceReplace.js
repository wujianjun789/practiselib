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
import ImportFilePopup from '../component/ImportFilePopup';
import {addNotify} from '../../common/actions/notifyPopup';
import {getDomainList} from '../../api/domain';
import {getAssetModelList} from '../../api/asset';
import {getSearchAssets} from '../../api/asset';
import {getSearchCount} from '../../api/asset';
import {getObjectByKey} from '../../util/index';
import Content from '../../components/Content';

import {TreeData, getModelData, getModelNameById, getModelTypesById, getModelTypesNameById } from '../../data/systemModel';

import { treeViewInit } from '../../common/actions/treeView';

export class DeviceReplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allChecked: false,
            model: "gateway",
            collapse: false,
            page: Immutable.fromJS({
                total: 10,
                current: 1,
                pageSize: 10
            }),
            search: Immutable.fromJS({
                value: '',
                placeholder: '请输入设备名称',
            }),
            selectDevice: {
                id: 'systemOperation',
                position: [],
                data: []
            },
            domainList: {
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options: []
            },
            assetCategoryList: { //设备类别列表
                titleField: 'intlName',
                valueField: 'intlName',
                index: 0,
                value: '',
                model:'',
                options: []
            },
            data: Immutable.fromJS([

            ])
        }
        this.columns = [
            {id: 0, field: "name", title: "设备名称"},
            {id: 1, field: "assetCategoryName", title: "设备类别"},
            {id: 2, field: "domainName", title: "域"},
            {id: 3, field: "id", title: "设备编号"}
        ];
        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        // this.tableClick = this.tableClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        this.domainSelect = this.domainSelect.bind(this);
        this.assetCategorySelect = this.assetCategorySelect.bind(this);

        // this.popupCancel = this.popupCancel.bind(this);
        // this.popupConfirm = this.popupConfirm.bind(this);

        this.requestSearch = this.requestSearch.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        // this.initDomainList = this.initDomainList.bind(this);
        this.initAssetList = this.initAssetList.bind(this);
        this.onChange = this.onChange.bind(this);

        this.initAssetCategoryList = this.initAssetCategoryList.bind(this);
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
                });
            }
        });
        getDomainList(data=> {
            this.mounted && this.initDomainList(data);
            getAssetModelList((data) => {
                this.mounted && this.initAssetCategoryList(data);
            })
        })
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {

    }

    requestSearch(){
        const { model, domainList, search, page, assetCategoryList } = this.state;
        let domain = domainList.options.length?domainList.options[domainList.index]:null;
        let name = search.get('value');
        let cur = page.get('current');
        let size = page.get('pageSize');
        let offset = (cur - 1)*size;
        getSearchCount(domain?domain.id:null, model, name, data=> {        
            this.mounted && this.initPageSize(data)
        })

        getSearchAssets(domain?domain.id:null, model, name, offset, size, data=> {
            this.mounted && this.initAssetList(data)
        })
    }

    initPageSize(data) {
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    initDomainList(data) {
        // console.log("data:", data)
        let domainList = Object.assign({}, this.state.domainList, {index: 0, 
            value: data.length?data[0].name: "", options: data.length? data : [{name: '请添加域'}]});
        this.setState({domainList: domainList});
    }

    initAssetCategoryList(data) {
        let options = data.map((item,index) => {
            item.intlName = item.intl.name.zh;
            return item;
        });

        // options.unshift({name:"请选择设备类别", value:"请选择设备类别", intlName:"请选择设备类别"});
        let assetCategoryList = Object.assign({}, this.state.assetCategoryList, 
            {index: 0}, {value: options.length?data[0].intlName: ""}, {options: options});
        this.setState({assetCategoryList: assetCategoryList}, this.requestSearch);
    }



    initAssetList(data) {
        let list = data.map((asset, index)=> {
            let domainName = "";
            if(this.state.domainList.options.length && asset.domainId) {
                let domain = getObjectByKey(this.state.domainList.options, 'id', asset.domainId);
                domainName = domain?domain.name:"";
            }

            let assetCategoryName = "";
            if(this.state.assetCategoryList.options.length && asset.extendType) {
                let assetCategory = getObjectByKey(this.state.assetCategoryList.options, 'key', asset.extendType);
                assetCategoryName = assetCategory?assetCategory.intl.name.zh:"";
            }
            return Object.assign({}, asset, {domainName: domainName}, {assetCategoryName:assetCategoryName})
        })
        
        this.setState({data: Immutable.fromJS(list)});
        
        
        if (list.length) {
            let item = list[0];
            this.updateSelectDevice(item);
        } else {
            this.setSate({selectDevice: Object.assign({}, this.state.selectDevice, {data: [] })});
        }
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
        // console.log(e)
        let id = e.target.id;
        const {} = this.state
        const {overlayerHide, overlayerShow, addNotify} = this.props.actions;
        switch (id) {
            case "device_replace_batch": 
                const dataInit2 = {
                    title: "批量更换",
                    placeholder: "选择列表文件路径",
                    success: "更换成功",
                    fail: "更换失败",
                };
                // console.log(this.props.actions);
                overlayerShow(<ImportFilePopup className="" data={dataInit2} overlayerHide={overlayerHide} 
                addNotify={this.props.actions.addNotify}
                onConfirm={()=>{
                    // console.log("批量更换设备");
                }}  />);

            break;
            case "device_num_modify":
                const dataInit = {
                    title: "修改设备编号",
                    selectDeviceName: "被选中设备的名称",
                    selectDeviceNumber: "被选中的设备编号",
                };
                
                overlayerShow(<DeviceNumberModifyPopup className="device-num-modify-popup" data={dataInit}
                    /* addNotify={this.props.actions.addNotify} */
                    overlayerHide={overlayerHide} onConfirm={()=>{
                        // console.log("更新设备编号")
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

    domainSelect(e) {
        let index = e.target.selectedIndex;
        let {domainList} = this.state;
        // domainList.index = index;
        // domainList.value = domainList.options[index].name;
        // console.log('%%%%%%%%%%%%')
        // console.log({...domainList})
        // console.log({...domainList, index: index, value: domainList.options[index].name})
        this.setState({domainList: {...domainList, index: index, value: domainList.options[index].name}}, ()=>{
            this.requestSearch();
            // console.log(this.state.domainList);
        })
    }

    assetCategorySelect(e) {
        let index = e.target.selectedIndex;
        // console.log(index)
        let {assetCategoryList} = this.state;
        assetCategoryList.index = index;
        assetCategoryList.value = assetCategoryList.options[index].intlName;
        assetCategoryList.key = assetCategoryList.options[index].key;
        // console.log("assetCategoryList.key:", assetCategoryList.key)
        
        this.setState({assetCategoryList: assetCategoryList, model: assetCategoryList.key}, ()=>{
            this.requestSearch();
        })

    }

    searchChange(value) {
        this.setState({search: this.state.search.update('value', () =>value)});
    }

    searchSubmit() {
        let page = this.state.page.set('current', 1);
        this.setState({page:page}, ()=>{
            this.requestSearch();
        });
    }

    tableClick(row) {
        this.updateSelectDevice(row.toJS());
    }

    updateSelectDevice(item) {
        let selectDevice = this.state.selectDevice;

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
        this.setState({
            collapse: !this.state.collapse
        })
    }

    render() {
        const {model, collapse, page, search, selectDevice, domainList, data, assetCategoryList, allChecked} = this.state;
        return <Content className={'offset-right' + (collapse?' collapsed':' ')} id = 'sysDeviceMaintenanceReplace'>
                <div className="heading">
                    {/* {<Checkbox onChange={onChange}>Checkbox</Checkbox>} */}
                    {/* <Checkbox onChange = {this.onChange} allChecked = {allChecked} id='checkbox'></Checkbox> */}
                    {/* <input type="checkbox" className="" ></input> */}
                    <Select id="domain"  titleField={domainList.titleField} valueField={domainList.valueField}
                            options={domainList.options} value={domainList.value} onChange={this.domainSelect}/>
                    <Select id="assetCategory"  titleField={assetCategoryList.titleField} valueField={assetCategoryList.valueField} 
                            options={assetCategoryList.options} value={assetCategoryList.value} onChange={this.assetCategorySelect}/>
                    <SearchText placeholder={search.get('placeholder')} value={search.get('value')}
                        onChange={this.searchChange} submit={this.searchSubmit} />
                    <button id="device_replace_batch" className="btn btn-primary add-domain" onClick = {this.domainHandler}>批量更换</button>
                </div>
                <div className="body">
                    <div className="table-container">
                        <Table columns={this.columns} data={data} activeId={selectDevice.data.length && selectDevice.data[0].id}
                            rowClick={this.tableClick}/>
                        <Page className={"page"+(page.get('total')==0?" hidden":'')} showSizeChanger pageSize={page.get('pageSize')}
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
            addNotify,
            treeViewInit,
            overlayerShow,
            overlayerHide
        }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DeviceReplace);

