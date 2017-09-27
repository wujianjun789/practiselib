/**
 * Created by mx on 2017/9/11.
 * systemOperation/systemConfig/scene;
 */

// import BaseFunction/Component
import React, { Component } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../../../public/styles/systemOperation-sysConfig.less';

import SearchText from '../../components/SearchText';
import Table from '../../components/Table3';
import Page from '../../components/Page';
import SideBarInfo from '../../components/SideBarInfo';
import Select from '../../components/Select'
import SceneControllerPopup from '../components/SceneControllerPopup.js';
import ConfirmPopup from '../../components/ConfirmPopup';
import Content from '../../components/Content';

import { getDomainList } from '../../api/domain';
import { getSearchScene, getSearchSceneCount } from '../../api/scene'
import { TreeData, getModelData, getModelList, getModelTypesById, getModelTypesNameById } from '../../data/systemModel'
import { getAssetList, getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel } from '../../api/asset'
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { treeViewInit } from '../../common/actions/treeView';
import { getObjectByKey } from '../../util/index';

import { getSceneList, addScene, updateSceneById } from '../../api/scene.js';

import SiderBarComponent from '../components/SideBarComponents.js';
import EditPopup from '../components/EditPopup';

import { sysDataHandle } from '../model/sysDataHandle';
import { sysInitStateModel } from '../model/sysInitStateModel';

const lodash = require("lodash");
export class sysConfigScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'}, {id:2, value:'设备多少'}], index:0, value:'场景序号', placeholder:"排序"}),
            sceneList:  [
                // {id:1, name:"场景1", active:false,presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e45", asset: "string", prop: "string", mode: "MANUAL", value: "60"}], mode: "MANUAL"},
                // {id:2, name:"场景2", active:false, presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e46", asset: "string", prop: "string", mode: "MANUAL", value: "70"}], mode: "MANUAL"},
                // {id:3, name:"场景3", active:false, presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e47", asset: "string", prop: "string", mode: "STRATEGY", value: "80"}], mode: "STRATEGY"},
            ],
            assetList:{
                titleField: 'name',
                valueField: 'name',
                index: 0,
                value: "",
                options:[
                    {id: "22", name: "单灯1", geoPoint: {lat: 0, lng: 0}, extendType: "lc", domainId: 1},
                    {id: "23", name: "单灯2", geoPoint: {lat: 0, lng: 0}, extendType: "lc", domainId: 1},
                    {id: "24", name: "灯杆1", geoPoint: {lat: 0, lng: 0}, extendType: "pole", domainId: 1}
            ]},

            search: Immutable.fromJS({placeholder: '输入场景名称',value: ''}),
            page: Immutable.fromJS({
                pageSize:12,
                current: 1,
                total: 0
            }),
            IsHaveMap:false,
            model: "scene",
            collapse: false,

            selectDevice: {
                id: "",
                name:"", 
                active:false, 
                presets:[{
                    asset:"",
                    id:"", 
                    mode:"",
                    name:"",
                    prop:"",
                    value:""
                }]           
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
                    }
                ]
            },
        }

        this.columns = [
            {
                id: 0,
                // field: "name",
                field: d => d.name,
                title: "场景名称"
            },
            {
                id: 1,
                // field: "mode",
                field: d => {return d.presets[0].mode},
                title: "控制模式"
            }
        ];

        this.sortChange = this.sortChange.bind(this);
        this.initPageSize = this.initPageSize.bind(this);
        this.requestSearch = this.requestSearch.bind(this);
        this.updateSceneAssetList = this.updateSceneAssetList.bind(this);
        this.initResult = this.initResult.bind(this);

        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);

        this.popupCancel = this.popupCancel.bind(this);
        this.popupConfirm = this.popupConfirm.bind(this);

        this.initDomainList = this.initDomainList.bind(this);
        this.getAssetName = this.getAssetName.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
       
        getDomainList(data => {
            this.mounted && this.initDomainList(data)
        })
  
        getAssetList(data=>{
            if(this.mounted){
                // this.assetList=data;
                this.setState({assetList:{...this.state.assetList, options: data}});
                // this.setState({assetList: Object.assign({}, this.state.assetList, {options: data})});
            }
        });

        this.requestSearch();
    }

    requestSearch(){
        const {search, page} = this.state;
        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let value = search.get("value");
        getSearchScene(value, offset, limit, data=>{ this.mounted && this.initResult(data)}) //动态渲染table
        getSearchSceneCount(value, data=>{ this.mounted && this.initPageSize(data)})
    }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    initDomainList(data) {
        // console.log("data:", data);
        // data.length==0&&data.unshift({name:'请添加域'});
        let domainList = Object.assign({}, this.state.domainList, {index: 0},{value: data.length ? data[0].name : ""}, {options: data});
        this.setState({domainList: domainList});
    }

    initResult(data){
        this.setState({sceneList:data},()=>{
            data.map(scene=>{
                this.getAssetName(scene, curIndex=>{
                    console.log("curIndex:",curIndex);
                    if(curIndex==0){
                        this.updateSelectDevice(this.state.sceneList[0]);
                    }
                });
            })
        });
    }

    getAssetName(scene, cb){
        if(scene.presets)
        {
            let curIndex = lodash.findIndex(this.state.sceneList, sc=>{return sc.id == scene.id})
            this.state.sceneList[curIndex].presets = scene.presets.map(pre=>{
                let newAsset = lodash.find(this.assetList, (asset)=>{
                    return asset.id==pre.asset;
                })
                return Object.assign({}, pre, {name:newAsset?newAsset.name:""},{domainId:newAsset?newAsset.domainId:null});
            })
            this.setState({sceneList:this.state.sceneList},()=>{
                cb && cb(curIndex);
            })
        }
    }

    sortChange(selectIndex){
        this.setState({sort:this.state.sort.update('index', v=>selectIndex)})
        this.setState({sort:this.state.sort.update('value', v=>{
            return this.state.sort.getIn(['list', selectIndex, 'value']);
        })})
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    popupCancel() {
        this.props.actions.overlayerHide();
    }

    popupConfirm() {
        const {model, selectDevice} = this.state;
        delAssetsByModel(model, selectDevice && selectDevice.id, () => {
            this.requestSearch();
            this.props.actions.overlayerHide();
        })
    }

    domainHandler(e) {
        let id = e.target.id;
        const { model, domainList, selectDevice, sceneList, assetList } = this.state;   
        const {overlayerShow, overlayerHide} = this.props.actions;

        switch (id) {
            case 'sys-add':
                const dataInit = {
                    domainId: domainList.options.length ? domainList.options[domainList.index].id : "",
                    name: "",
                    sceneAssetList: selectDevice.presets,
                    param: "",
                    id:'',
                    assetName: assetList.value,
                };

                overlayerShow(<SceneControllerPopup popId="add" className="centralized-popup" 
                                title="新建场景" 
                                data={ dataInit } domainList={ domainList }
                                overlayerHide={ overlayerHide }
                                assetList = { assetList }
                                onConfirm={ (data) => {
                                                        {/*addScene(data, () => {
                                                            this.requestSearch();
                                                            overlayerHide();
                                                        });*/}
                                                        console.log("添加场景")
                                                      } } />);
                break;
            case 'sys-update':
                let data = selectDevice.presets.length ? selectDevice.presets[0] : null;
                const dataInit2 = {
                    domainId: selectDevice.domainId,
                    name: "",
                    sceneAssetList: selectDevice.presets,
                    param: "",
                    id:'',
                    assetName: assetList.value 
                }

                overlayerShow(<SceneControllerPopup popId="edit" className="centralized-popup" 
                                title="修改场景"
                                data={ dataInit2 } domainList={ domainList }
                                assetList = { assetList }
                                overlayerHide={ overlayerHide } 
                                onConfirm={ data => {
                                                    updateSceneById(id, data, (data) => {
                                                        this.requestSearch();
                                                        overlayerHide();
                                                    })
                                                } } />);
                break;
            case 'sys-delete':
                overlayerShow(<ConfirmPopup tips="是否删除选中场景？" iconClass="icon_popup_delete" cancel={ this.popupCancel } confirm={ this.popupConfirm } />)
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
        this.updateSelectDevice(row);
    }

    updateSelectDevice(item) {
        this.setState({
            selectDevice: item
        }, ()=>this.updateSceneAssetList());
    }

    updateSceneAssetList(){
        //更新被选中场景的设备列表
    }

    searchSubmit() {
        let page = this.state.page.set('current', 1);
        this.setState({page:page},()=>{
            this.requestSearch();
        });    
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

    render() {
        const { sort, search, sceneList,assetList, page, model, collapse, selectDevice, domainList, IsHaveMap} = this.state; 
        return <div id ='sysConfigScene'>
                <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '')}>
                 <div className="heading">
                   <Select className="sort" data={sort} onChange={(selectIndex)=>this.sortChange(selectIndex)}/>
                   <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } 
                                onChange={ this.searchChange } submit={ this.searchSubmit } />
                   <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
                 </div>
                 <div className='scene'>
                   <div className="table-container">
                     <Table columns={ this.columns } data={ sceneList } activeId={ selectDevice.id } rowClick={ this.tableClick } />
                     <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }/>
                   </div>
                 </div>
                 <SideBarInfo mapDevice={ selectDevice } collpseHandler={ this.collpseHandler } IsHaveMap = {IsHaveMap} >
                   <div className="panel panel-default device-statics-info">
                     <div className="panel-heading">
                       <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选中场景
                     </div>
                     <div className="panel-body domain-property">
                       <span className="domain-name">{ selectDevice.name }</span>
                       <button id="sys-update" className="btn btn-primary pull-right" onClick={ this.domainHandler } disabled={sceneList.length==0?true:false}>编辑
                       </button>
                       <button id="sys-delete" className="btn btn-danger pull-right" onClick={ this.domainHandler } disabled={sceneList.length==0?true:false}>删除
                       </button>
                     </div>
                   </div>
                   <div className="panel panel-default device-statics-info map-position max-height">
                     <div className="panel-heading">
                       <svg><use xlinkHref={"#icon_sys_whitelist"} transform="scale(0.082,0.082)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>包含设备
                     </div>
                     <div id='scene-device' className="panel-body domain-property domain-content">
                         {
                             selectDevice.presets.map((item,index) => (
                                 <div key={item.id} className="content-size">{ item.name }</div>
                             ))
                         }
                     </div>
                  </div>
                 </SideBarInfo>
               </Content>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(sysConfigScene);