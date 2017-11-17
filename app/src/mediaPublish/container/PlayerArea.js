/**
 * Created by a on 2017/10/20.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
import TimingPlanPopup from '../component/TimingPlanPopup';

import NotifyPopup from '../../common/containers/NotifyPopup';

import { treeViewInit } from '../../common/actions/treeView';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup'

import moment from 'moment'
import Immutable from 'immutable';

import { numbersValid } from '../../util/index';
import { getIndexByKey } from '../../util/algorithm';
import { TimePicker, DatePicker, Checkbox } from 'antd';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
const CheckboxGroup = Checkbox.Group;

import { momentDateFormat, dateStrReplaceZh } from '../../util/time';
import { weekReplace } from '../util/index';

export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curNode: null,
            curType: 'timingPlan',
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
                project: { key: "project", title: "方案名称", placeholder: "请输入名称", value: "" },
                //计划
                plan: { key: "plan", title: "计划名称", placeholder: "请输入名称", value: "" },
                startDate: { key: "startDate", title: "开始日期", placeholder: "点击选择开始日期", value: () => { moment() } },
                endDate: { key: "endDate", title: "结束日期", placeholder: "点击选择结束日期", value: "" },
                startTime: { key: "startTime", title: "开始时间", placeholder: "点击选择开始时间", value: "" },
                endTime: { key: "endTime", title: "结束时间", placeholder: "点击选择结束时间", value: "" },
                week: {
                    key: "week", title: "工作日",
                    list: [{ label: "周一", value: 1 }, { label: "周二", value: 2 },
                    { label: "周三", value: 3 }, { label: "周四", value: 4 },
                    { label: "周五", value: 5 }, { label: "周六", value: 6 },
                    { label: "周日", value: 7 }],
                    value: [1, 2]
                },
                action: {
                    key: "action", title: "动作", list: [{ id: 1, name: '动作1' }, { id: 2, name: '动作2' }], index: 0, name: "动作1"
                },
                position: {
                    key: 'position', title: '坐标位置',
                    list: [{ id: 'left', name: '左' }, { id: 'center', name: '居中' }, { id: 'right', name: '右' },
                    { id: 'top', name: '上' }, { id: 'middle', name: '中' }, { id: 'bottom', name: '下' },],
                    id: 'left'
                },
                axisX: { key: "axisX", title: "X轴", placeholder: "输入X轴", value: "" },
                axisY: { key: "axisY", title: "Y轴", placeholder: "输入Y轴", value: "" },
                speed: { key: "speed", title: "速度", placeholder: "fps(1-100)", value: "" },
                repeat: { key: "repeat", title: "重复次数", placeholder: "1-255", value: "" },
                resTime: { key: "resTime", title: "停留时间", placeholder: "ms", value: "" },
                flicker: { key: "flicker", title: "闪烁次数", placeholder: "1-255", value: "" },

                //周期插播计划
                cycleName: { key: "cycleName", title: "计划名称", placeholder: '请输入名称', value: "" },
                cycleInterval: { key: "cycleInterval", title: "时间间隔", placeholder: '秒', value: "" },
                cyclePause: { key: "cyclePause", title: "暂停标志", list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }], index: 0, name: "暂停" },
                cycleDate: { key: "cycleDate", title: "指定日期", appoint: false },
                cycleStartDate: { key: "cycleStartDate", title: "开始日期", placeholder: "点击选择开始日期", value: moment() },
                cycleEndDate: { key: "cycleEndDate", title: "结束日期", placeholder: "点击选择结束日期", value: moment() },
                cycleTime: { key: "cycleDate", title: "指定时间", appoint: false },
                cycleStartTime: { key: "cycleStartTime", title: "开始时间", placeholder: "点击选择开始时间", value: moment() },
                cycleEndTime: { key: "cycleEndTime", title: "结束时间", placeholder: "点击选择结束时间", value: moment() },
                cycleWeek: {
                    key: "cycleWeek", title: "工作日",
                    list: [{ label: "周一", value: 1 }, { label: "周二", value: 2 },
                    { label: "周三", value: 3 }, { label: "周四", value: 4 },
                    { label: "周五", value: 5 }, { label: "周六", value: 6 },
                    { label: "周日", value: 7 }],
                    value: [1, 2]
                },

                //定时插播计划
                timingName: { key: "timingName", title: "计划名称", placeholder: '请输入名称', value: "" },
                timingList: {
                    key: "timingList", title: "定时插播",
                    list: [{ id: 1, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [1, 2, 5] },
                    { id: 2, startTime: moment(), startDate: moment(), endDate: moment(), appointDate: false, week: [2, 4, 6] },],
                    index: 0, id: 1,
                    sort: { list: [{ id: 1, name: "时间排序" }, { id: 2, name: "日期排序" }], index: 0, name: "时间排序" },
                },
                timingPlayMode: { key: "timingPlayMode", title: "播放方式", list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], index: 0, name: "按次播放" },
                timingPlayModeCount: { key: "timingPlayModeCount", title: "播放次数", placeholder: '次', value: "", active: true },
                timingPause: { key: "timingPause", title: "暂停标志", list: [{ id: '1', name: '暂停' }, { id: '2', name: '不暂停' }], index: 0, name: "暂停" },

                //区域
                areaName: { key: "areaName", title: "区域名称", placeholder: '区域名称', value: "" },
                width: { key: "width", title: "宽度", placeholder: '请输入宽度', value: "" },
                height: { key: "height", title: "高度", placeholder: '请输入高度', value: "" },
                axisX_a: { key: "axisX_a", title: "X轴", placeholder: '请输入X轴坐标', value: "" },
                axisY_a: { key: "axisY_a", title: "Y轴", placeholder: '请输入Y轴坐标', value: "" },

                //场景名称
                sceneName: { key: "assetName", title: "素材名称", placeholder: '素材名称', value: "" },
                playMode: { key: "playMode", title: "播放方式", list: [{ id: 1, name: "按次播放" }, { id: 2, name: "按时长播放" }, { id: 3, name: "循环播放" }], index: 0, name: "按次播放" },
                playModeCount: { key: "playModeCount", title: "播放次数", placeholder: '次', value: "", active: true },

                //素材
                assetName: { key: "assetName", title: "素材名称", placeholder: '素材名称', value: "" },

                //文字素材
                textContent: { key: 'textContent', title: '文本内容', value: '' },
                fontType: { key: 'fontType', title: '选择字体', list: [{ id: 1, name: '微软雅黑' }, { id: 2, name: '宋体' },{id:3,name:'serif'},{id:4,name:'monospace'}], index: 0, name: '微软雅黑' },

                //图片素材
                displayMode: { key: "displayMode", title: "显示方式", list: [{ id: 1, name: '铺满' }, { id: 2, name: '原始比例' }, { id: 3, name: '4:3' }, { id: 4, name: '5:4' }, { id: 5, name: '16.9' }], index: 0, name: "铺满" },
                animation: {
                    key: "animation", title: "动画效果",
                    list: [
                        { id: 1, name: '立即显示' }, { id: 2, name: '闪烁' }, { id: 3, name: '长串左移' },
                        { id: 4, name: '上移' }, { id: 5, name: '下移' }, { id: 6, name: '左移' }, { id: 7, name: '右移' },
                        { id: 8, name: '自上而下展现' }, { id: 9, name: '自下而上展现' }, { id: 10, name: '自右而左展现' }, { id: 11, name: '自左而右展现' },
                        { id: 12, name: '自上而下百叶窗' }, { id: 13, name: '自下而上百叶窗' }, { id: 14, name: '自右而左百叶窗' }, { id: 15, name: '自左而右百叶窗' },
                        { id: 16, name: '自上而下棋盘格' }, { id: 17, name: '自下而上棋盘格' }, { id: 18, name: '自右而左棋盘格' }, { id: 19, name: '自左而右棋盘格' },
                        { id: 20, name: '上下向中间合拢' }, { id: 21, name: '中间向上下展开' }, { id: 22, name: '左右向中间合拢' }, { id: 23, name: '中间向左右展开' },
                        { id: 24, name: '矩形自四周向中心合拢' }, { id: 25, name: '矩形自中心向四周展开' }, { id: 26, name: '向左拉幕' }, { id: 27, name: '向右拉幕' },
                        { id: 28, name: '向上拉幕' }, { id: 29, name: '向下拉幕' }, { id: 30, name: '矩形自左下向右上展现' }, { id: 31, name: '矩形自左上向右下展现' },
                        { id: 32, name: '矩形自右下向左上展现' }, { id: 33, name: '矩形自右上向左下展现' }, { id: 34, name: '斜线自左上向右下展现' }, { id: 35, name: '斜线自右下向左上展现' },
                        { id: 36, name: '随机' }
                    ], index: 0, name: "立即显示"
                },
                playDuration: { key: "playDuration", title: "播放时长", placeholder: '秒/s', value: "" },
                playSpeed: { key: "playSpeed", title: "播放速度", placeholder: 'ms', value: "" },

                //视频素材
                playTimes: { key: "playTimes", title: "播放次数", placeholder: '次', value: "" },
                playType: { key: "playType", title: "播放类型", list: [{ id: 1, name: '片段播放' }, { id: 2, name: '完整播放' }], index: 0, name: "片段播放" },
                clipsRage: { key: "clipsRage", title: "片段范围", clipsRage1: moment('00:00:00', 'HH:mm:ss'), clipsRage2: moment('00:00:00', 'HH:mm:ss') },
                scaling: { key: "scaling", title: "缩放比例", list: [{ id: 1, name: '铺满' }, { id: 2, name: '原始比例' }, { id: 3, name: '4:3' }, { id: 4, name: '5:4' }, { id: 5, name: '16.9' }], index: 0, name: "铺满" },
                volume: {
                    key: "volume", title: "音量", list: [{ id: 1, name: '100' }, { id: 2, name: '90' }, { id: 3, name: '80' },
                    { id: 4, name: '70' }, { id: 5, name: '60' }, { id: 6, name: '50' }, { id: 7, name: '40' }, { id: 8, name: '30' }, { id: 9, name: '20' }, { id: 10, name: '10' }, { id: 11, name: '11' }], index: 0, name: "100"
                },
            },
            assetType: Immutable.fromJS({ list: [{ id: 1, value: '类别1' }, { id: 2, value: '类别2' }], index: 0, value: '类别1' }),
            assetSort: Immutable.fromJS({
                list: [{ id: 1, value: '素材文字' }, { id: 2, value: '素材图片' }],
                index: 0,
                value: '素材文字'
            }),
            assetSearch: Immutable.fromJS({ placeholder: '输入素材名称', value: '' }),
            assetList: Immutable.fromJS({
                list: [{ id: 1, name: '素材1', active: true, assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                { id: 4, name: '素材4', assetType: "source", type: "video" }], id: 1, name: '素材1', isEdit: true
            }),
            playerListAsset: Immutable.fromJS({
                list: [{ id: 1, name: '素材1', assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                { id: 4, name: '素材4', assetType: "source", type: "word" }, { id: 5, name: '素材5', assetType: "source", type: "video" }, { id: 6, name: '素材6', assetType: "source", type: "picture" }],
                id: 1, name: '素材1', isEdit: true
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                //方案
                project: true,
                //计划
                action: false,
                axisX: true,
                axisY: true,
                speed: true,
                repeat: true,
                resTime: true,
                flicker: true,
                //场景
                sceneName: true,
                playMode: true,
                playModeCount: true,
                //区域
                areaName: true,
                width: true,
                height: true,
                axisX_a: true,
                axisY_a: true,
                //素材
                playDuration: true,
                playSpeed: true,
                playTimes: true,
                clipsRage: true,
                //计划
                plan: true,
                startDate: true,
                endDate: true,
                startTime: true,
                endTime: true,
                week: true,
                //周期插播计划
                cycleName: true,
                cycleInterval: true,
                cyclePause: true,
                cycleDate: true,
                cycleTime: true,
                cycleWeek: true,
                //定时插播计划
                timingName: true,
                timingPlayModeCount: true
            },

            showModal: false,

            assetStyle: { "bottom": "0px" },
            controlStyle: { "left": "auto", "right": "auto" },
            //拖拽
            mouseXY: [0, 0],
            mouseCircleDelta: [0, 0],
            lastPress: null,
            isPressed: false,

            //播放列表单击
            isClick: false,
            //左侧栏添加单击
            isAddClick: false
        }

        this.typeList = [{ id: 'playerPlan', name: '播放计划' }, { id: 'playerScene', name: '场景' }, {
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
        this.playerSceneClick = this.playerSceneClick.bind(this);
        this.cyclePlanClick = this.cyclePlanClick.bind(this);
        this.playerPicAssetClick = this.playerPicAssetClick.bind(this);
        this.playerVideoAssetClick = this.playerVideoAssetClick.bind(this);
        this.timingPlanClick = this.timingPlanClick.bind(this);
        this.timingPlanSelect = this.timingPlanSelect.bind(this);

        this.updatePlayerTree = this.updatePlayerTree.bind(this);
        this.updateTreeData = this.updateTreeData.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updatePlayerPlanPopup = this.updatePlayerPlanPopup.bind(this);
        this.updatePlayerScenePopup = this.updatePlayerScenePopup.bind(this);
        this.updatePlayerAreaPopup = this.updatePlayerAreaPopup.bind(this);
        this.updateTimingPlanPopup = this.updateTimingPlanPopup.bind(this);

        this.setSize = this.setSize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        this.updatePlayerTree();
        this.mounted && this.setSize();
        window.onresize = event => {
            this.mounted && this.setSize();
        }

        console.log(this.props.router);
    }

    componentDidMount() {
        // window.addEventListener("mousemove", this.handleMouseMove, true);
        // window.addEventListener("mouseup", this.handleMouseUp, true);
        console.log(this.props.router);
    }

    handleMouseMove({ pageX, pageY }) {
        const { isPressed, mouseCircleDelta: [dx, dy] } = this.state;
        if (isPressed) {
            const mouseXY = [pageX - dx, pageY - dy];
            this.setState({ mouseXY });
        }
    }

    handleMouseDown(item, [pressX, pressY], { pageX, pageY }) {
        this.assetSelect(item);
        this.setState({
            lastPress: item.get('id'),
            isPressed: true,
            mouseCircleDelta: [pageX - pressX, pageY - pressY],
            mouseXY: [pressX, pressY]
        })
    }

    handleMouseUp() {
        this.setState({ isPressed: false, mouseCircleDelta: [0, 0] });
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
        if (width < 1578) {
            cright = 0;
        } else {
            cleft = "535px";
        }

        this.setState({ assetStyle: { "bottom": (height < 796 ? 0 : height - 796) + "px" }, controlStyle: { "left": cleft, "right": cright } });
    }

    updatePlayerTree() {
        const {playerData} = this.state;
        const {actions} = this.props;
        console.log("playerData:", playerData);
        actions && actions.treeViewInit(playerData);

    }

    updateTreeData(parentNode, node){
        const treeList = updateTree(this.state.playerData, parentNode, node);
        console.log()
        this.setState({playerData:treeList}, ()=>{
            this.updatePlayerTree();
        })
    }

    assetSelect(item) {
        console.log(item.toJS());
        this.state.assetList = this.state.assetList.update('id', v => item.get('id'));
        this.setState({ assetList: this.state.assetList.update('name', v => item.get('name')) });
        // const curIndex = getIndexByKey(this.state.assetList.get('list'), 'id', item.get('id'));
        // this.setState({assetList: this.state.assetList.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    playerAssetSelect(item) {
        console.log(item.toJS());

        let curType = "playerText";
        switch (item.get("type")) {
            case "word":
                curType = "playerText";
                break;
            case "picture":
                curType = "playerPicAsset";
                break;
            case "video":
                curType = "playerVideoAsset";
                break;
        }
        this.state.playerListAsset = this.state.playerListAsset.update('id', v => item.get('id'));
        this.setState({ isClick: true, curType: curType, playerListAsset: this.state.playerListAsset.update('name', v => item.get('name')) });
        // const curIndex = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.get('id'));
        // this.setState({playerListAsset: this.state.playerListAsset.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    timingPlanSelect(item) {
        this.setState({property: Object.assign({}, this.state.property, {timingList: Object.assign({}, this.state.property.timingList, {id: item.id})})});
    }

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;
        if (id == "playerList" || id == "sceneList" || id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v=>value);
            this.setState({[id]: this.state[id].update('value', v=>this.state[id].getIn(["list", value, "value"]))});
        }
        else if (id == "assetSearch") {
            this.setState({ assetSearch: this.state.assetSearch.update('value', v => value) });
        } else {


            if (id == "action" || id == "displayMode" || id == "animation" || id == "playType" || id == "scaling" || id == "volume" || id == "cyclePause" || id == "timingPause" || id == "fontType") {
                const curIndex = value.target.selectedIndex;
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        [id]: Object.assign({}, this.state.property[id], {
                            index: curIndex,
                            name: this.state.property[id].list[curIndex].name
                        })
                    })
                })
            } else if (id == "timingList-sort") {
                const curIndex = value.target.selectedIndex;
                this.setState({
                    property: Object.assign({}, this.state.property,
                        {
                            timingList: Object.assign({}, this.state.property.timingList,
                                { sort: Object.assign({}, this.state.property.timingList.sort, { index: curIndex, name: this.state.property.timingList.sort.list[curIndex].name }) })
                        })
                })
            } else if (id == "playMode" || id == "timingPlayMode") {

                const curIndex = value.target.selectedIndex;
                console.log("correct", curIndex);
                let title = "播放次数";
                let placeholder = '次';
                let active = true;
                let updateId = (id == "playMode") ? "playModeCount" : "timingPlayModeCount";
                switch (curIndex) {
                    case 0:
                        title = "播放次数";
                        placeholder = "次";
                        break;
                    case 1:
                        title = "播放时长";
                        placeholder = "秒";
                        break;
                    case 2:
                        active = false;
                        break;
                }
                this.setState({
                    property: Object.assign({}, this.state.property,

                        { [id]: Object.assign({}, this.state.property[id], { index: curIndex, name: this.state.property[id].list[curIndex].name }) },
                        { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active }) })
                })
            } else if (id == "cycleDate" || id == "cycleTime") {
                this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { appoint: value.target.checked }) }) })
            } else {
                if (id == "clipsRage1" || id == "clipsRage2") {
                    prompt = !value;
                    this.setState({
                        property: Object.assign({}, this.state.property, {clipsRage: Object.assign({}, this.state.property.clipsRage, {[id]: value})}),
                        prompt: Object.assign({}, this.state.prompt, {clipsRage: prompt})
                    })
                }
                else {
                    const val = value.target.value;
                    if (!numbersValid(val)) {
                        prompt = true;
                    }

                    this.setState({
                        property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
                        prompt: Object.assign({}, this.state.prompt, { [id]: prompt })
                    })
                }
            }
        }
    }

    dateChange(id, value) {
        if (id == "week" || id == "cycleWeek") {
            console.log(value);
            this.setState({property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: value})})});
        } else {
            this.setState({property: Object.assign({}, this.state.property, {[id]: Object.assign({}, this.state.property[id], {value: value})})});
        }
    }

    planReset() {
        console.log("计划重置")
    }

    planApply() {
        console.log("计划应用")
    }

    pageChange(current, pageSize) {
        let page = this.state.page.set('current', current);
        this.setState({ page: page }, () => {
        });
    }

    playerListAssetClick(id) {
        if (id == 'add') {
            let addList = [];
            const { assetList } = this.state;
            assetList.get('list').map(item => {
                if (item.get('active')) {
                    addList.push(item);
                }
            })

            if (addList.length == 0) {
                this.props.actions.addNotify(0, '请选中右边素材库素材');
            }
        } else if (id == 'edit') {
            this.setState({ playerListAsset: this.state.playerListAsset.update('isEdit', v => false) });
        } else if (id == 'remove') {
            const { actions } = this.props;
            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                cancel={() => { actions.overlayerHide() }} confirm={() => {

                }} />)
        } else if (id == 'complete') {
            this.setState({ playerListAsset: this.state.playerListAsset.update('isEdit', v => true) });
        }
    }

    assetList(id) {
        if (id == 'add') {

        } else if (id == 'edit') {
            this.setState({ assetList: this.state.assetList.update('isEdit', v => false) });
        } else if (id == 'remove') {
            const { actions } = this.props;
            actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
                cancel={() => { actions.overlayerHide() }} confirm={() => {

                }} />)
        } else if (id == 'complete') {
            this.setState({ assetList: this.state.assetList.update('isEdit', v => true) });
        }
    }

    projectClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    playerSceneClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    cyclePlanClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
        }
    }

    playerPicAssetClick(id) {
        const {displayMode, animation, playDuration, playSpeed} = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        displayMode: Object.assign({}, displayMode, {index: 0, name: "铺满"}),
                        animation: Object.assign({}, animation, {index: 0, name: "立即显示"}),
                        playDuration: Object.assign({}, playDuration, {value: ""}),
                        playSpeed: Object.assign({}, playSpeed, {value: ""}),
                    })
                })
                break;
        }
    }

    playerVideoAssetClick(id) {
        const {playTimes, playType, clipsRage, scaling, volume} = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        playTimes: Object.assign({}, playTimes, { value: "" }),
                        playType: Object.assign({}, playType, { index: 0, name: "片段播放" }),
                        clipsRage: Object.assign({}, clipsRage, { clipsRage1: moment('00:00:00', 'HH:mm:ss'), clipsRage2: moment('00:00:00', 'HH:mm:ss') }),
                        scaling: Object.assign({}, scaling, { index: 0, name: "铺满" }),
                        volume: Object.assign({}, volume, { index: 0, name: "100" }),
                    })
                })
                break;
        }
    }

    timingPlanClick(id) {
        console.log(id);
        switch (id) {
            case "apply":
                break;
            case "reset":
                break;
            case "sort-add":
                const data = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: []
                }
                this.updateTimingPlanPopup(data);
                break;
            case "sort-edit":
                const data2 = {
                    startTime: moment(),
                    startDate: moment(),
                    endDate: moment(),
                    week: [1, 0, 1, 0, 1, 1, 1]
                }
                this.updateTimingPlanPopup(data2);
                break;
            case "sort-remove":
                break;
        }

    }

    addClick(item) {
        console.log('addClick:', item.toJS());
    }

    assetLibRemove(item) {
        console.log('assetLibRemove:', item.toJS());
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={"是否删除选中素材？"}
            cancel={() => { actions.overlayerHide() }} confirm={() => {
                const itemId = item.get("id");
                const list = this.state.assetList.get("list");
                const curIndex = getIndexByKey(list, "id", itemId);

                this.setState({ assetList: this.state.assetList.update("list", v => v.splice(curIndex, 1)) }, () => {
                    actions.overlayerHide();
                });
            }} />)

    }

    playerAssetRemove(item) {
        console.log('playerAssetRemove:', item.toJS());

        const itemId = item.get("id");
        const list = this.state.playerListAsset.get("list");
        const curIndex = getIndexByKey(list, "id", itemId);

        this.setState({ playerListAsset: this.state.playerListAsset.update("list", v => v.splice(curIndex, 1)) });
    }

    playerAssetMove(id, item) {
        console.log('playerAssetMove:', id, item);
        const itemId = item.get("id");
        const list = this.state.playerListAsset.get("list");
        const curIndex = getIndexByKey(list, "id", itemId);

        this.state.playerListAsset = this.state.playerListAsset.update("list", v=>v.splice(curIndex, 1));
        this.setState({playerListAsset: this.state.playerListAsset.update("list", v=>v.splice(id == "left" ? curIndex - 1 : curIndex + 1, 0, item))});
    }

    updateTimingPlanPopup(data) {
        const {actions} = this.props;
        actions.overlayerShow(<TimingPlanPopup title="添加/修改插播计划" data={data} onChange={state=>{

        }} onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {
        }} />)
    }

    updatePlayerScenePopup() {
        const { actions } = this.props;

        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        actions.overlayerShow(<PlayerScenePopup title="添加计划/场景/区域" data={data} onChange={state => {
            const type = state.typeList.get('index');
            if (type == 0) {
                this.updatePlayerPlanPopup();
            } else if (type == 2) {
                this.updatePlayerAreaPopup();
            }
        }} onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {

        }} />)

    }

    updatePlayerPlanPopup() {
        const { actions } = this.props;
        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        data.startDate = moment();
        data.endDate = moment();
        data.startTime = moment();
        data.endTime = moment();
        data.week = [1, 0, 1, 0, 0, 0, 0];

        actions.overlayerShow(<PlayerPlanPopup title="添加计划/场景/区域" data={data} onChange={state => {
            const type = state.typeList.get('index');
            if (type == 1) {
                this.updatePlayerScenePopup();
            } else if (type == 2) {
                this.updatePlayerAreaPopup();
            }
        }} onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {

        }} />)
    }

    updatePlayerAreaPopup() {
        const { actions } = this.props;

        let data = {}
        data.typeList = this.typeList;
        data.sceneName = '';
        data.width = 1920;
        data.height = 1080;
        data.axisX = 10;
        data.axisY = 10;
        actions.overlayerShow(<PlayerAreaPopup title="添加计划/场景/区域" data={data} onChange={state => {
            const type = state.typeList.get('index');
            if (type == 0) {
                this.updatePlayerPlanPopup();
            } else if (type == 1) {
                this.updatePlayerScenePopup();
            }
        }} onCancel={() => { actions.overlayerHide() }} onConfirm={(state) => {

        }} />)

    }

    areaClick(id) {
        const { actions } = this.props;
        let data = {}
        if (id == "add") {
            // switch (this.state.curType) {
            //     case "playerPlan":
            //         this.updatePlayerPlanPopup();
            //         break;
            //     case "playerScene":
            //         this.updatePlayerScenePopup();
            //         break;
            //     case "playerArea":
            //         this.updatePlayerAreaPopup();
            //         break;
            // }

            if(this.state.curType == "playerProject"){
                this.setState({isAddClick: true});
            }else{
                let type = "scene";
                let name = "场景新建";
                let isChildren = false;
                let node = null;
                switch (this.state.curType) {
                    case "playerPlan":
                    case "playerPlan2":
                    case "playerPlan3":
                        type = 'scene';
                        name = "场景新建";
                        isChildren = true;

                        node = {
                            "id": "scene"+parseInt(Math.random()*999),
                            "type": type,
                            "name": name,
                            "toggled":false,
                            "active": true,
                            "level":2,
                            children:[]
                        }

                        this.setState({curType:'playerScene'}, ()=>this.updateTreeData(this.state.curNode, node));
                        break;
                    case 'playerScene':
                        type = 'area';
                        name = "区域新建";
                        isChildren = false;
                        node = {
                            "id": "area"+parseInt(Math.random()*999),
                            "type": type,
                            "name": name,
                            "active": true,
                            "level":3
                        }
                        this.setState({curType:'playerArea'}, this.updateTreeData(this.state.curNode, node));
                        break;
                }
            }
        } else if (id == "edit") {
            this.setState({ isAddClick: true });
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
        } else if (id == "project") {
            this.setState({curType: "playerProject", isClick: false});
        } else {
            this.setState({isAddClick: false}, ()=> {
                let type = "plan";
                let proType = "playerPlan";
                let name = "";
                switch (id) {
                    case "general":
                        type = "plan";
                        proType = "playerPlan";
                        name = "播放计划新建";
                        break;
                    case "cycle":
                        type = "plan2";
                        proType = "cyclePlan";
                        name = "周期插播计划";
                        break;
                    case "regular":
                        type = "plan3";
                        proType = "timingPlan";
                        name = "定时插播计划";
                        break;
                }

                const node = {
                    "id": "player"+parseInt(Math.random()*999),
                    "type": type,
                    "name": name,
                    "toggled": false,
                    "active": true,
                    "level": 1,
                    "children":[]
                }

                this.setState({curType:proType}, ()=>this.updateTreeData(null, node));
            })
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
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="未保存内容将会丢失，是否退出？"

            cancel={() => { actions.overlayerHide(); }} confirm={() => {
                actions.overlayerHide();
                this.props.router.push("/mediaPublish/playerList");
            }} />)
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
            case 'plan2':
                type = 'cyclePlan';
                break;
            case 'plan3':
                type = 'timingPlan';
                break;
            case 'area':
                type = 'playerArea';
                break;
        }

        this.setState({curNode:node, curType: type, isClick: false});
    }

    sidebarClick(id) {
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) });
    }
    changeTextContent(e) {
        this.setState({

        })
    }
    render() {
        const {
            curType, playerData, sidebarInfo, playerListAsset, assetList, property, prompt, assetType, assetSort, assetSearch, page, assetStyle, controlStyle,
            lastPress, isPressed, mouseXY, isClick, isAddClick
        } = this.state;
        const { router } = this.props;
        let routerState = null;
        if (router && router.location) {
            routerState = router.location.state;
        }
        const projectItem = routerState ? routerState.item : null;
        let add_title = "";
        switch (curType) {
            case "cyclePlan":
                add_title = '(周期插播计划)';
                break;
            case "timingPlan":
                add_title = '(定时插播计划)';
                break;
        }

        return <div className={"container "+"mediaPublish-playerArea "+(sidebarInfo.collapsed?'sidebar-collapse':'')}>
            <HeadBar moduleName="媒体发布" router={router}/>
            <SideBar data={playerData} title={projectItem && projectItem.name} isClick={isClick} isAddClick={isAddClick}
                     onClick={this.areaClick} onToggle={this.onToggle}/>
            <Content className="player-area">
                <div className="left">
                    <div className="form-group control-container-top">
                        <div className="form-group play-container" onClick={() => this.playHandler()}>
                            <span className="icon icon_play"></span><span>播放</span></div>
                        <div className="form-group zoom-out-container" onClick={() => this.zoomOutHandler()}>
                            <span className="icon icon_enlarge"></span><span>放大</span></div>
                        <div className="form-group zoom-in-container" onClick={() => this.zoomInHandler()}>
                            <span className="icon icon_reduce"></span><span>缩小</span></div>
                    </div>
                    <div className="img-container">
                        <img src="" />
                    </div>
                    <div className="control-container-bottom" style={controlStyle}>
                        <div className="form-group pull-right quit-container " onClick={() => this.quitHandler()}>
                            <span className="icon icon_send"></span><span>退出</span>
                        </div>
                        <div className="form-group pull-right save-plan-container "
                            onClick={() => this.savePlanHandler()}>
                            <span className="icon icon_save save-plan"></span><span>保存计划</span>
                        </div>
                    </div>
                </div>

            </Content>
            <div className="mediaPublish-footer" style={assetStyle}>
                <span className="title">播放列表</span>
                <ul>
                    {

                        playerListAsset.get('list').map((item, index) => {
                            const itemId = item.get('id');
                            const curId = playerListAsset.get('id');
                            return <li key={itemId} className="player-list-asset" onClick={() => this.playerAssetSelect(item)}>
                                <div className={"background " + (curId == itemId ? '' : 'hidden')}></div>
                                <span className="icon"></span>
                                <span className="name">{item.get("name")}</span>
                                {curId == itemId && index > 0 && <span className="glyphicon glyphicon-triangle-left move-left" title="左移" onClick={(event) => { event.stopPropagation(); this.playerAssetMove('left', item) }}></span>}
                                {curId == itemId && index < playerListAsset.get("list").size - 1 && <span className="glyphicon glyphicon-triangle-right move-right" title="右移" onClick={(event) => { event.stopPropagation(); this.playerAssetMove('right', item) }}></span>}
                                {!playerListAsset.get('isEdit') && item.get("assetType") == "source" && <span className="icon_delete_c remove" title="删除" onClick={(event) => { event.stopPropagation(); this.playerAssetRemove(item) }}></span>}
                            </li>
                        })
                    }
                </ul>
                <div className="pull-right control-container">
                    <div className={"list-group " + (playerListAsset.get('isEdit') ? '' : 'hidden')}>
                        <button className="btn btn-primary" onClick={() => this.playerListAssetClick('add')}>添加</button>
                        <button className="btn btn-gray" onClick={() => this.playerListAssetClick('edit')}>编辑</button>
                    </div>
                    <div className={"list-group " + (playerListAsset.get('isEdit') ? 'hidden' : '')}>
                        <button className="btn btn-gray" onClick={() => this.playerListAssetClick('remove')}>删除
                        </button>
                        <button className="btn btn-primary" onClick={() => this.playerListAssetClick('complete')}>完成
                        </button>
                    </div>
                </div>
            </div>
            <div className={"right sidebar-info "}>
                <div className="row collapse-container" onClick={() => this.sidebarClick('collapsed')}>
                    <span className={sidebarInfo.collapsed ? "icon_horizontal" : "icon_verital"}></span>
                </div>
                <div className="panel panel-default asset-property">
                    <div className="panel-heading pro-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('propertyCollapsed') }}>
                        <span className={sidebarInfo.collapsed ? "icon_info" :
                            "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>{"属性" + add_title}
                    </div>
                    <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
                        <div className={"pro-container playerProject " + (curType == 'playerProject' ? '' : 'hidden')}>
                            <div className="row">
                                <div className="form-group project-name">
                                    <label className="control-label"
                                           htmlFor={property.project.key}>{property.project.title}</label>
                                    <div className="input-container">
                                        <input type="text" className={"form-control "}
                                            placeholder={property.project.placeholder} maxLength="16"
                                            value={property.project.value}
                                            onChange={event => this.onChange("project", event)} />
                                        <span className={prompt.project ? "prompt " : "prompt hidden"}>{"请输入名称"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.projectClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.projectClick('reset') }}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container playerPlan " + (curType == 'playerPlan' ? '' : 'hidden')}>
                            <div className="row">
                                <div className="form-group plan">
                                    <label className="control-label"
                                           htmlFor={property.plan.key}>{property.plan.title}</label>
                                    <div className="input-container">
                                        <input type="text" className={"form-control "}
                                            placeholder={property.plan.placeholder} maxLength="16"
                                            value={property.plan.value}
                                            onChange={event => this.onChange("plan", event)} />
                                        <span className={prompt.plan ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group startDate">
                                    <label className="control-label"
                                        htmlFor={property.startDate.key}>{property.startDate.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="startDate" showTime format="YYYY-MM-DD" placeholder="点击选择开始日期"
                                            defaultValue={moment()} onChange={value => this.dateChange('startDate', value)} />
                                        <div className={prompt.startDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                                    </div>
                                </div>
                                <div className="form-group endDate">
                                    <label className="control-label"
                                        htmlFor={property.endDate.key}>{property.endDate.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="endDate" showTime format="YYYY-MM-DD" placeholder="点击选择结束日期"
                                            defaultValue={moment()} onChange={value => this.dateChange('endDate', value)} />
                                        <div className={prompt.endDate ? "prompt " : "prompt hidden"}>{"请选择结束日期"}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group startTime">
                                    <label className="control-label"
                                        htmlFor={property.startTime.key}>{property.startTime.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="startTime" showTime format="HH:mm:ss" placeholder="点击选择开始时间"
                                            defaultValue={moment()} onChange={value => this.dateChange('startTime', value)} />
                                        <div className={prompt.startTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                                    </div>
                                </div>
                                <div className="form-group endTime">
                                    <label className="control-label"
                                        htmlFor={property.endTime.key}>{property.endTime.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="endTime" showTime format="HH:mm:ss" placeholder="点击选择结束时间"
                                            defaultValue={moment()} onChange={value => this.dateChange('endTime', value)} />
                                        <div className={prompt.endTime ? "prompt " : "prompt hidden"}>{"请选择结束时间"}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group week">
                                    <label className="control-label"
                                        htmlFor={property.week.key}>{property.week.title}</label>
                                    <div className="input-container">
                                        <CheckboxGroup id="startTime" options={property.week.list} defaultValue={property.week.value} onChange={value => this.dateChange('week', value)} />
                                        <span className={"fixpos " + (prompt.week ? "prompt " : "prompt hidden")}>{"请选择工作日"}</span>
                                        {/* {
                                         property.week.list.map(item=>{
                                         return <label>
                                         <input type="checkbox" className="checkbox-inline" key={item.value}
                                         checked = {item.value}
                                         />{item.label}</label>
                                         })
                                         } */}
                                        {/* <span className={prompt.week?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-gray pull-right" onClick={this.planReset}>重置</button>
                                <button className="btn btn-primary pull-right" onClick={() => this.planApply}>应用</button>
                            </div>
                        </div>
                        <div className={"pro-container cyclePlan " + (curType == 'cyclePlan' ? '' : 'hidden')}>
                            <div className="row">
                                <div className="form-group cycle-name">
                                    <label className="control-label"
                                           htmlFor={property.cycleName.key}>{property.cycleName.title}</label>
                                    <div className="input-container">
                                        <input type="text" className="form-control" placeholder={property.cycleName.placeholder} value={property.cycleName.value} onChange={event => this.onChange("cycleName", event)} />
                                        <span className={prompt.cycleName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group cycle-interval">
                                    <label className="control-label"
                                           htmlFor={property.cycleInterval.key}>{property.cycleInterval.title}</label>
                                    <div className="input-container">
                                        <input type="text" className="form-control" placeholder={property.cycleInterval.placeholder} value={property.cycleInterval.value} onChange={event => this.onChange("cycleInterval", event)} />
                                        <span className={prompt.cycleInterval ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                                <div className="form-group cycle-pause">
                                    <label className="control-label"
                                           htmlFor={property.cyclePause.key}>{property.cyclePause.title}</label>
                                    <div className="input-container">
                                        <select className={"form-control"} value={property.cyclePause.name} onChange={event => this.onChange("cyclePause", event)}>
                                            {
                                                property.cyclePause.list.map((option, index) => {
                                                    let value = option.name;
                                                    return <option key={index} value={value}>
                                                        {value}
                                                    </option>
                                                })}
                                        </select>
                                        {/*<span className={prompt.cyclePause?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group cycle-startDate">
                                    <label className="control-label"
                                        htmlFor={property.cycleStartDate.key}>{property.cycleStartDate.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="cycleStartDate" showTime format="YYYY-MM-DD" placeholder="点击选择开始日期" style={{ width: "200px" }}
                                            defaultValue={property.cycleStartDate.value} onChange={value => this.dateChange('cycleStartDate', value)} />
                                        <div className={prompt.cycleStartDate ? "prompt " : "prompt hidden"}>{"请选择开始日期"}</div>
                                    </div>
                                </div>
                                <div className="form-group cycle-endDate">
                                    <label className="control-label"
                                        htmlFor={property.cycleEndDate.key}>{property.cycleEndDate.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="cycleEndDate" showTime format="YYYY-MM-DD" placeholder="点击选择结束日期" style={{ width: "200px" }}
                                            defaultValue={property.cycleEndDate.value} onChange={value => this.dateChange('cycleEndDate', value)} />
                                        <div className={prompt.cycleEndDate ? "prompt " : "prompt hidden"}>{"请选择结束日期"}</div>
                                    </div>
                                </div>
                                <div className="form-group cycle-date">
                                    <label className="control-label"
                                           htmlFor={property.cycleDate.key}>{property.cycleDate.title}</label>
                                    <div className="input-container">
                                        <Checkbox checked={property.cycleDate.appoint} onChange={event => this.onChange("cycleDate", event)} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group cycle-startTime">
                                    <label className="control-label"
                                        htmlFor={property.cycleStartTime.key}>{property.cycleStartTime.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="cycleStartTime" showTime format="HH:mm:ss" placeholder="点击选择开始时间" style={{ width: "200px" }}
                                            defaultValue={property.cycleStartTime.value} onChange={value => this.dateChange('cycleStartTime', value)} />
                                        <div className={prompt.cycleStartTime ? "prompt " : "prompt hidden"}>{"请选择开始时间"}</div>
                                    </div>
                                </div>
                                <div className="form-group cycle-endTime">
                                    <label className="control-label"
                                        htmlFor={property.cycleEndTime.key}>{property.cycleEndTime.title}</label>
                                    <div className="input-container">
                                        <DatePicker id="cycleEndTime" showTime format="HH:mm:ss" placeholder="点击选择结束时间" style={{ width: "200px" }}
                                            defaultValue={property.cycleEndTime.value} onChange={value => this.dateChange('cycleEndTime', value)} />
                                        <div className={prompt.cycleEndTime ? "prompt " : "prompt hidden"}>{"请选择结束时间"}</div>
                                    </div>
                                </div>
                                <div className="form-group cycle-time">
                                    <label className="control-label"
                                           htmlFor={property.cycleTime.key}>{property.cycleTime.title}</label>
                                    <div className="input-container">
                                        <Checkbox checked={property.cycleTime.appoint} onChange={event => this.onChange("cycleTime", event)} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group cycle-week">
                                    <label className="control-label"
                                        htmlFor={property.cycleWeek.key}>{property.cycleWeek.title}</label>
                                    <div className="input-container">
                                        <CheckboxGroup id="cycleWeek" options={property.cycleWeek.list} defaultValue={property.cycleWeek.value} onChange={value => this.dateChange('cycleWeek', value)} />
                                        <span className={"fixpos " + (prompt.cycleWeek ? "prompt " : "prompt hidden")}>{"请选择工作日"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.cyclePlanClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.cyclePlanClick('reset') }}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container timingPlan " + (curType == 'timingPlan' ? '' : 'hidden')}>
                            <div className="row">
                                <div className="form-group timing-name">
                                    <label className="control-label"
                                           htmlFor={property.timingName.key}>{property.timingName.title}</label>
                                    <div className="input-container">
                                        <input type="text" className="form-control" placeholder={property.timingName.placeholder} value={property.timingName.value} onChange={event => this.onChange("timingName", event)} />
                                        <span className={prompt.timingName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group timing-list">
                                    <label className="control-label"
                                           htmlFor={property.timingList.key}>{property.timingList.title}</label>
                                    <div className="input-container">
                                        <div className="edit-head">
                                            <select value={property.timingList.sort.name} onChange={event => this.onChange("timingList-sort", event)}>
                                                {
                                                    property.timingList.sort.list.map((option, index) => {
                                                        let value = option.name;
                                                        return <option key={index} value={value}>
                                                            {value}
                                                        </option>
                                                    })}
                                            </select>
                                            <button className="btn btn-primary timing-sort-add" onClick={() => { this.timingPlanClick('sort-add') }}>添加</button>
                                            <button className="btn btn-gray timing-sort-edit" onClick={() => { this.timingPlanClick('sort-edit') }}>编辑</button>
                                        </div>
                                        <div className="edit-body">
                                            <ul>
                                                {
                                                    property.timingList.list.map(item => {
                                                        let dateStr = dateStrReplaceZh(momentDateFormat(item.startDate, "YYYY-MM-DD")) + ' 至 ' + dateStrReplaceZh(momentDateFormat(item.endDate, "YYYY-MM-DD"));
                                                        let weekStr = weekReplace(item.week);
                                                        return <li key={item.id} onClick={() => this.timingPlanSelect(item)}>
                                                            <div className={"background " + (property.timingList.id == item.id ? '' : 'hidden')}></div>
                                                            {'[' + momentDateFormat(item.startTime, 'HH:mm') + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + dateStr + ']'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'[' + weekStr + ']'}
                                                            <span className="icon icon-delete pull-right" onClick={() => this.timingPlanClick('sort-remove')}></span>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label className="control-label"
                                           htmlFor={property.timingPlayMode.key}>{property.timingPlayMode.title}</label>
                                    <div className="input-container">
                                        <select className={"form-control"} value={property.timingPlayMode.name} onChange={event => this.onChange("timingPlayMode", event)}>
                                            {
                                                property.timingPlayMode.list.map((option, index) => {
                                                    let value = option.name;
                                                    return <option key={index} value={value}>
                                                        {value}
                                                    </option>
                                                })}
                                        </select>
                                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                                    </div>
                                </div>
                                <div className={"form-group " + (property.timingPlayModeCount.active ? '' : 'hidden')}>
                                    <label className="control-label">{property.timingPlayModeCount.title}</label>
                                    <div className={"input-container "}>
                                        <input type="text" className={"form-control "} htmlFor={property.timingPlayModeCount.key} placeholder={property.timingPlayModeCount.placeholder} maxLength="8"
                                            value={property.timingPlayModeCount.value} onChange={event => this.onChange("timingPlayModeCount", event)} />
                                        <span className={prompt.timingPlayModeCount ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group timing-pause">
                                    <label className="control-label"
                                           htmlFor={property.timingPause.key}>{property.timingPause.title}</label>
                                    <div className="input-container">
                                        <select className={"form-control"} value={property.timingPause.name} onChange={event => this.onChange("timingPause", event)}>
                                            {
                                                property.timingPause.list.map((option, index) => {
                                                    let value = option.name;
                                                    return <option key={index} value={value}>
                                                        {value}
                                                    </option>
                                                })}
                                        </select>
                                        {/*<span className={prompt.cyclePause?"prompt ":"prompt hidden"}>{"请输入正确参数"}</span>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.timingPlanClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.timingPlanClick('reset') }}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container playerArea " + (curType == 'playerArea' ? '' : "hidden")}>
                            <div className="form-group  area-name">
                                <label className="control-label"
                                       htmlFor={property.areaName.key}>{property.areaName.title}</label>
                                <div className="input-container">
                                    <input type="text" className={"form-control "}
                                        placeholder={property.areaName.placeholder} maxLength="8"
                                        value={property.areaName.value}
                                        onChange={event => this.onChange("areaName", event)} />
                                    <span className={prompt.areaName ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>

                                </div>
                            </div>
                            <div className="form-group  width">
                                <label className="col-sm-3 control-label"
                                    htmlFor={property.width.key}>{property.width.title}</label>
                                <div className="input-container">
                                    <input type="text" className={"form-control "}
                                        placeholder={property.width.placeholder} maxLength="8"
                                        value={property.width.value}
                                        onChange={event => this.onChange("width", event)} />
                                    <span className={prompt.width ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  height">
                                <label className="col-sm-3 control-label"
                                    htmlFor={property.height.key}>{property.height.title}</label>
                                <div className="input-container">
                                    <input type="text" className={"form-control "}
                                        placeholder={property.height.placeholder} maxLength="8"
                                        value={property.height.value}
                                        onChange={event => this.onChange("height", event)} />
                                    <span className={prompt.height ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisX_a">
                                <label className="col-sm-3 control-label"
                                    htmlFor={property.axisX_a.key}>{property.axisX_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={"form-control "}
                                        placeholder={property.axisX_a.placeholder} maxLength="8"
                                        value={property.axisX_a.value}
                                        onChange={event => this.onChange("axisX_a", event)} />
                                    <span className={prompt.axisX_a ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group  axisY_a">
                                <label className="col-sm-3 control-label"
                                    htmlFor={property.axisY_a.key}>{property.axisY_a.title}</label>
                                <div className="input-container">
                                    <input type="text" className={"form-control "}
                                        placeholder={property.axisY_a.placeholder} maxLength="8"
                                        value={property.axisY_a.value}
                                        onChange={event => this.onChange("axisY_a", event)} />
                                    <span className={prompt.axisY_a ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.playerSceneClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.playerSceneClick('reset') }}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container playerScene " + (curType == 'playerScene' ? '' : "hidden")}>
                            <div className="row">
                                <div className="form-group  scene-name">
                                    <label className="control-label"
                                        htmlFor={property.sceneName.key}>{property.sceneName.title}</label>
                                    <div className="input-container">
                                        <input type="text" className={"form-control "}
                                            placeholder={property.sceneName.placeholder} maxLength="8"
                                            value={property.sceneName.value}
                                            onChange={event => this.onChange("sceneName", event)} />
                                        <span className={prompt.sceneName ? "prompt " : "prompt hidden"}>{"请输入名称"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label className="control-label"
                                           htmlFor={property.playMode.key}>{property.playMode.title}</label>
                                    <div className="input-container">
                                        <select className={"form-control"} value={property.playMode.name} onChange={event => this.onChange("playMode", event)}>
                                            {
                                                property.playMode.list.map((option, index) => {
                                                    let value = option.name;
                                                    return <option key={index} value={value}>
                                                        {value}
                                                    </option>
                                                })}
                                        </select>
                                        {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
                                    </div>
                                </div>
                                <div className={"form-group " + (property.playModeCount.active ? '' : 'hidden')}>
                                    <label className="control-label">{property.playModeCount.title}</label>
                                    <div className={"input-container "}>
                                        <input type="text" className={"form-control "} htmlFor={property.playModeCount.key} placeholder={property.playModeCount.placeholder} maxLength="8"
                                            value={property.playModeCount.value} onChange={event => this.onChange("playModeCount", event)} />
                                        <span className={prompt.playModeCount ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.playerSceneClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.playerSceneClick('reset') }}>重置</button>
                            </div>
                        </div>
                        {/* Edit text here !!!!*/}
                        <div className={"pro-container playerText " + (curType == 'playerText' ? '' : "hidden")}>
                            <div className='form-group'>
                                <label className='control-label'>{property.assetName.title}</label>
                                <div className='input-container'>
                                    <input type='text' className='form-control' disabled='disabled' value={property.assetName.value} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>{property.textContent.title}</label>
                                <div className='input-container text-container'>
                                    <textarea className='text-content' value={property.textContent.value} onChange={e => this.onChange('textContent', e)} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>{property.fontType.title}</label>
                                <div className='input-container'>
                                    <select className='form-control' value={property.fontType.name}
                                        onChange={e => this.onChange('fontType', e)}>
                                        {
                                            property.fontType.list.map((item, index) => {
                                                return <option key={index} value={item.name}>{item.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                        </div>
                        {/* Edit text end */}
                        <div className={"pro-container playerPicAsset " + (curType == 'playerPicAsset' ? '' : "hidden")}>
                            <div className="form-group">
                                <label className="control-label">{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" disabled="disabled"
                                           value={property.assetName.value}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.displayMode.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={property.displayMode.name}
                                        onChange={event => this.onChange("displayMode", event)}>
                                        {
                                            property.displayMode.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.animation.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={property.animation.name}
                                        onChange={event => this.onChange("animation", event)}>
                                        {
                                            property.animation.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playDuration.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.playDuration.placeholder} maxLength="8"
                                        value={property.playDuration.value}
                                        onChange={event => this.onChange("playDuration", event)} />
                                    <span className={prompt.playDuration ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playSpeed.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.playSpeed.placeholder} maxLength="8"
                                        value={property.playSpeed.value}
                                        onChange={event => this.onChange("playSpeed", event)} />
                                    <span className={prompt.playSpeed ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.playerPicAssetClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.playerPicAssetClick('reset') }}>重置</button>
                            </div>
                        </div>
                        <div className={"pro-container playerVideoAsset " + (curType == 'playerVideoAsset' ? '' : "hidden")}>
                            <div className="form-group">
                                <label className="control-label">{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" disabled="disabled"
                                           value={property.assetName.value}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.playTimes.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.playTimes.placeholder} maxLength="8"
                                        value={property.playTimes.value}
                                        onChange={event => this.onChange("playTimes", event)} />
                                    <span className={prompt.playTimes ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.scaling.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={property.scaling.name}
                                        onChange={event => this.onChange("scaling", event)}>
                                        {
                                            property.scaling.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">{property.playType.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={property.playType.name}
                                        onChange={event => this.onChange("playType", event)}>
                                        {
                                            property.playType.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            })}
                                    </select>
                                </div>
                            </div>
                            {
                                property.playType.name == "片段播放" && (<div className="form-group clipsRage">
                                    <label className="control-label">{property.clipsRage.title}</label>
                                    <div className="input-container">
                                        <TimePicker size="large" onChange={value => this.onChange("clipsRage1", value)} value={property.clipsRage.clipsRage1} />
                                        <span className="text">至</span>
                                        <TimePicker size="large" onChange={value => this.onChange("clipsRage2", value)} value={property.clipsRage.clipsRage2} />
                                        <span className={prompt.clipsRage ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                    </div>
                                </div>)
                            }
                            <div className="form-group volume">
                                <label className="control-label">{property.volume.title}</label>
                                <div className="input-container">
                                    <select className="form-control" value={property.volume.name}
                                        onChange={event => this.onChange("volume", event)}>
                                        {
                                            property.volume.list.map((option, index) => {
                                                let value = option.name;
                                                return <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.playerVideoAssetClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.playerVideoAssetClick('reset') }}>重置</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel panel-default asset-lib">
                    <div className="panel-heading lib-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('assetLibCollapsed') }}>
                        <span className={sidebarInfo.collapsed ? "icon_file" : "glyphicon " + (sidebarInfo.assetLibCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>素材库
                    </div>
                    <div className={"panel-body " + (sidebarInfo.assetLibCollapsed ? 'assetLib-collapsed' : '')}>
                        <div className="asset-container">
                            <div className="top">
                                <Select className="asset-type" data={assetType}
                                    onChange={selectIndex => this.onChange("assetType", selectIndex)}></Select>
                                <Select className="asset-sort" data={assetSort}
                                    onChange={selectedIndex => this.onChange("assetSort", selectedIndex)}></Select>
                                <SearchText className="asset-search" placeholder={assetSearch.get('placeholder')}
                                    value={assetSearch.get('value')}
                                    onChange={value => this.onChange("assetSearch", value)}
                                    submit={this.searchSubmit}></SearchText>
                                <div className={"btn-group " + (assetList.get('isEdit') ? '' : 'hidden')}>
                                    <button className="btn btn-primary add" onClick={this.showModal}>导入</button>
                                    <button className="btn btn-gray" onClick={() => this.assetList('edit')}>编辑</button>
                                </div>
                                <div className={"btn-group " + (assetList.get('isEdit') ? 'hidden' : '')}>
                                    <button className="btn btn-gray" onClick={() => this.assetList('remove')}>删除
                                    </button>
                                    <button className="btn btn-primary" onClick={() => this.assetList('complete')}>完成
                                    </button>
                                </div>
                                <Material showModal={this.state.showModal} hideModal={this.hideModal}/>
                            </div>
                            <div className="bottom">
                                <ul className="asset-list">
                                    {
                                        assetList.get('list').map((item, index) => {
                                            let x, y;
                                            const id = item.get('id');
                                            const curId = assetList.get('id');
                                            if (id == lastPress && isPressed) {
                                                [x, y] = mouseXY;
                                            } else {
                                                [x, y] = [0, 0];
                                            }


                                            return <li key={id} className={index > 0 && index % 4 == 0 ? "margin-right" : ""}
                                                style={{ transform: `translate(${x}px,${y}px)`, zIndex: id == lastPress ? 99 : 0 }}
                                                onClick={() => this.assetSelect(item)}>
                                                {/*onMouseDown={event=>{this.handleMouseDown(item, [x, y],{pageX:event.pageX, pageY:event.pageY})}}*/}
                                                <div className={"background " + (curId == id ? '' : 'hidden')}></div>
                                                <span className="icon"></span>
                                                <span className="name">{item.get('name')}</span>
                                                {!playerListAsset.get('isEdit') && <span className="icon_add_c add" title="添加" onClick={(event) => { event.stopPropagation(); this.addClick(item) }}></span>}
                                                {!assetList.get('isEdit') && item.get("assetType") == "source" && <span className="icon_delete_c remove" title="删除" onClick={(event) => { event.stopPropagation(); this.assetLibRemove(item) }}></span>}
                                            </li>
                                        })
                                    }
                                </ul>
                                <div className="page-container">
                                    <Page className={"page " + (page.get('total') == 0 ? "hidden" : "")} showSizeChanger
                                        pageSize={page.get('pageSize')}
                                        current={page.get('current')} total={page.get('total')}
                                        onChange={this.pageChange} />
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

const mapStateToProps = state => {
    return {
        sidebarNode: state.mediaPublish.get('sidebarNode')
    }
}

const mapDispatchToProps = (dispatch) => {
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