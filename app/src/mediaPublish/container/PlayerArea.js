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

import PlayerProject from '../component/PlayerProject';
import PlayerPlan from '../component/PlayerPlan';
import PlayerScene from '../component/PlayerScene';
import PlayerAreaPro from '../component/PlayerAreaPro';
import CyclePlan from '../component/CyclePlan';
import TimingPlan from '../component/TimingPlan';

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

import { Name2Valid } from '../../util/index';
import { getIndexByKey } from '../../util/algorithm';
import { TimePicker, DatePicker, Checkbox } from 'antd';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
const CheckboxGroup = Checkbox.Group;

import { SketchPicker } from 'react-color';

import DigitalClock from '../component/digitalClock';

export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curNode: null,
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
                //素材
                assetName: { key: "assetName", title: "素材名称", placeholder: '素材名称', value: "" },

                //文字素材
                textContent: { key: 'textContent', title: '文本内容', value: '' },
                fontType: { key: 'fontType', title: '选择字体', list: [{ id: 1, name: '微软雅黑' }, { id: 2, name: '宋体' }, { id: 3, name: 'serif' }, { id: 4, name: 'monospace' }], index: 0 },
                alignment: { key: 'alignment', title: '对齐方式', list: [{ id: 1, name: '左上' }, { id: 2, name: '左中' }, { id: 3, name: '左下' }, { id: 4, name: '中上' }, { id: 5, name: '上下居中' }, { id: 6, name: '中下' }, { id: 7, name: '右上' }, { id: 8, name: '右中' }, { id: 9, name: '右下' },], index: 0 },
                wordSpacing: { key: 'wordSpacing', title: '字间距', placeholder: 'pt', value: '' },
                lineSpacing: { key: 'lineSpacing', title: '行间距', placeholder: 'pt', value: '' },
                fontColor: { key: 'fontColor', title: '字体颜色', value: '#456' },
                bgColor: { key: 'bgColor', title: '背景颜色', value: '#789' },
                bgTransparent: { key: 'bgTransparent', title: '背景透明', value: false },

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
                    ], index: 0
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
                list: [{ id: 1, name: '素材1', assetType: "system", type: "text" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                { id: 4, name: '素材4', assetType: "source", type: "text" }, { id: 5, name: '素材5', assetType: "source", type: "video" }, { id: 6, name: '素材6', assetType: "source", type: "picture" }],
                id: 1, name: '素材1', isEdit: true
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),
            prompt: {
                //素材
                textArea: false, lineSpacing: false, wordSpacing: false,
                playDuration: false, playSpeed: false, playTimes: true, clipsRage: true,
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
            isAddClick: false,

            //字体颜色，背景颜色,背景透明
            displayFontColorPicker: false,
            displayBgColorPicker: false,
        }

        this.typeList = [{ id: 'playerPlan', name: '播放计划' }, { id: 'playerScene', name: '场景' }, {id: 'playerArea', name: "区域"}]

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
        this.playerPicAssetClick = this.playerPicAssetClick.bind(this);
        this.playerVideoAssetClick = this.playerVideoAssetClick.bind(this);

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
        this.handleFontColorChange = this.handleFontColorChange.bind(this);
        this.handleFontColorClick = this.handleFontColorClick.bind(this);
        this.handleFontColorClose = this.handleFontColorClose.bind(this)
        this.handleBgColorChange = this.handleBgColorChange.bind(this);
        this.handleBgColorClick = this.handleBgColorClick.bind(this);
        this.handleBgColorClose = this.handleBgColorClose.bind(this);
        this.handleBgTransparent = this.handleBgTransparent.bind(this)
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
        const { playerData } = this.state;
        const { actions } = this.props;
        console.log("playerData:", playerData);
        actions && actions.treeViewInit(playerData);

    }

    updateTreeData(parentNode, node) {
        const treeList = updateTree(this.state.playerData, parentNode, node);
        console.log()
        this.setState({ playerData: treeList }, () => {
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
            case "text":
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

    onChange(id, value) {
        console.log("id:", id);
        let prompt = false;
        if (id == "playerList" || id == "sceneList" || id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v => value);
            this.setState({ [id]: this.state[id].update('value', v => this.state[id].getIn(["list", value, "value"])) });
        }
        else if (id == "assetSearch") {
            this.setState({ assetSearch: this.state.assetSearch.update('value', v => value) });
        } else {


            if (id == "action" || id == "displayMode" || id == "animation" || id == "playType" || id == "scaling" || id == "volume"  ||  id == "fontType" || id == "alignment") {
                const curIndex = value.target.selectedIndex;
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        [id]: Object.assign({}, this.state.property[id], {
                            index: curIndex,
                            name: this.state.property[id].list[curIndex].name
                        })
                    })
                })
            }else {
                if (id == "clipsRage1" || id == "clipsRage2") {
                    prompt = !value;
                    this.setState({
                        property: Object.assign({}, this.state.property, { clipsRage: Object.assign({}, this.state.property.clipsRage, { [id]: value }) }),
                        prompt: Object.assign({}, this.state.prompt, { clipsRage: prompt })
                    })
                }
                else {
                    const val = value.target.value;
                    if (!Name2Valid(val)) {
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
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        } else {
            this.setState({ property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: value }) }) });
        }
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

    playerTextClick(id) {
        const { textContent, fontType, fontColor, bgColor, bgTransparent, alignment, playDuration, animation, playSpeed, wordSpacing, lineSpacing } = this.state.property;
        switch (id) {
            case 'apply':
                break;
            case 'reset':
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        textContent: Object.assign({}, textContent, { value: '' }),
                        fontType: Object.assign({}, fontType, { index: 0, name: '微软雅黑' }),
                        fontColor: Object.assign({}, fontColor),
                        bgColor: Object.assign({}, bgColor),
                        bgTransparent: Object.assign({}, bgTransparent),
                        alignment: Object.assign({}, alignment, { index: 0, name: '左上' }),
                        animation: Object.assign({}, animation, { index: 0, name: "立即显示" }),
                        playDuration: Object.assign({}, playDuration, { value: "" }),
                        playSpeed: Object.assign({}, playSpeed, { value: "" }),
                        wordSpacing: Object.assign({}, wordSpacing, { value: '' }),
                        lineSpacing: Object.assign({}, lineSpacing, { value: '' }),
                        fontColor: Object.assign({}, fontColor, { value: '#789' }),
                        bgColor: Object.assign({}, bgColor, { value: '#456' }),
                        bgTransparent: Object.assign({}, bgTransparent, { value: false }),
                    })
                });
                break;
        }
    }
    playerPicAssetClick(id) {
        const { displayMode, animation, playDuration, playSpeed } = this.state.property;
        switch (id) {
            case "apply":
                break;
            case "reset":
                this.setState({
                    property: Object.assign({}, this.state.property, {
                        displayMode: Object.assign({}, displayMode, { index: 0, name: "铺满" }),
                        animation: Object.assign({}, animation, { index: 0, name: "立即显示" }),
                        playDuration: Object.assign({}, playDuration, { value: "" }),
                        playSpeed: Object.assign({}, playSpeed, { value: "" }),
                    })
                })
                break;
        }
    }

    playerVideoAssetClick(id) {
        const { playTimes, playType, clipsRage, scaling, volume } = this.state.property;
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

        this.state.playerListAsset = this.state.playerListAsset.update("list", v => v.splice(curIndex, 1));
        this.setState({ playerListAsset: this.state.playerListAsset.update("list", v => v.splice(id == "left" ? curIndex - 1 : curIndex + 1, 0, item)) });
    }

    updateTimingPlanPopup(data) {
        const { actions } = this.props;
        actions.overlayerShow(<TimingPlanPopup title="添加/修改插播计划" data={data} onChange={state => {

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

            if (this.state.curType == "playerProject") {
                this.setState({ isAddClick: true });
            } else {
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
                            "id": "scene" + parseInt(Math.random() * 999),
                            "type": type,
                            "name": name,
                            "toggled": false,
                            "active": true,
                            "level": 2,
                            children: []
                        }

                        this.setState({ curType: 'playerScene' }, () => this.updateTreeData(this.state.curNode, node));
                        break;
                    case 'playerScene':
                        type = 'area';
                        name = "区域新建";
                        isChildren = false;
                        node = {
                            "id": "area" + parseInt(Math.random() * 999),
                            "type": type,
                            "name": name,
                            "active": true,
                            "level": 3
                        }
                        this.setState({ curType: 'playerArea' }, this.updateTreeData(this.state.curNode, node));
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
                cancel={() => { actions.overlayerHide() }} confirm={() => {
                }} />)
        } else if (id == "project") {
            this.setState({ curType: "playerProject", isClick: false });
        } else {
            this.setState({ isAddClick: false }, () => {
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
                    "id": "player" + parseInt(Math.random() * 999),
                    "type": type,
                    "name": name,
                    "toggled": false,
                    "active": true,
                    "level": 1,
                    "children": []
                }

                this.setState({ curType: proType }, () => this.updateTreeData(null, node));
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

        this.setState({ curNode: node, curType: type, isClick: false });
    }

    sidebarClick(id) {
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }) });
    }
    handleFontColorClick(e) {
        e.stopPropagation();
        if (this.fontTarget === undefined) {
            this.fontTarget = e.target;
            this.setState({ displayFontColorPicker: !this.state.displayFontColorPicker });
            return;
        } else {
            if (this.fontTarget !== e.target) {
                return;
            }
        }
        this.setState({ displayFontColorPicker: !this.state.displayFontColorPicker })
    };
    handleBgColorClick(e) {
        e.stopPropagation();
        if (this.bgTarget === undefined) {
            this.bgTarget = e.target;
            this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker });
            return;
        } else {
            if (this.bgTarget !== e.target) {
                return;
            }
        }
        this.setState({ displayBgColorPicker: !this.state.displayBgColorPicker })
    };
    handleFontColorClose(e) {
        e.stopPropagation();
        this.setState({ displayFontColorPicker: false })
    };
    handleBgColorClose(e) {
        e.stopPropagation();
        this.setState({ displayBgColorPicker: false })
    };
    handleFontColorChange(color) {
        this.setState({ property: { ...this.state.property, fontColor: { ...this.state.property.fontColor, value: color.hex } } })
    };
    handleBgColorChange(color) {
        this.setState({ property: { ...this.state.property, bgColor: { ...this.state.property.bgColor, value: color.hex } } })
    };
    handleBgTransparent(e) {
        e.stopPropagation();
        this.setState({ property: { ...this.state.property, bgTransparent: { ...this.state.property.bgTransparent, value: e.target.checked } } })
    }
    render() {
        const styles =
            {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            };

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
        return <div className={"container " + "mediaPublish-playerArea " + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName="媒体发布" router={router} />
            <SideBar data={playerData} title={projectItem && projectItem.name} isClick={isClick} isAddClick={isAddClick}
                onClick={this.areaClick} onToggle={this.onToggle} />
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
                        {curType == 'playerProject' && <PlayerProject />}
                        {curType == 'playerPlan' && <PlayerPlan/>}
                        {curType == 'playerScene' && <PlayerScene/>}
                        {curType == 'playerArea' && <PlayerAreaPro/>}
                        {curType == 'cyclePlan' && <CyclePlan/>}
                        {curType == 'timingPlan' && <TimingPlan updateTimingPlanPopup={this.updateTimingPlanPopup}/>}

                        {/* Edit text here !!!!*/}
                        <div className={"pro-container playerText " + (curType == 'playerText' ? '' : "hidden")}>
                            <div className='form-group'>
                                <label className='control-label'>{property.assetName.title}</label>
                                <div className='input-container'>
                                    <input type='text' className='form-control' disabled='disabled' value={property.assetName.value} />
                                </div>
                            </div>
                            <div className='form-group'>
                                <label className='control-label label-alignment'>{property.textContent.title}</label>
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
                            <div className='form-group font-color'>
                                <label className='control-label'>{property.fontColor.title}</label>
                                <div className='color-show' style={{ backgroundColor: property.fontColor.value }} onClick={this.handleFontColorClick}>
                                    {this.state.displayFontColorPicker
                                        ? <div className='popover'>
                                            {<div className='cover' onClick={this.handleFontColorClose}></div>}
                                            <SketchPicker color={property.fontColor.value} onChange={this.handleFontColorChange} />
                                        </div>
                                        : null}
                                </div>
                                <label className='control-label'>{property.bgColor.title}</label>
                                <div className='color-show' style={{ backgroundColor: property.bgColor.value }} onClick={this.handleBgColorClick}>
                                    {this.state.displayBgColorPicker
                                        ? <div className='popover bg-popover'>
                                            {<div className='cover' onClick={this.handleBgColorClose}></div>}
                                            <SketchPicker color={property.bgColor.value} onChange={this.handleBgColorChange} />
                                        </div>
                                        : null}
                                </div>
                                <label className='control-label'>{property.bgTransparent.title}</label>
                                <input type='checkbox' onClick={this.handleBgTransparent} checked={property.bgTransparent.value} />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>{property.alignment.title}</label>
                                <div className='input-container'>
                                    <select className='form-control' value={property.alignment.name}
                                        onChange={e => this.onChange('alignment', e)}>
                                        {
                                            property.alignment.list.map((item, index) => {
                                                return <option key={index} value={item.name}>{item.name}</option>
                                            })
                                        }
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
                                <label className="col-sm-3 control-label">{property.playSpeed.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.playSpeed.placeholder} maxLength="8"
                                        value={property.playSpeed.value}
                                        onChange={event => this.onChange("playSpeed", event)} />
                                    <span className={prompt.playSpeed ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.lineSpacing.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.lineSpacing.placeholder} maxLength="8"
                                        value={property.lineSpacing.value}
                                        onChange={event => this.onChange("lineSpacing", event)} />
                                    <span className={prompt.lineSpacing ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">{property.wordSpacing.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control"
                                        placeholder={property.wordSpacing.placeholder} maxLength="8"
                                        value={property.wordSpacing.value}
                                        onChange={event => this.onChange("wordSpacing", event)} />
                                    <span className={prompt.wordSpacing ? "prompt " : "prompt hidden"}>{"请输入正确参数"}</span>
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary pull-right" onClick={() => { this.playerTextClick('apply') }}>应用</button>
                                <button className="btn btn-gray pull-right" onClick={() => { this.playerTextClick('reset') }}>重置</button>
                            </div>
                        </div>
                        {/* Edit text end */}
                        <div className={"pro-container playerPicAsset " + (curType == 'playerPicAsset' ? '' : "hidden")}>
                            <div className="form-group">
                                <label className="control-label">{property.assetName.title}</label>
                                <div className="input-container">
                                    <input type="text" className="form-control" disabled="disabled"
                                        value={property.assetName.value} />
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
                                        value={property.assetName.value} />
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
                                <Material showModal={this.state.showModal} hideModal={this.hideModal} />
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
                <NotifyPopup />
                <Overlayer />
            </div >
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
