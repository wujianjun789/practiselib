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
// 场景添加、编辑弹出框
import SceneControllerPopup from '../components/SceneControllerPopup.js';
import ConfirmPopup from '../../components/ConfirmPopup';
import Content from '../../components/Content';


// import functions
import { getDomainList } from '../../api/domain';
import { getSearchScene, getSearchSceneCount } from '../../api/scene'
import { TreeData, getModelData, getModelList, getModelTypesById, getModelTypesNameById } from '../../data/systemModel'
import { getAssetList, getSearchAssets, getSearchCount, postAssetsByModel, updateAssetsByModel, delAssetsByModel } from '../../api/asset'
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { treeViewInit } from '../../common/actions/treeView';
import { getObjectByKey } from '../../util/index';

//import netRequestAPI
import { getSceneList } from '../../api/scene.js';

//inport childrenComponentsModel
import SiderBarComponent from '../components/SideBarComponents.js';
import EditPopup from '../components/EditPopup';

//import initDataModel
import { sysDataHandle } from '../model/sysDataHandle';
import { sysInitStateModel } from '../model/sysInitStateModel';



export class sysConfigScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort:Immutable.fromJS({list:[{id:1, value:'场景序号'},{id:2, value:'设备多少'}], index:0, value:'场景序号',placeholder:"排序"}),

            //场景列表
            sceneList:  [
                {id:1, name:"场景1", active:false, presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e45", asset: "string", prop: "string", mode: "MANUAL", value: "60"}], mode: "MANUAL"},
                {id:2, name:"场景2", active:false, presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e46", asset: "string", prop: "string", mode: "MANUAL", value: "70"}], mode: "MANUAL"},
                {id:3, name:"场景3", active:false, presets:[{id: "447d34f0-99eb-11e7-abcf-f55dc53b4e47", asset: "string", prop: "string", mode: "STRATEGY", value: "80"}], mode: "STRATEGY"},
            ],
            //从API获取的设备列表getAssetList
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
            //某一个场景的的设备列表
            sceneAssetList:[
                {id: "12", name: "单灯3", geoPoint: {lat: 0, lng: 0}, extendType: "lc", domainId: 1},
                {id: "13", name: "单灯4", geoPoint: {lat: 0, lng: 0}, extendType: "lc", domainId: 1},
                {id: "14", name: "灯杆2", geoPoint: {lat: 0, lng: 0}, extendType: "pole", domainId: 1}],

            search: Immutable.fromJS({placeholder: '输入场景名称',value: ''}),

            page: Immutable.fromJS({
                pageSize:12,
                current: 1,
                total: 0
            }),
            IsHaveMap:false,
            model: "scene",
            collapse: false,


            selectScene: {  //被选中的场景信息
                id:"",
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

            selectDevice: {
                //scene
                name:"", 
                active:false, 
                presets:[{
                    asset:"",
                    id:"", 
                    mode:"",
                    name:"",
                    prop:"",
                    value:""
                }],               

                id: "",//gong

                //device
                latlng:{lng: 121.49971691534425,
                        lat: 31.239658843127756},
                position: [],
                data: [{name:'被选中场景'}],
                
                whiteCount: 0
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
        

        this.collpseHandler = this.collpseHandler.bind(this);
        this.searchChange = this.searchChange.bind(this);
        this.tableClick = this.tableClick.bind(this);
        this.updateSelectDevice = this.updateSelectDevice.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.domainHandler = this.domainHandler.bind(this);
        // this.domainSelect = this.domainSelect.bind(this);

        this.popupCancel = this.popupCancel.bind(this);
        this.popupConfirm = this.popupConfirm.bind(this);

        this.initDomainList = this.initDomainList.bind(this);
        this.initAssetList = this.initAssetList.bind(this);
        // this.requestWhiteListCount = this.requestWhiteListCount.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        let model = 'scene';
        const {route} = this.props;
        //获取模块数据
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
        });
        //获取设备数据
        getAssetList(data=>{
            if(this.mounted){
                this.assetList=data;
                this.setState(this.assetList, ()=>{this.requestSearch();});
            }});
    }


    
    requestSearch(){
        const {search, page} = this.state;
        // console.log("statescene:",this.state);

        let limit = page.get("pageSize");
        let offset = (page.get("current")-1)*limit;
        let value = search.get("value");
        //getSceneList()
        getSearchScene(value, offset, limit, data=>{ this.mounted && this.initResult(data)}) //动态渲染table
        getSearchSceneCount(value, data=>{ this.mounted && this.initPageSize(data)})
    }
    //从搜索框请求过滤后的数据
    // requestSearch() {
    //     const {model, domainList, search, page} = this.state
    //     console.log("domainList:", domainList)
    //     let domain = domainList.options.length ? domainList.options[domainList.index] : null;
    //     let name = search.get('value');
    //     let cur = page.get('current');
    //     let size = page.get('pageSize');
    //     let offset = (cur - 1) * size;
    //     getSearchCount(domain ? domain.id : null, model, name, data => {
    //         this.mounted && this.initPageSize(data)
    //     })
    //     getSearchAssets(domain ? domain.id : null, model, name, offset, size, data => {
    //         this.mounted && this.initAssetList(data);
    //         this.requestWhiteListCount();
    //     })
    // }

    initPageSize(data){
        let page = this.state.page.set('total', data.count);
        this.setState({page: page});
    }

    initResult(data){
        this.setState({sceneList:data},()=>{
            data.map(scene=>{
                this.getAssetName(scene);
            })
        });
    }

    getAssetName(scene){
        if(scene.presets)
        {
            let curIndex = lodash.findIndex(this.state.sceneList, sc=>{return sc.id == scene.id})
            this.state.sceneList[curIndex].presets = scene.presets.map(pre=>{
                let newAsset = lodash.find(this.assetList, (asset)=>{
                    return asset.id==pre.asset;
                })

                return Object.assign({}, pre, {name:newAsset?newAsset.name:""});
            })
            this.setState({sceneList:this.state.sceneList})
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


    initDomainList(data) {   //获取域信息列表
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

    // requestWhiteListCount() {
    //     const {selectDevice} = this.state;
    //     let lccId = selectDevice.data[0].id;
    //     requestWhiteListCountById(lccId, (lcCount) => {
    //         this.setState({
    //             selectDevice: Object.assign({}, selectDevice, {
    //                 whiteCount: lcCount.count
    //             })
    //         });
    //     })
    // }

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
        const { domainList, selectDevice, sceneList, sceneAssetList, assetList } = this.state;   
        const {model,/* selectDevice, domainList,*/ modelList, whitelistData} = this.state;
        const {overlayerShow, overlayerHide} = this.props.actions;
        let curType = modelList.options.length ? modelList.options[0] : null;
        switch (id) {
            case 'sys-add':
                const dataInit = {
                    //存放创建新场景需要更新的数据
                    domain: domainList.value,//场景所在区域
                    domainid: domainList.options.length ? domainList.options[domainList.index].id : "",
                    name: "",//场景名
                    mode: "",//控制模式
                    sceneAssetList: sceneAssetList, //场景白名单
                    param: "",//调整参数
                    id:'',//场景id
                    // assetName: assetList.length ? assetList[assetList.index].name : "",
                    // assetName: assetList.length ? assetList[0].name : "",
                    assetName: assetList.value, //设备选择输入框初始值



                    // id: '',
                    // name: '',
                    model: curType ? curType.title : "",
                    modelId: curType ? curType.id : "",
                    domain: domainList.value,
                    domainId: domainList.options.length ? domainList.options[domainList.index].id : "",
                    lng: "",
                    lat: ""
                };

                overlayerShow(<SceneControllerPopup popId="add" className="centralized-popup" 
                                title="新建场景" sceneAssetList = {this.state.sceneAssetList}
                                 model={ this.state.model } data={ dataInit } domainList={ domainList }
                                modelList={ modelList } overlayerHide={ overlayerHide }
                                sceneAssetList = { sceneAssetList }//场景白名单
                                assetList = { assetList }//可添加至场景的设备名单 
                                onConfirm={ (data) => {
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
                overlayerShow(<SceneControllerPopup popId="edit" className="centralized-popup" title="修改场景" data={ dataInit2 } domainList={ domainList } modelList={ modelList }
                                overlayerHide={ overlayerHide } onConfirm={ data => {
                                                                                updateAssetsByModel(model, data, (data) => {
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
        // this.updateSelectDevice(row.toJS());
        this.updateSelectDevice(row);
    }

    updateSelectDevice(item) {
        let selectDevice = this.state.selectDevice;
        // console.log("sceneselectDevice:", selectDevice)
        selectDevice.id = item.id;
        selectDevice.name = item.name;
        selectDevice.presets.splice(0);
        selectDevice.presets.push({
            id: item.id,
            asset: item.asset,
            prop: item.prop,
            mode: item.mode,
            value: item.vlaue,
        });


        selectDevice.latlng = item.geoPoint;
        selectDevice.data.splice(0);
        selectDevice.data.push({
            id: item.id,
            // type: item.extend.type,
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
        // this.requestWhiteListCount(); //点击列表行后更新项目数量

        this.requestSceneAssetList(); //点击列表后更新被选中场景的设备列表
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


    // domainSelect(event) {
    //     // this.props.actions.domainSelectChange(index);
    //     let index = event.target.selectedIndex;
    //     let {domainList} = this.state;
    //     domainList.index = index;
    //     domainList.value = domainList.options[index].name;
    //     this.setState({
    //         domainList: domainList
    //     }, () => {
    //         this.requestSearch();
    //     })
    // }

    render() {
        const { sort, search, sceneList,page} = this.state; //暂时单独存放的state
        const {model, collapse,/* page, search,*/ selectDevice, domainList, data, IsHaveMap} = this.state;
        return <div id ='sysConfigScene'>
                <Content className={ 'offset-right ' + (collapse ? 'collapsed' : '')}>
                 <div className="heading">
                   <Select className="sort" data={sort} onChange={(selectIndex)=>this.sortChange(selectIndex)}/>
                   {/*<Select id="domain" titleField={ domainList.valueField } valueField={ domainList.valueField } options={ domainList.options } value={ domainList.value } onChange={ this.domainSelect }/>*/}
                   <SearchText placeholder={ search.get('placeholder') } value={ search.get('value') } 
                                onChange={ this.searchChange } submit={ this.searchSubmit } />
                   <button id="sys-add" className="btn btn-primary add-domain" onClick={ this.domainHandler }>添加</button>
                 </div>
                 <div className='scene'>
                   <div className="table-container">
                     <Table columns={ this.columns } data={ sceneList } activeId={ selectDevice.data.length && selectDevice.data[0].id } rowClick={ this.tableClick } />
                     <Page className={ "page " + (page.get('total') == 0 ? "hidden" : '') } showSizeChanger pageSize={ page.get('pageSize') } current={ page.get('current') } total={ page.get('total') } onChange={ this.pageChange }/>
                   </div>
                 </div>
                 <SideBarInfo mapDevice={ selectDevice } collpseHandler={ this.collpseHandler } IsHaveMap = {IsHaveMap} >
                   <div className="panel panel-default device-statics-info">
                       {/*<div className="panel panel-default map-position">*/}
                     <div className="panel-heading">
                       <svg><use xlinkHref={"#icon_sys_select"} transform="scale(0.075,0.075)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>选中场景
                     </div>
                     <div className="panel-body domain-property">
                       <span className="domain-name">{ selectDevice.data.length ? selectDevice.data[0].name : '' }</span>
                       <button id="sys-update" className="btn btn-primary pull-right" onClick={ this.domainHandler } disabled={ data.size == 0 ? false : false }>编辑
                       </button>
                       <button id="sys-delete" className="btn btn-danger pull-right" onClick={ this.domainHandler } disabled={ data.size == 0 ? false : false }>删除
                       </button>
                     </div>
                   </div>
                   <div className="panel panel-default device-statics-info map-position max-height">
                     <div className="panel-heading">
                       <svg><use xlinkHref={"#icon_sys_whitelist"} transform="scale(0.082,0.082)" x="0" y="0" viewBox="0 0 20 20" width="200" height="200"/></svg>包含设备
                     </div>
                     <div id='scene-device' className="panel-body domain-property domain-content">
                        {/*展示被激活场景的设备列表*/}
                        {/*sceneAssetList.map(item,index){获取被激活场景中设备的名字，和该设备所在的域列表}*/}
                        <div className="">灯（疏影路组）</div>
                        <div className="">屏幕（疏影路组）</div>
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