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

import ConfirmPopup from '../../components/ConfirmPopup'
import PlayerScenePopup from '../component/PlayerScenePopup';
import PlayerPlanPopup from '../component/PlayerPlanPopup';
import PlayerAreaPopup from '../component/PlayerAreaPopup';
import Material from '../component/material';

import NotifyPopup from '../../common/containers/NotifyPopup';

import {treeViewInit} from '../../common/actions/treeView';
import {overlayerShow, overlayerHide} from '../../common/actions/overlayer';
import {addNotify, removeAllNotify} from '../../common/actions/notifyPopup'

import moment from 'moment'
import Immutable from 'immutable';
import {numbersValid} from '../../util/index';
import {getIndexByKey} from '../../util/algorithm';
export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curType: 'playerArea',
            playerData: [
                {
                    "id": "player1",
                    "type": "plan",
                    "name": "播放计划1",
                    "toggled": true,
                    "active": false,
                    "level": 1,
                    "children": [
                        {
                            "id": 'scene1',
                            "type": "scene",
                            "name": "场景1",
                            "toggled": true,
                            "class": "",
                            "active": false,
                            "children": [
                                {
                                    "id": 'area1',
                                    "type": "area",
                                    "name": "区域1",
                                    "active": true,
                                }, {
                                    "id": 'area2',
                                    "type": "area",
                                    "name": "区域2",
                                    "active": false,
                                }
                            ]
                        },
                        {
                            "id": 'scene2',
                            "type": "scene",
                            "name": "场景2",
                            "toggled": false,
                            "class": "",
                            "active": false,
                            "children": []
                        }
                    ]
                },
                {
                    "id": "player2",
                    "type": "plan",
                    "name": "播放计划2",
                    "toggled": false,
                    "level": 1,
                    "children": [
                        {
                            "id": 'scene3',
                            "type": "scene",
                            "name": "场景3",
                            "toggled": true,
                            "class": "",
                            "active": false,
                            "children": []
                        },
                    ]
                },
                {
                    "id": "player3",
                    "type": "plan",
                    "name": "播放计划3",
                    "toggled": false,
                    "level": 1,
                    "children": []
                }
            ],
            sidebarInfo: {
                collapsed: false,
                propertyCollapsed: false,
                assetLibCollapsed: false
            },
            property: {
                //方案
                project: {key: "project", title: "方案名称", placeholder:"请输入名称", value:""},
                action: {
                    key: "action",
                    title: "动作",
                    list: [{id: 1, name: '动作1'}, {id: 2, name: '动作2'}],
                    index: 0,
                    name: "动作1"
                },
                position: {
                    key: 'position',
                    title: '坐标位置',
                    list: [{id: 'left', name: '左'}, {id: 'center', name: '居中'}, {id: 'right', name: '右'},
                        {id: 'top', name: '上'}, {id: 'middle', name: '中'}, {id: 'bottom', name: '下'},],
                    id: 'left'
                },
                axisX: {key: "axisX", title: "X轴", placeholder: "输入X轴", value: ""},
                axisY: {key: "axisY", title: "Y轴", placeholder: "输入Y轴", value: ""},
                speed: {key: "speed", title: "速度", placeholder: "fps(1-100)", value: ""},
                repeat: {key: "repeat", title: "重复次数", placeholder: "1-255", value: ""},
                resTime: {key: "resTime", title: "停留时间", placeholder: "ms", value: ""},
                flicker: {key: "flicker", title: "闪烁次数", placeholder: "1-255", value: ""},

                //区域
                areaName: {key: "areaName", title: "区域名称", placeholder: '区域名称', value: ""},
                width: {key: "width", title: "宽度", placeholder: '请输入宽度', value: ""},
                height: {key: "height", title: "高度", placeholder: '请输入高度', value: ""},
                axisX_a: {key: "axisX_a", title: "X轴", placeholder: '请输入X轴坐标', value: ""},
                axisY_a: {key: "axisY_a", title: "Y轴", placeholder: '请输入Y轴坐标', value: ""},

                //素材
                assetName: {key: "assetName", title: "素材名称", placeholder: '素材名称', value: ""},

                //图片素材
                displayMode: {key: "displayMode", title: "显示方式", list: [{id: 1, name: '铺满'}, {id: 2, name: '原始比例'}, {id: 3, name: '4:3'}, {id: 4, name: '5:4'}, {id: 5, name: '16.9'}],index: 0, name: ""},
                animation: {key: "animation", title: "动画效果", 
                    list: [
                        {id: 1, name: '立即显示'}, {id: 2, name: '闪烁'}, {id: 3, name: '长串左移'}, 
                        {id: 4, name: '上移'}, {id: 5, name: '下移'}, {id: 6, name: '左移'}, {id: 7, name: '右移'}, 
                        {id: 8, name: '自上而下展现'}, {id: 9, name: '自下而上展现'},{id: 10, name: '自右而左展现'}, {id: 11, name: '自左而右展现'}, 
                        {id: 12, name: '自上而下百叶窗'}, {id: 13, name: '自下而上百叶窗'}, {id: 14, name: '自右而左百叶窗'}, {id: 15, name: '自左而右百叶窗'}, 
                        {id: 16, name: '自上而下棋盘格'}, {id: 17, name: '自下而上棋盘格'}, {id: 18, name: '自右而左棋盘格'}, {id: 19, name: '自左而右棋盘格'}, 
                        {id: 20, name: '上下向中间合拢'}, {id: 21, name: '中间向上下展开'}, {id: 22, name: '左右向中间合拢'}, {id: 23, name: '中间向左右展开'},
                        {id: 24, name: '矩形自四周向中心合拢'}, {id: 25, name: '矩形自中心向四周展开'}, {id: 26, name: '向左拉幕'}, {id: 27, name: '向右拉幕'},
                        {id: 28, name: '向上拉幕'}, {id: 29, name: '向下拉幕'}, {id: 30, name: '矩形自左下向右上展现'}, {id: 31, name: '矩形自左上向右下展现'},
                        {id: 32, name: '矩形自右下向左上展现'}, {id: 33, name: '矩形自右上向左下展现'}, {id: 34, name: '斜线自左上向右下展现'}, {id: 35, name: '斜线自右下向左上展现'},
                        {id: 36, name: '随机'}                
                    ],index: 0, name: ""},
                playDuration: {key: "playDuration", title: "播放时长", placeholder: '秒/s', value: ""},
                playSpeed: {key: "playSpeed", title: "播放速度", placeholder: 'ms', value: ""},

                //视频素材
                playTimes:{key: "playTimes", title: "播放次数", placeholder: '次', value: ""},
                playType:{key: "playType", title: "播放类型", list: [{id: 1, name: '片段播放'}, {id: 2, name: '完整播放'}],index: 0, name: "片段播放"},
                clipsRage:{key: "clipsRage", title: "片段范围", placeholder: '次', value: ""},
                scaling: {key: "scaling", title: "缩放比例", list: [{id: 1, name: '铺满'}, {id: 2, name: '原始比例'}, {id: 3, name: '4:3'}, {id: 4, name: '5:4'}, {id: 5, name: '16.9'}],index: 0, name: ""},
                volume: {key: "volume", title: "音量", list: [{id: 1, name: '100'}, {id: 2, name: '90'}, {id: 3, name: '80'}, 
                {id: 4, name: '70'}, {id: 5, name: '60'}, {id: 6, name: '50'}, {id: 7, name: '40'}, {id: 8, name: '30'}, {id: 9, name: '20'},{id: 10, name: '10'},{id: 11, name: '11'}],index: 0, name: ""},
            },
            assetType: Immutable.fromJS({list: [{id: 1, value: '类别1'}, {id: 2, value: '类别2'}], index: 0, value: '类别1'}),
            assetSort: Immutable.fromJS({
                list: [{id: 1, value: '素材文字'}, {id: 2, value: '素材图片'}],
                index: 0,
                value: '素材文字'
            }),
            assetSearch: Immutable.fromJS({placeholder: '输入素材名称', value: ''}),
            assetList: Immutable.fromJS({
                list: [{id: 1, name: '素材1', active: true}, {id: 2, name: '素材2'}, {id: 3, name: '素材3'},
                    {id: 4, name: '素材4'}], id: 1, name: '素材1', isEdit: true
            }),
            playerListAsset: Immutable.fromJS({
                list: [{id: 1, name: '素材1'}, {id: 2, name: '素材2'}, {id: 3, name: '素材3'},
                    {id: 4, name: '素材4'}, {id: 5, name: '素材5'}, {id: 6, name: '素材6'}],
                id: 1, name: '素材1', isEdit: true
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                project: true,
                action: false, axisX: true, axisY: true, speed: true, repeat: true, resTime: true, flicker: true,
                areaName: true, width: true, height: true, axisX_a: true, axisY_a: true,
                assetName: true,playTime:true, playSpeed:true,
            },

            showModal: false,

            assetStyle: {"bottom": "0px"},
            controlStyle:{"left":"auto", "right":"auto"},
//拖拽
            mouseXY: [0, 0],
            mouseCircleDelta: [0, 0],
            lastPress: null,
            isPressed: false,
//播放列表单击
            isClick:false,
        }

        this.typeList = [{id: 'playerPlan', name: '播放计划'}, {id: 'playerScene', name: '场景'}, {
            id: 'playerArea',
            name: "区域"
        }]

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
        this.sidebarClick = this.sidebarClick.bind(this);

        this.addClick = this.addClick.bind(this);
        this.assetLibRemove = this.assetLibRemove.bind(this);
        this.playerAssetRemove = this.playerAssetRemove.bind(this);
        this.playerAssetMove = this.playerAssetMove.bind(this);
        this.projectClick = this.projectClick.bind(this);

        this.updatePlayerPlan = this.updatePlayerPlan.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updatePlayerPlanPopup = this.updatePlayerPlanPopup.bind(this);
        this.updatePlayerScenePopup = this.updatePlayerScenePopup.bind(this);
        this.updatePlayerAreaPopup = this.updatePlayerAreaPopup.bind(this);

        this.setSize = this.setSize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.updatePlayerPlan();
        this.mounted && this.setSize();
        window.onresize = event=> {
            this.mounted && this.setSize();
        }

        console.log(this.props.router);
    }

    componentDidMount() {
        // window.addEventListener("mousemove", this.handleMouseMove, true);
        // window.addEventListener("mouseup", this.handleMouseUp, true);
        console.log(this.props.router);
    }

    handleMouseMove({pageX, pageY}) {
        const {isPressed, mouseCircleDelta:[dx, dy]} =  this.state;
        if (isPressed) {
            const mouseXY = [pageX - dx, pageY - dy];
            this.setState({mouseXY});
        }
    }

    handleMouseDown(item, [pressX, pressY], {pageX, pageY}) {
        this.assetSelect(item);
        this.setState({
            lastPress: item.get('id'),
            isPressed: true,
            mouseCircleDelta: [pageX - pressX, pageY - pressY],
            mouseXY: [pressX, pressY]
        })
    }

    handleMouseUp() {
        this.setState({isPressed: false, mouseCircleDelta: [0, 0]});
    }

    componentWillUnmount() {
        this.mounted = false;
        this.props.actions.removeAllNotify();
    }

    setSize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let cleft = "auto";
        let cright = "auto";
        if(width<1578){
            cright = 0;
        }else{
            cleft = "535px";
        }
        this.setState({assetStyle: {"bottom": (height < 796 ? 0 : height - 796) + "px"}, controlStyle:{"left":cleft, "right":cright}});
    }

    updatePlayerPlan() {
        const {playerData} = this.state;
        const {actions} = this.props;
        actions && actions.treeViewInit(playerData);
    }

    assetSelect(item) {
        console.log(item.toJS());
        this.state.assetList = this.state.assetList.update('id', v=>item.get('id'));
        this.setState({assetList: this.state.assetList.update('name', v=>item.get('name'))});
        // const curIndex = getIndexByKey(this.state.assetList.get('list'), 'id', item.get('id'));
        // this.setState({assetList: this.state.assetList.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    playerAssetSelect(item) {
        console.log(item.toJS());
        this.state.playerListAsset = this.state.playerListAsset.update('id', v=>item.get('id'));
        this.setState({isClick:true, curType:"playerVideoAsset",playerListAsset:this.state.playerListAsset.update('name', v=>item.get('name'))});
        // const curIndex = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.get('id'));
        // this.setState({playerListAsset: this.state.playerListAsset.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;
        if (id == "playerList" || id == "sceneList" || id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v=>value);
            this.setState({[id]: this.state[id].update('value', v=>this.state[id].getIn(["list", value, "value"]))});
        }
        else if (id == "assetSearch") {
            this.setState({assetSearch: this.state.assetSearch.update('value', v=>value)});
        } else {

            if (id == "action") {
                const curIndex = value.target.selectedIndex;
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        [id]: Object.assign({}, this.state.property[id], {
                            index: curIndex,
                            name: this.state.property[id].list[curIndex].name
                        })
                    })
                })
            } else {
                const val = value.target.value;
                if (!numbersValid(val)) {
                    prompt = true;
                }

                this.setState({
                    property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: val})}),
                    prompt: Object.assign({}, this.state.prompt, {[id]: Object.assign({}, this.state.prompt[id], {[id]: prompt})})
                })
            }
        }
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({page: page}, ()=> {
        });
    } 

    playerListAssetClick(id) {
        if (id == 'add') {
            let addList = [];
            const {assetList} = this.state;
            assetList.get('list').map(item=> {
                if (item.get('active')) {
                    addList.push(item);
                }
            })

            if (addList.length == 0) {
                this.props.actions.addNotify(0, '请选中右边素材库素材');
            }
        } else if (id == 'edit') {
            this.setState({playerListAsset: this.state.playerListAsset.update('isEdit', v=>false)});
        } else if (id == 'remove') {
            const {actions} = this.props;
            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                                                cancel={()=>{actions.overlayerHide()}} confirm={()=>{

                                                            }}/>)
        } else if (id == 'complete') {
            this.setState({playerListAsset: this.state.playerListAsset.update('isEdit', v=>true)});
        }
    }

    assetList(id) {
        if (id == 'add') {

        } else if (id == 'edit') {
            this.setState({assetList: this.state.assetList.update('isEdit', v=>false)});
        } else if (id == 'remove') {
            const {actions} = this.props;
            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                                                cancel={()=>{actions.overlayerHide()}} confirm={()=>{

                                                            }}/>)
        } else if (id == 'complete') {
            this.setState({assetList: this.state.assetList.update('isEdit', v=>true)});
        }
    }

    projectClick(id){
        console.log(id);
        switch(id){
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    addClick(item){
        console.log('addClick:', item.toJS());
    }

    assetLibRemove(item){
        console.log('assetLibRemove:', item.toJS());
    }

    playerAssetRemove(item){
        console.log('playerAssetRemove:', item.toJS());
    }

    playerAssetMove(id){
        console.log('playerAssetMove:', id);
    }

    updatePlayerScenePopup() {
        const {actions} = this.props;

        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        actions.overlayerShow(<PlayerScenePopup title="添加计划/场景/区域" data={data} onChange={state=>{
                 const type = state.typeList.get('index');
                if(type == 0){
                   this.updatePlayerPlanPopup();
                }else if(type == 2){
                   this.updatePlayerAreaPopup();
                }
            }} onCancel={()=>{ actions.overlayerHide()}} onConfirm={(state)=>{

            }}/>)

    }

    updatePlayerPlanPopup() {
        const {actions} = this.props;
        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        data.startDate = moment();
        data.endDate = moment();
        data.startTime = moment();
        data.endTime = moment();
        data.week = [1, 0, 1, 0, 0, 0, 0];

        actions.overlayerShow(<PlayerPlanPopup title="添加计划/场景/区域" data={data} onChange={state=>{
                 const type = state.typeList.get('index');
                if(type == 1){
                      this.updatePlayerScenePopup();
                }else if(type == 2){
                    this.updatePlayerAreaPopup();
                }
            }} onCancel={()=>{actions.overlayerHide()}} onConfirm={(state)=>{

            }}/>)
    }

    updatePlayerAreaPopup() {
        const {actions} = this.props;

        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        data.width = 1920;
        data.height = 1080;
        data.axisX = 10;
        data.axisY = 10;
        actions.overlayerShow(<PlayerAreaPopup title="添加计划/场景/区域" data={data} onChange={state=>{
                const type = state.typeList.get('index');
                if(type == 0){
                      this.updatePlayerPlanPopup();
                }else if(type == 1){
                    this.updatePlayerScenePopup();
                }
            }} onCancel={()=>{actions.overlayerHide()}} onConfirm={(state)=>{

         }}/>)

    }

    areaClick(id) {
        const {actions} = this.props;
        let data = {}
        if (id == "add") {
            switch (this.state.curType) {
                case "playerPlan":
                    this.updatePlayerPlanPopup();
                    break;
                case "playerScene":
                    this.updatePlayerScenePopup();
                    break;
                case "playerArea":
                    this.updatePlayerAreaPopup();
                    break;
            }
        } else if (id == "remove") {
            let tips = "是否删除选中场景与场景中所有内容";
            switch (this.state.curType) {
                case "playerPlan":
                    tips = "是否删除选中计划与计划中所有内容";
                    break;
                case "playerScene":
                    tips = "是否删除选中场景与场景中所有内容";
                    break;
                case "playerArea":
                    tips = "是否删除选中区域与区域中所有内容";
                    break;
            }

            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={tips}
                                                cancel={()=>{actions.overlayerHide()}} confirm={()=>{
                                                }}/>)
        }else if(id == "project"){
            this.setState({curType:"playerProject", isClick:false});
        }
    }

    playHandler() {

    }

    zoomOutHandler() {

    }

    zoomInHandler() {

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

    showModal() {
        this.setState({
            showModal: true
        })
    }

    hideModal() {
        this.setState({
            showModal: false
        })
    }

    onToggle(node) {
        console.log("node:", node);
        let type = "scene";
        switch (node.type) {
            case "scene":
                type = 'playerScene';
                break;
            case 'plan':
                type = 'playerPlan';
                break;
            case 'area':
                type = 'playerArea';
                break;
        }

        this.setState({curType: type, isClick:false});
    }

    sidebarClick(id) {
        this.setState({sidebarInfo: Object.assign({}, this.state.sidebarInfo, {[id]: !this.state.sidebarInfo[id]})});
    }

    render() {
        const {
            curType, playerData, sidebarInfo, playerListAsset, assetList, property, prompt, assetType, assetSort, assetSearch, page, assetStyle,controlStyle,
            lastPress, isPressed, mouseXY,isClick
        } = this.state;
        const {router} = this.props;
        const routerState = router.location.state;
        const projectItem = routerState?routerState.item:null;

        console.log(property.position.list);
        return <div className={"container "+"mediaPublish-playerArea "+(sidebarInfo.collapsed?'sidebar-collapse':'')}>
            <HeadBar moduleName="媒体发布" router={router}/>
            <SideBar data={playerData} title={projectItem && projectItem.name} isClick={isClick} onClick={this.areaClick} onToggle={this.onToggle}/>
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
                    <div className="control-container-bottom" style={controlStyle}>
                        <div className="form-group pull-right quit-container " onClick={()=>this.quitHandler()}>
                            <span className="icon icon_send"></span><span>退出</span>
                        </div>
                        <div className="form-group pull-right save-plan-container "
                             onClick={()=>this.savePlanHandler()}>
                            <span className="icon icon_save save-plan"></span><span>保存计划</span>
                        </div>
                    </div>
                </div>

            </Content>
            <div className="mediaPublish-footer" style={assetStyle}>
                <span className="title">播放列表</span>
                <ul>
                    {
                        playerListAsset.get('list').map(item=> {
                            const itemId = item.get('id');
                            const curId = playerListAsset.get('id');
                            return <li key={itemId} className="player-list-asset" onClick={()=>this.playerAssetSelect(item)}>
                                <div className={"background "+(curId==itemId?'':'hidden')}></div>
                                <span className="icon"></span>
                                <span className="name">{item.get("name")}</span>
                                {curId==itemId && <span className="glyphicon glyphicon-triangle-left move-left" title="左移" onClick={(event)=>{event.stopPropagation();this.playerAssetMove('left')}}></span>}
                                {curId==itemId && <span className="glyphicon glyphicon-triangle-right move-right" title="右移" onClick={(event)=>{event.stopPropagation();this.playerAssetMove('right')}}></span>}
                                {!playerListAsset.get('isEdit') && <span className="icon_delete_c remove" title="删除" onClick={(event)=>{event.stopPropagation();this.playerAssetRemove(item)}}></span>}
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
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('remove')}>删除
                        </button>
                        <button className="btn btn-primary" onClick={()=>this.playerListAssetClick('complete')}>完成
                        </button>
                    </div>
                </div>
            </div>
            <div className={"right sidebar-info "}>
                <div className="row collapse-container" onClick={ () => this.sidebarClick('collapsed') }>
                    <span className={ sidebarInfo.collapsed ? "icon_horizontal" : "icon_verital" }></span>
                </div>
                <div className="panel panel-default asset-property">
                    <div className="panel-heading pro-title" onClick={()=>{!sidebarInfo.collapsed && this.sidebarClick('propertyCollapsed')}}>
                        <span className={sidebarInfo.collapsed?"icon_info":
                        "glyphicon "+(sidebarInfo.propertyCollapsed?"glyphicon-triangle-right":"glyphicon-triangle-bottom")}></span>属性
                    </div>
                    <div className={"panel-body "+(sidebarInfo.propertyCollapsed?'property-collapsed':'')}>
                        <div className={"pro-container playerProject "+(curType=='playerProject'?'':'hidden')}>
                            <div className="row">
                                <div className="form-group project-name">
                                    <label className="control-label" htmlFor={property.project.key}>{property.project.title}</label>
                                    <div className="input-container">
                                        <input type="text" className={ "form-control " }
                                               placeholder={property.project.placeholder} maxLength="16"
                                               value={property.project.value}
                                               onChange={event=>this.onChange("project", event)}/>
                                        <span className={prompt.project?"prompt ":"prompt hidden"}>{"请输入名称"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary project-apply pull-right" onClick={()=>{this.projectClick('apply')}}>应用</button>
                                <button className="btn btn-primary project-reset pull-right" onClick={()=>{this.projectClick('reset')}}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container playerPlan "+(curType=='playerPlan'?'':'hidden')}>
                            <div className="row">
                                <div className="form-group  action">
                                    <label className="control-label"
                                           htmlFor={property.action.key}>{property.action.title}</label>
                                    <div className="input-container">
                                        <select className={ "form-control" } value={ property.action.name }
                                                onChange={ event=>this.onChange("action", event) }>
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
                                        property.position.list.map(item=> {
                                            return <span key={item.id} className={"icon icon_"+item.id}
                                                         onClick={()=>{this.positionHandler(item.id)}}></span>
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
                            <div className="form-group  area-name">
                                <label className="control-label"
                                        htmlFor={property.areaName.key}>{property.areaName.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                            placeholder={property.areaName.placeholder} maxLength="8"
                                            value={property.areaName.value}
                                            onChange={event=>this.onChange("areaName", event)}/>
                                    <span className={prompt.areaName?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  width">
                                <label className="col-sm-3 control-label"
                                        htmlFor={property.width.key}>{property.width.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                            placeholder={property.width.placeholder} maxLength="8"
                                            value={property.width.value}
                                            onChange={event=>this.onChange("width", event)}/>
                                    <span className={prompt.width?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  height">
                                <label className="col-sm-3 control-label"
                                        htmlFor={property.height.key}>{property.height.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                            placeholder={property.height.placeholder} maxLength="8"
                                            value={property.height.value}
                                            onChange={event=>this.onChange("height", event)}/>
                                    <span className={prompt.height?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisX_a">
                                <label className="col-sm-3 control-label"
                                        htmlFor={property.axisX_a.key}>{property.axisX_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                            placeholder={property.axisX_a.placeholder} maxLength="8"
                                            value={property.axisX_a.value}
                                            onChange={event=>this.onChange("axisX_a", event)}/>
                                    <span className={prompt.axisX_a?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisY_a">
                                <label className="col-sm-3 control-label"
                                        htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={ "form-control " }
                                            placeholder={property.axisY_a.placeholder} maxLength="8"
                                            value={property.axisY_a.value}
                                            onChange={event=>this.onChange("axisY_a", event)}/>
                                    <span className={prompt.axisY_a?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"pro-container playerScene "+(curType=='playerScene'?'':"hidden")}>
                            <div className="row">
                                <div className="form-group  asset-name">
                                    <label className="control-label"
                                           htmlFor={property.assetName.key}>{property.assetName.title}</label>
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
                        <div className={"pro-container playerPicAsset "+(curType=='playerPicAsset'?'':"hidden")}>
                            <div className="form-group">
                                <label className="control-label">{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" disabled="disabled" value={property.assetName.value} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.displayMode.title}</label>
                                <div className="input-container">
                                    <select className= "form-control"  value={ property.displayMode.name }
                                            onChange={ event=>this.onChange("displayMode", event) }>
                                        {
                                            property.displayMode.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={ index } value={ value }>
                                                    { value }
                                                </option>
                                            }) }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.animation.title}</label>
                                <div className="input-container">
                                    <select className= "form-control"  value={ property.animation.name }
                                            onChange={ event=>this.onChange("animation", event) }>
                                        {
                                            property.animation.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={ index } value={ value }>
                                                    { value }
                                                </option>
                                            }) }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playDuration.title}</label>
                                <div className="input-container">
                                    <input type="text" className= "form-control" 
                                            placeholder={property.playDuration.placeholder} maxLength="8"
                                            value={property.playDuration.value}
                                            onChange={event=>this.onChange("playDuration", event)}/>
                                    <span className={prompt.playDuration?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playSpeed.title}</label>
                                <div className="input-container">
                                    <input type="text" className= "form-control" 
                                            placeholder={property.playSpeed.placeholder} maxLength="8"
                                            value={property.playSpeed.value}
                                            onChange={event=>this.onChange("playTime", event)}/>
                                    <span className={prompt.playSpeed?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                        </div>
                        <div className={"pro-container playerVideoAsset "+(curType=='playerVideoAsset'?'':"hidden")}>
                            <div className="form-group">
                                <label className="control-label">{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" disabled="disabled" value={property.assetName.value} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playTimes.title}</label>
                                <div className="input-container">
                                    <input type="text" className= "form-control" 
                                            placeholder={property.playTimes.placeholder} maxLength="8"
                                            value={property.playTimes.value}
                                            onChange={event=>this.onChange("playTimes", event)}/>
                                    <span className={prompt.playTimes?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.scaling.title}</label>
                                <div className="input-container">
                                    <select className= "form-control" value={ property.scaling.name }
                                            onChange={ event=>this.onChange("scaling", event) }>
                                        {
                                            property.scaling.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={ index } value={ value }>
                                                    { value }
                                                </option>
                                            }) }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.playType.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={ property.playType.name }
                                            onChange={ event=>this.onChange("playType", event) }>
                                        {
                                            property.playType.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={ index } value={ value }>
                                                    { value }
                                                </option>
                                            }) }
                                    </select>
                                </div>
                            </div>
                            {
                                property.playType.name == "片段播放" && (<div className="form-group clipsRage">
                                    <label className="control-label">{property.clipsRage.title}</label>
                                    <div className="input-container">
                                        <input className="form-control" id="time1" type="time" value={''} onChange={event=>this.onChange("clipsRage1", event)}/>
                                        <span className="text">至</span>
                                        <input className="form-control" id="time2" type="time" value={''} onChange={event=>this.onChange("clipsRage2", event)}/>
                                        <span className={prompt.clipsRage?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>)
                            }
                            <div className="form-group volume">
                                <label className="control-label">{property.volume.title}</label>
                                <div className="input-container">
                                    <select className= "form-control"  value={ property.volume.name }
                                            onChange={ event=>this.onChange("volume", event) }>
                                        {
                                            property.volume.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={ index } value={ value }>
                                                    { value }
                                                </option>
                                            }) }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel panel-default asset-lib">
                    <div className="panel-heading lib-title" onClick={()=>{!sidebarInfo.collapsed && this.sidebarClick('assetLibCollapsed')}}>
                        <span className={sidebarInfo.collapsed?"icon_file":"glyphicon "+(sidebarInfo.assetLibCollapsed?"glyphicon-triangle-right":"glyphicon-triangle-bottom")}></span>素材库
                    </div>
                    <div className={"panel-body "+(sidebarInfo.assetLibCollapsed?'assetLib-collapsed':'')}>
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
                                    <button className="btn btn-primary add" onClick={this.showModal}>导入</button>
                                    <button className="btn btn-primary" onClick={()=>this.assetList('edit')}>编辑</button>
                                </div>
                                <div className={"btn-group "+(assetList.get('isEdit')?'hidden':'')}>
                                    <button className="btn btn-primary" onClick={()=>this.assetList('remove')}>删除
                                    </button>
                                    <button className="btn btn-primary" onClick={()=>this.assetList('complete')}>完成
                                    </button>
                                </div>
                                <Material showModal={this.state.showModal} hideModal={this.hideModal} />
                            </div>
                            <div className="bottom">
                                <ul className="asset-list">
                                    {
                                        assetList.get('list').map((item, index)=> {
                                            let x, y;
                                            const id = item.get('id');
                                            const curId = assetList.get('id');
                                            if (id == lastPress && isPressed) {
                                                [x, y] = mouseXY;
                                            } else {
                                                [x, y] = [0, 0];
                                            }

                                            return <li key={id} className={index>0&&index%4==0?"margin-right":""}
                                                       style={{transform: `translate(${x}px,${y}px)`, zIndex:id == lastPress?99:0}}
                                                       onClick={()=>this.assetSelect(item)}>
                                                    {/*onMouseDown={event=>{this.handleMouseDown(item, [x, y],{pageX:event.pageX, pageY:event.pageY})}}*/}
                                                <div className={"background "+(curId==id?'':'hidden')}></div>
                                                <span className="icon"></span>
                                                <span className="name">{item.get('name')}</span>
                                                {!playerListAsset.get('isEdit') && <span className="icon_add_c add" title="添加" onClick={(event)=>{event.stopPropagation();this.addClick(item)}}></span>}
                                                {!assetList.get('isEdit') && <span className="icon_delete_c remove" title="删除" onClick={(event)=>{event.stopPropagation();this.assetLibRemove(item)}}></span>}
                                            </li>
                                        })
                                    }
                                </ul>
                                <div className="page-container">
                                    <Page className={"page "+(page.get('total')==0?"hidden":"")} showSizeChanger
                                          pageSize={page.get('pageSize')}
                                          current={page.get('current')} total={page.get('total')}
                                          onChange={this.pageChange}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NotifyPopup />
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
            addNotify: addNotify,
            removeAllNotify: removeAllNotify
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayerArea);