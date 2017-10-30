/**
 * Created by a on 2017/10/20.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import '../../../public/styles/mediaPublish-playList.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../component/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import Content from '../../components/Content';
import Select from '../../components/Select';
import SearchText from '../../components/SearchText';
import Page from '../../components/Page';

import {treeViewInit} from '../../common/actions/treeView';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';

import ConfirmPopup from '../../components/ConfirmPopup'
import PlayerScenePopup from '../component/PlayerScenePopup';
import PlayerPlanPopup from '../component/PlayerPlanPopup';
import PlayerAreaPopup from '../component/PlayerAreaPopup';
import Material from '../component/material';

import moment from 'moment'
import Immutable from 'immutable';
import {numbersValid} from '../../util/index';
import {getIndexByKey} from '../../util/algorithm';
export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curType:'playerScene',
            playerData: [
                {
                    "id": "player1",
                    "name": "播放计划1",
                    "toggled": true,
                    "active": false,
                    "level": 1,
                    "children": [
                        {
                            "id": 'scene1',
                            "name": "场景1",
                            "toggled": true,
                            "class": "",
                            "active": false,
                            "children": [
                                {
                                    "id": 'area1',
                                    "name": "区域1",
                                    "active": true,
                                }, {
                                    "id": 'area2',
                                    "name": "区域2",
                                    "active": false,
                                }
                            ]
                        },
                        {
                            "id": 'scene2',
                            "name": "场景2",
                            "toggled": false,
                            "class": "",
                            "active": false,
                            "children":[]
                        }
                    ]
                },
                {
                    "id": "player2",
                    "name": "播放计划2",
                    "toggled": false,
                    "level": 1,
                    "children":[]
                },
                {
                    "id": "player3",
                    "name": "播放计划3",
                    "toggled": false,
                    "level": 1,
                    "children":[]
                }
            ],
            property: {
                action: {key: "action", title: "动作", list:[{id:1, name:'动作1'},{id:2, name:'动作2'}], index:0, name: "动作1"},
                position:{key:'position',title:'坐标位置',list:[{id:'left', name:'左'},{id:'center', name:'居中'},{id:'right', name:'右'},
                    {id:'top', name:'上'},{id:'middle', name:'中'},{id:'bottom', name:'下'},], id:'left'},
                axisX: {key: "axisX", title: "X轴", placeholder: "输入X轴", value: ""},
                axisY: {key: "axisY", title: "Y轴", placeholder: "输入Y轴", value: ""},
                speed: {key: "speed", title: "速度", placeholder: "fps(1-100)", value: ""},
                repeat: {key: "repeat", title: "重复次数", placeholder: "1-255", value: ""},
                resTime: {key: "resTime", title: "停留时间", placeholder: "ms", value: ""},
                flicker: {key: "flicker", title: "闪烁次数", placeholder: "1-255", value: ""},

                //区域
                areaName:{key: "areaName", title: "区域名称", placeholder: '区域名称', value: ""},
                width:{key: "width", title: "宽度", placeholder: '请输入宽度', value: ""},
                height:{key: "height", title: "高度", placeholder: '请输入高度', value: ""},
                axisX_a:{key: "axisX_a", title: "X轴", placeholder: '请输入X轴坐标', value: ""},
                axisY_a:{key: "axisY_a", title: "Y轴", placeholder: '请输入Y轴坐标', value: ""},

                assetName:{key: "assetName", title:"素材名称", placeholder:'素材', value:""}
            },
            assetType: Immutable.fromJS({list: [{id: 1, value: '类别1'}, {id: 2, value: '类别2'}], index: 0, value: '类别1'}),
            assetSort: Immutable.fromJS({
                list: [{id: 1, value: '素材文字'}, {id: 2, value: '素材图片'}],
                index: 0,
                value: '素材文字'
            }),
            assetSearch: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            assetList: Immutable.fromJS({list: [{id: 1, name: '素材1', active:true}, {id: 2, name: '素材2'},{id:3, name:'素材3'},
                {id:4, name:'素材4'}], id:1, name: '素材1', isEdit:true}),
            playerListAsset: Immutable.fromJS({
                list: [{id: 1, name: '素材1', active:true}, {id: 2, name: '素材2'},{id: 3, name: '素材3'}, {id: 4, name: '素材4'},
                    {id: 5, name: '素材5'}, {id: 6, name: '素材6'}], id: 1, name: '素材1', isEdit:true
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,
                areaName: true,width:true,height:true,axisX_a:true,axisY_a:true,
                assetName: true
            },

            showModal:false,

            assetStyle:{"bottom":"0px"},
        }

        this.typeList = [{id:'playerPlan', name:'播放计划'},{id:'playerScene', name:'场景'},{id:'playerArea', name:"区域"}]

        this.onToggle = this.onToggle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.assetSelect = this.assetSelect.bind(this);
        this.playerAssetSelect = this.playerAssetSelect.bind(this);
        this.positionHandler = this.positionHandler.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.playHandler = this.playHandler.bind(this);
        this.zoomOutHandler = this.zoomOutHandler.bind(this);
        this.zoomInHandler = this.zoomInHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
        this.savePlanHandler = this.savePlanHandler.bind(this);
        this.quitHandler = this.quitHandler.bind(this);
        this.areaClick = this.areaClick.bind(this);
        this.playerListAssetClick = this.playerListAssetClick.bind(this);
        this.assetList = this.assetList.bind(this);

        this.updatePlayerPlan = this.updatePlayerPlan.bind(this);
        this.showModal=this.showModal.bind(this);
        this.hideModal=this.hideModal.bind(this);
        this.updatePlayerPlanPopup = this.updatePlayerPlanPopup.bind(this);
        this.updatePlayerScenePopup = this.updatePlayerScenePopup.bind(this);
        this.updatePlayerAreaPopup = this.updatePlayerAreaPopup.bind(this);

        this.setSize = this.setSize.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.updatePlayerPlan();
        window.onresize = event=>{
            this.mounted && this.setSize();
        }
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    setSize(){
        let height = window.innerHeight;
        this.setState({assetStyle:{"bottom":(height<766?0:height-766)+"px"}});
    }

    updatePlayerPlan() {
        const {playerData} = this.state;
        const {actions} = this.props;
        actions && actions.treeViewInit(playerData);
    }

    assetSelect(item){
        console.log(item.toJS());
        // this.state.assetList = this.state.assetList.update('id', v=>item.get('id'));
        const curIndex = getIndexByKey(this.state.assetList.get('list'), 'id', item.get('id'));
        this.setState({assetList:this.state.assetList.updateIn(['list', curIndex, 'active'],v=>!item.get('active'))});
    }

    playerAssetSelect(item){
        console.log(item.toJS());
        // this.state.playerListAsset = this.state.playerListAsset.update('id', v=>item.get('id'));
        const curIndex = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.get('id'));
        this.setState({playerListAsset:this.state.playerListAsset.updateIn(['list',curIndex,'active'],v=>!item.get('active'))});
    }

    onChange(id, value) {
        console.log("id:",id);
        let prompt = false;
        if (id == "playerList" || id == "sceneList" || id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v=>value);
            this.setState({[id]: this.state[id].update('value', v=>this.state[id].getIn(["list", value, "value"]))});
        }
        else if (id == "assetSearch") {
            this.setState({assetSearch: this.state.assetSearch.update('value', v=>value)});
        } else {

            if(id == "action"){
                const curIndex = value.target.selectedIndex;
                this.setState({property: Object.assign({}, this.state.property, {[id]:Object.assign({}, this.state.property[id], {index:curIndex,name:this.state.property[id].list[curIndex].name})})})
            }else{
                const val = value.target.value;
                if(!numbersValid(val)){
                    prompt = true;
                }

                this.setState({property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: val})}),
                    prompt: Object.assign({}, this.state.prompt, {[id]:Object.assign({}, this.state.prompt[id], {[id]:prompt})})})
            }
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=>{
        });
    }

    playerListAssetClick(id){
        if(id == 'add'){

        }else if(id == 'edit'){
            this.setState({playerListAsset:this.state.playerListAsset.update('isEdit', v=>false)});
        }else if(id == 'remove'){
            const {actions} = this.props;
             actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                                                            cancel={()=>{actions.overlayerHide()}} confirm={()=>{

                                                            }}/>)
        }else if(id == 'complete'){
            this.setState({playerListAsset:this.state.playerListAsset.update('isEdit', v=>true)});
        }
    }

    assetList(id){
        if(id == 'add'){

        }else if(id == 'edit'){
            this.setState({assetList:this.state.assetList.update('isEdit', v=>false)});
        }else if(id == 'remove'){
            const {actions} = this.props;
            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                                                           cancel={()=>{actions.overlayerHide()}} confirm={()=>{

                                                            }}/>)
        }else if(id == 'complete'){
            this.setState({assetList:this.state.assetList.update('isEdit', v=>true)});
        }
    }

    updatePlayerScenePopup(){
        const {actions} = this.props;
        this.setState({curType:'playerScene'},()=>{
            let data = {}
            data.typeList = this.typeList;
            data.sceneName = '';
            actions.overlayerShow(<PlayerScenePopup title="添加计划/场景/区域" data={data} onCancel={()=>{ actions.overlayerHide()}} onConfirm={(state)=>{
                const type = state.typeList.get('index');
                if(type == 0){
                   this.updatePlayerPlanPopup();
                }else if(type == 2){
                   this.updatePlayerAreaPopup();
                }
            }}/>)
        })
    }

    updatePlayerPlanPopup(){
        const {actions} = this.props;
        this.setState({curType:'playerPlan'},()=>{
            let data = {}
            data.typeList = this.typeList;
            data.sceneName = '';
            data.startDate = moment();
            data.endDate = moment();
            data.startTime = moment();
            data.endTime = moment();
            data.week = [1,0,1,0,0,0,0];

            actions.overlayerShow(<PlayerPlanPopup title="添加计划/场景/区域" data={data} onCancel={()=>{actions.overlayerHide()}} onConfirm={(state)=>{
                const type = state.typeList.get('index');
                if(type == 1){
                      this.updatePlayerScenePopup();
                }else if(type == 2){
                    this.updatePlayerAreaPopup();
                }
            }}/>)
        })
    }

    updatePlayerAreaPopup(){
        const {actions} = this.props;
        this.setState({curType:'playerArea'},()=>{
            let data = {}
            data.typeList = this.typeList;
            data.sceneName = '';
            data.width = 1920;
            data.height = 1080;
            data.axisX = 10;
            data.axisY = 10;
            actions.overlayerShow(<PlayerAreaPopup title="添加计划/场景/区域" data={data} onCancel={()=>{actions.overlayerHide()}} onConfirm={(state)=>{
                const type = state.typeList.get('index');
                if(type == 0){
                      this.updatePlayerPlanPopup();
                }else if(type == 1){
                    this.updatePlayerScenePopup();
                }
         }}/>)
        })
    }
    areaClick(id){
        const {actions} = this.props;
        let data = {}
        if(id == "add"){
            this.updatePlayerScenePopup();
        }else if(id == "remove"){
            let tips = "是否删除选中场景与场景中所有内容";
            if(this.state.curType=="playerPlan"){
                tips = "是否删除选中计划与计划中所有内容";
            }else if(this.state.curType == "playerScene"){
                tips = "是否删除选中场景与场景中所有内容";
            }else if(this.state.curType == "playerArea"){
                tips = "是否删除选中区域与区域中所有内容";
            }

            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={tips}
                                                cancel={()=>{actions.overlayerHide()}} confirm={()=>{
                                                }}/>)
        }
    }

    playHandler() {

    }

    zoomOutHandler(){

    }

    zoomInHandler(){

    }

    saveHandler() {

    }

    savePlanHandler() {

    }

    quitHandler() {
        this.props.router.push("/mediaPublish/playerList");
    }

    positionHandler(id) {
        console.log(id);
    }

    searchSubmit() {

    }
    showModal(){
        this.setState({
            showModal:true
        })
    }
    hideModal(){
        this.setState({
            showModal:false
        })
    }
    onToggle(node){
        console.log("node:",node);
    }

    render() {
        const {curType,playerData, playerListAsset, assetList, property, prompt, assetType, assetSort, assetSearch, page,assetStyle} = this.state;
        console.log(property.position.list);
        return <div className={"container "+"mediaPublish-playerArea"}>
            <HeadBar moduleName="媒体发布" router={this.props.router}/>
            <SideBar data={playerData} onClick={this.areaClick} onToggle={this.onToggle}/>
            <Content className="player-area">
                <div className="left">
                    <div className="form-group control-container-top">
                        <div className="form-group play-container" onClick={()=>this.playHandler()}>
                            <span className="icon icon_play"></span><span>播放</span></div>
                        <div className="form-group zoom-out-container" onClick={()=>this.zoomOutHandler()}>
                            <span className="icon icon_enlarge"></span><span>放大</span></div>
                        <div className="form-group zoom-in-container" onClick={()=>this.zoomInHandler()}>
                            <span className="icon icon_reduce"></span><span>缩小</span></div>
                    </div>
                    <div className="img-container">
                        <img src=""/>
                    </div>
                    <div className="control-container-bottom">
                        <div className="form-group pull-right quit-container " onClick={()=>this.quitHandler()}>
                            <span className="icon icon_send"></span><span>退出</span>
                        </div>
                        <div className="form-group pull-right save-plan-container " onClick={()=>this.savePlanHandler()}>
                            <span className="icon icon_save save-plan"></span><span>保存计划</span>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="pro-title">属性</div>
                    <div className={"pro-container playerPlan "+(curType=='playerPlan'?'':'hidden')}>
                        <div className="row">
                            <div className="form-group  action">
                                <label className="control-label" htmlFor={property.action.key}>{property.action.title}</label>
                                <div className="input-container">
                                    <select className={ "form-control" }  value={ property.action.name } onChange={ event=>this.onChange("action", event) }>
                                        {
                                            property.action.list.map((option, index) => {
                                            let value = option.name;
                                            return <option key={ index } value={ value }>
                                                { value }
                                            </option>
                                        }) }
                                    </select>
                                    {/*<span className={prompt.action?"prompt ":"prompt hidden"}>{"仅能使用字母、数字或下划线"}</span>*/}
                                </div>
                            </div>
                            <div className="form-group position">
                                <label className="control-label">{property.position.title}</label>
                                {
                                    property.position.list.map(item=>{
                                        return <span key={item.id} className={"icon icon_"+item.id} onClick={()=>{this.positionHandler(item.id)}}></span>
                                    })
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group axis-X">
                                <label className="control-label"
                                       htmlFor={property.axisX.key}>{property.axisX.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisX.placeholder} maxLength="8"
                                           value={property.axisX.value}
                                           onChange={event=>this.onChange("axisX", event)}/>
                                    <span className={prompt.axisX?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group speed">
                                <label className="control-label"
                                       htmlFor={property.speed.key}>{property.speed.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.speed.placeholder} maxLength="8"
                                           value={property.speed.value}
                                           onChange={event=>this.onChange("speed", event)}/>
                                    <span className={prompt.speed?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group repeat">
                                <label className="control-label"
                                       htmlFor={property.repeat.key}>{property.repeat.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.repeat.placeholder} maxLength="8"
                                           value={property.repeat.value}
                                           onChange={event=>this.onChange("repeat", event)}/>
                                    <span className={prompt.repeat?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group axisY">
                                <label className="col-sm-3 control-label"
                                       htmlFor={property.axisY.key}>{property.axisY.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisY.placeholder} maxLength="8"
                                           value={property.axisY.value}
                                           onChange={event=>this.onChange("axisY", event)}/>
                                    <span className={prompt.axisY?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group resTime">
                                <label className="control-label"
                                       htmlFor={property.resTime.key}>{property.resTime.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.resTime.placeholder} maxLength="8"
                                           value={property.resTime.value}
                                           onChange={event=>this.onChange("resTime", event)}/>
                                    <span className={prompt.resTime?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group flicker">
                                <label className="control-label"
                                       htmlFor={property.flicker.key}>{property.flicker.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.flicker.placeholder} maxLength="8"
                                           value={property.flicker.value}
                                           onChange={event=>this.onChange("flicker", event)}/>
                                    <span className={prompt.flicker?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"pro-container playerArea "+(curType=='playerArea'?'':"hidden")}>
                        <div className="row">
                            <div className="form-group  area-name">
                                <label className="control-label" htmlFor={property.areaName.key}>{property.areaName.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.areaName.placeholder} maxLength="8"
                                           value={property.areaName.value}
                                           onChange={event=>this.onChange("areaName", event)}/>
                                    <span className={prompt.areaName?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group  width">
                                <label className="col-sm-3 control-label" htmlFor={property.width.key}>{property.width.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.width.placeholder} maxLength="8"
                                           value={property.width.value}
                                           onChange={event=>this.onChange("width", event)}/>
                                    <span className={prompt.width?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  height">
                                <label className="col-sm-3 control-label" htmlFor={property.height.key}>{property.height.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.height.placeholder} maxLength="8"
                                           value={property.height.value}
                                           onChange={event=>this.onChange("height", event)}/>
                                    <span className={prompt.height?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisX_a">
                                <label className="col-sm-3 control-label" htmlFor={property.axisX_a.key}>{property.axisX_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisX_a.placeholder} maxLength="8"
                                           value={property.axisX_a.value}
                                           onChange={event=>this.onChange("axisX_a", event)}/>
                                    <span className={prompt.axisX_a?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisY_a">
                                <label className="col-sm-3 control-label" htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.axisY_a.placeholder} maxLength="8"
                                           value={property.axisY_a.value}
                                           onChange={event=>this.onChange("axisY_a", event)}/>
                                    <span className={prompt.axisY_a?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"pro-container playerScene "+(curType=='playerScene'?'':"hidden")}>
                        <div className="row">
                            <div className="form-group  asset-name">
                                <label className="control-label" htmlFor={property.assetName.key}>{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                           placeholder={property.assetName.placeholder} maxLength="8"
                                           value={property.assetName.value}
                                           onChange={event=>this.onChange("assetName", event)}/>
                                    <span className={prompt.assetName?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="asset-lib">素材库</div>
                    <div className="asset-container">
                        <div className="top">
                            <Select className="asset-type" data={assetType}
                                    onChange={selectIndex=>this.onChange("assetType", selectIndex)}></Select>
                            <Select className="asset-sort" data={assetSort}
                                    onChange={selectedIndex=>this.onChange("assetSort", selectedIndex)}></Select>
                            <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')}
                                        value={assetSearch.get('value')}
                                        onChange={value=>this.onChange("assetSearch", value)}
                                        submit={this.searchSubmit}></SearchText>
                             <div className={"btn-group "+(assetList.get('isEdit')?'':'hidden')}>
                                 <button className="btn btn-primary add" onClick={this.showModal}>添加</button>
                                 <button className="btn btn-primary" onClick={()=>this.assetList('edit')}>编辑</button>
                             </div>
                             <div className={"btn-group "+(assetList.get('isEdit')?'hidden':'')}>
                                 <button className="btn btn-primary" onClick={()=>this.assetList('remove')}>删除</button>
                                 <button className="btn btn-primary" onClick={()=>this.assetList('complete')}>完成</button>
                             </div>
                            {this.state.showModal?<Material showModal={this.state.showModal} hideModal={this.hideModal}/>:null}
                        </div>
                        <div className="bottom">
                            <ul className="asset-list">
                                {
                                    assetList.get('list').map((item,index)=> {
                                        return <li key={item.get('id')}  className={index>0&&index%4==0?"margin-right":""} onClick={()=>this.assetSelect(item)}>
                                            <div className={"background "+(item.get('active')?'':'hidden')}></div>
                                            <span className="icon"></span>
                                            <span className="name">{item.get('name')}</span>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="page-container">
                                <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger pageSize={page.get('pageSize')}
                                  current={page.get('current')} total={page.get('total')} onChange={this.pageChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Content>
            <div className="mediaPublish-footer" style={assetStyle}>
                <span className="title">播放列表</span>
                <ul>
                    {
                        playerListAsset.get('list').map(item=> {
                            return <li key={item.get("id")} className="player-list-asset" onClick={()=>this.playerAssetSelect(item)}>
                                <div className={"background "+(item.get('active')?'':'hidden')}></div>
                                <span className="icon"></span>
                                <span className="name">{item.get("name")}</span>
                            </li>
                        })
                    }
                </ul>
                <div className="pull-right control-container">
                    <div className={"list-group "+(playerListAsset.get('isEdit')?'':'hidden')}>
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('add')}>添加</button>
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('edit')}>编辑</button>
                    </div>
                    <div className={"list-group "+(playerListAsset.get('isEdit')?'hidden':'')}>
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('remove')}>删除</button>
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('complete')}>完成</button>
                    </div>
                </div>
            </div>
            <Overlayer />
        </div>
    }
}

const mapStateToProps = state=> {
    return {
        sidebarNode: state.mediaPublish.get('sidebarNode')
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
            overlayerShow: overlayerShow,
            overlayerHide: overlayerHide,
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerArea);