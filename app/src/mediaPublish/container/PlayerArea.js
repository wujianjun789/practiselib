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
import Panel from '../../components/Panel';

import PlayerProject from '../component/PlayerProject';
import PlayerPlan from '../component/PlayerPlan';
import PlayerScene from '../component/PlayerScene';
import PlayerAreaPro from '../component/PlayerAreaPro';
import CyclePlan from '../component/CyclePlan';
import TimingPlan from '../component/TimingPlan';
import PlayerPicAsset from '../component/PlayerPicAsset';
import PlayerVideoAsset from '../component/PlayerVideoAsset';
import PlayerText from '../component/PlayerText';
import DigitalClock from '../component/digitalClock';
import VirtualClock from '../component/VirtualClock';
import PlayerTimeAsset from '../component/PlayerTimeAsset';

import ConfirmPopup from '../../components/ConfirmPopup'
import PlayerScenePopup from '../component/PlayerScenePopup';
import PlayerPlanPopup from '../component/PlayerPlanPopup';
import PlayerAreaPopup from '../component/PlayerAreaPopup';

import PreviewFile from '../component/previewFile';
import UploadNotify from '../component/uploadNotify';
import UploadFile from '../component/uploadFile';


import NotifyPopup from '../../common/containers/NotifyPopup';

import { treeViewInit } from '../../common/actions/treeView';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup'

import moment from 'moment'
import Immutable from 'immutable';

import { Name2Valid } from '../../util/index';
import { getIndexByKey } from '../../util/algorithm';
import { updateTree } from '../util/index'

import {getProgramList, getSceneList, getZoneList} from '../../api/mediaPublish';
import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';

import lodash from 'lodash';
export class PlayerArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            curNode: null,
            curType: 'digitalClock',
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

            assetType: Immutable.fromJS({ list: [{ id: 1, value: '类别1' }, { id: 2, value: '类别2' }], index: 0, value: '类别1' }),
            assetSort: Immutable.fromJS({
                list: [{ id: 1, value: '素材文字' }, { id: 2, value: '素材图片' }],
                index: 0,
                value: '素材文字'
            }),
            assetSearch: Immutable.fromJS({ placeholder: this.props.intl.formatMessage({id:'sysOperation.input.asset'}), value: '' }),
            assetList: Immutable.fromJS({
                list: [{ id: 1, name: '素材1', active: true, assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                { id: 4, name: '素材4', assetType: "source", type: "video" }], id: 1, name: '素材1', isEdit: true
            }),
            playerListAsset: Immutable.fromJS({
                list: [{ id: 1, name: '素材1', assetType: "system", type: "text" }, { id: 2, name: '素材2', assetType: "source", type: "video" }, { id: 3, name: '素材3', assetType: "source", type: "picture" },
                { id: 4, name: '素材4', assetType: "source", type: "timing" }, { id: 5, name: '素材5', assetType: "source", type: "video" }, { id: 6, name: '素材6', assetType: "source", type: "picture" }],
                id: 1, name: '素材1', isEdit: true
            }),
            page: Immutable.fromJS({
                pageSize: 10,
                current: 1,
                total: 2
            }),

            showModal: false,
            showUploadNotify: false,
            showUploadFile: false,
            uploadFileList: [],
            usefulListLength: 0,
            currentXhr: null,
            isUpload: false,
            afterFirstUpload: false,

            assetStyle: { "height": "309px", "position":"relative" },
            controlStyle: { "left": "auto", "right": "auto" },
            libStyle: {},
            //拖拽
            mouseXY: [0, 0],
            mouseCircleDelta: [0, 0],
            lastPress: null,
            isPressed: false,

            //播放列表单击
            isClick: false,
            //左侧栏添加单击
            isAddClick: false,
        }

        this.typeList = [{ id: 'playerPlan', name: '播放计划' }, { id: 'playerScene', name: '场景' }, { id: 'playerArea', name: "区域" }]

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

        this.addClick = this.addClick.bind(this);
        this.assetLibRemove = this.assetLibRemove.bind(this);
        this.playerAssetRemove = this.playerAssetRemove.bind(this);
        this.playerAssetMove = this.playerAssetMove.bind(this);

        this.updateTreeData = this.updateTreeData.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showUploadNotify = this.showUploadNotify.bind(this);
        this.hideUploadNotify = this.hideUploadNotify.bind(this)
        this.showUploadFile = this.showUploadFile.bind(this);
        this.hideUploadFile = this.hideUploadFile.bind(this);
        this.addUploadFile = this.addUploadFile.bind(this);
        this.cancelUploadFile = this.cancelUploadFile.bind(this);
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
        // this.updatePlayerTree();
        this.mounted && this.setSize();
        window.onresize = event => {
            this.mounted && this.setSize();
        }

        const { router } = this.props;
        if (router && router.location) {
            const routerState = router.location.state;
            this.setState({project:routerState?routerState.item:null},()=>{
                this.requestProgrameList();
            })
        }
    }

    componentDidMount() {
        // window.addEventListener("mousemove", this.handleMouseMove, true);
        // window.addEventListener("mouseup", this.handleMouseUp, true);
        console.log(this.props.router);
    }

    formatIntl=(formatId)=>{
        const {intl} = this.props;
        return intl?intl.formatMessage({id:formatId}):null;
        // return formatId;
    }

    handleMouseMove = ({ pageX, pageY })=> {
        const { isPressed, mouseCircleDelta: [dx, dy] } = this.state;
        if (isPressed) {
            const mouseXY = [pageX - dx, pageY - dy];
            this.setState({ mouseXY });
        }
    }

    handleMouseDown = (item, [pressX, pressY], { pageX, pageY })=> {
        this.assetSelect(item);
        this.setState({
            lastPress: item.get('id'),
            isPressed: true,
            mouseCircleDelta: [pageX - pressX, pageY - pressY],
            mouseXY: [pressX, pressY]
        })
    }

    handleMouseUp = ()=> {
        this.setState({ isPressed: false, mouseCircleDelta: [0, 0] });
    }

    componentWillUnmount() {
        this.mounted = false;
        this.props.actions.removeAllNotify();
        window.onresize = event => {

        }

        const list = this.state.uploadFileList;
        list.map((item) => {
            if (item !== undefined) {
                item.xhr.upload.removeEventListener('progress', this.uploadProgress)
                item.xhr.removeEventListener('load', this.uploadComplete);
                item.xhr.removeEventListener('error', this.uploadFailed);
                item.xhr.removeEventListener('abort', this.uploadCanceled);
            }
        })
    }

    setSize = ()=> {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let cleft = "auto";
        let cright = "auto";
        if (width < 1578) {
            cright = 0;
        } else {
            cleft = "535px";
        }

        this.setState({ controlStyle: { "left": cleft, "right": cright } });
    }

    requestProgrameList=()=>{
        const {project} = this.state;
        getProgramList(project.id, data=>{this.mounted && this.updateProgramList(data)})
    }

    updateProgramList=(data)=>{
        let newData = data.map(program=>{
            return Object.assign({}, program, {type:'plan', toggled:true, active: false, children:[]});
        })

        this.setState({playerData: newData}, ()=>{
            this.updatePlayerTree();
        });
    }

    requestSceneList = (programId)=>{
        const {project} = this.state;
        getSceneList(project.id, programId, data=>{this.mounted && this.updateProgramList(programId, data)})
    }

    updateSceneList = (programId, data)=>{
        let index = lodash.findIndex(this.state.playerData, program=>{return program.id == programId});
        let newData = data.map(scene=>{
            return Object.assign({}, scene, {type:'scene', toggled:true, active:false, children:[]});
        })

        this.state.playerData[index].children.push(newData);
        this.setState({playerData: this.state.playerData});
    }

    requestZoneList = (programId, sceneId)=>{
        const {project} = this.state;
        getZoneList(project.id, programId, sceneId, data=>{this.mounted && this.updateProgramList(programId, sceneId, data)})
    }

    updateZoneList = (programId, sceneId, data)=>{
        let programItem = lodash.find(this.state.playerData, program=>{return program.id == programId});
        let programIndex = lodash.findIndex(this.state.playerData, program=>{return program.id == programId});

        let sceneIndex = lodash.findIndex(programItem, scene=>{return scene.id == sceneId});
        let newData = data.map(scene=>{
            return Object.assign({}, scene, {type:'scene', toggled:true, active:false, children:[]});
        })

        this.state.playerData[programIndex].children[sceneIndex].push(newData);
        this.setState({playerData: this.state.playerData});
    }

    updatePlayerTree = ()=> {
        const { playerData } = this.state;
        const { actions } = this.props;
        console.log("playerData:", playerData);
        actions && actions.treeViewInit(playerData);

    }

    updateTreeData = (parentNode, node)=> {
        const treeList = updateTree(this.state.playerData, parentNode, node);
        console.log()
        this.setState({ playerData: treeList }, () => {
            this.updatePlayerTree();
        })
    }

    assetSelect = (item)=> {
        console.log(item.toJS());
        this.state.assetList = this.state.assetList.update('id', v => item.get('id'));
        this.setState({ assetList: this.state.assetList.update('name', v => item.get('name')) });
        // const curIndex = getIndexByKey(this.state.assetList.get('list'), 'id', item.get('id'));
        // this.setState({assetList: this.state.assetList.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    playerAssetSelect = (item)=> {
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
            case "timing":
                curType = "playerTimeAsset";
                break;
        }
        this.state.playerListAsset = this.state.playerListAsset.update('id', v => item.get('id'));
        this.setState({ isClick: true, curType: curType, playerListAsset: this.state.playerListAsset.update('name', v => item.get('name')) });
        // const curIndex = getIndexByKey(this.state.playerListAsset.get('list'), 'id', item.get('id'));
        // this.setState({playerListAsset: this.state.playerListAsset.updateIn(['list', curIndex, 'active'], v=>!item.get('active'))});
    }

    onChange = (id, value)=> {
        console.log("id:", id);
        let prompt = false;
        if (id == "assetType" || id == "assetSort") {
            this.state[id] = this.state[id].update('index', v => value);
            this.setState({ [id]: this.state[id].update('value', v => this.state[id].getIn(["list", value, "value"])) });
        }
        else if (id == "assetSearch") {
            this.setState({ assetSearch: this.state.assetSearch.update('value', v => value) });
        } else {
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

    pageChange = (current, pageSize)=> {
        let page = this.state.page.set('current', current);
        this.setState({ page: page }, () => {
        });
    }

    playerListAssetClick = (id)=> {
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

    assetList = (id)=> {
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



    addClick = (item)=> {
        console.log('addClick:', item.toJS());
    }

    assetLibRemove = (item)=> {
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

    playerAssetRemove = (item)=> {
        console.log('playerAssetRemove:', item.toJS());

        const itemId = item.get("id");
        const list = this.state.playerListAsset.get("list");
        const curIndex = getIndexByKey(list, "id", itemId);

        this.setState({ playerListAsset: this.state.playerListAsset.update("list", v => v.splice(curIndex, 1)) });
    }

    playerAssetMove = (id, item)=> {
        console.log('playerAssetMove:', id, item);
        const itemId = item.get("id");
        const list = this.state.playerListAsset.get("list");
        const curIndex = getIndexByKey(list, "id", itemId);

        this.state.playerListAsset = this.state.playerListAsset.update("list", v => v.splice(curIndex, 1));
        this.setState({ playerListAsset: this.state.playerListAsset.update("list", v => v.splice(id == "left" ? curIndex - 1 : curIndex + 1, 0, item)) });
    }

    updatePlayerScenePopup = ()=> {
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

    updatePlayerPlanPopup = ()=> {
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

    updatePlayerAreaPopup = ()=> {
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

    areaClick = (id)=> {
        const { actions } = this.props;
        let data = {}
        console.log(id);
        if (id == "add") {
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
        } else if (id == "complete") {

        } else {
            this.setState({ isAddClick: false }, () => {
                let type = "plan";
                let proType = "playerPlan";
                let name = "";
                switch (id) {
                    case "general":
                        type = "plan";
                        proType = "playerPlan";
                        name = '播放计划新建';
                        break;
                    case "cycle":
                        type = "plan2";
                        proType = "cyclePlan";
                        name = '周期插播计划'
                        break;
                    case "regular":
                        type = "plan3";
                        proType = "timingPlan";
                        name = '定时插播计划';
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

    playHandler = ()=> {

    }

    zoomOutHandler = ()=> {

    }

    zoomInHandler = ()=> {

    }

    saveHandler = ()=> {

    }

    savePlanHandler = ()=> {

    }

    quitHandler = ()=> {
        const { actions } = this.props;
        actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="未保存内容将会丢失，是否退出？"

            cancel={() => { actions.overlayerHide(); }} confirm={() => {
                actions.overlayerHide();
                this.props.router.push("/mediaPublish/playerList");
            }} />)
    }

    positionHandler = (id)=> {
        console.log(id);
    }

    searchSubmit = ()=> {

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

    showUploadNotify() {
        this.setState({
            showUploadNotify: true
        })
    }
    hideUploadNotify() {
        this.setState({
            showUploadNotify: false
        })
    }

    showUploadFile() {
        this.setState({
            showUploadFile: true
        })
    }
    hideUploadFile() {
        this.setState({
            showUploadFile: false
        })
    }
    uploadProgress = (e) => {
        if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);

            const list = this.state.uploadFileList, key = e.target.key;

            list[key].progress = progress + '%';
            this.setState({ uploadFileList: list })
        }
    }

    uploadComplete = (e) => {
        const list = this.state.uploadFileList, key = e.target.key, xhr = list[key].xhr;
        if(e.target.status===200){
            list[key].progress = this.formatIntl('mediaPublish.completed');
        }else{
            list[key].progress = this.formatIntl('mediaPublish.failed');
        }
        this.setState({ uploadFileList: list })

        const nextKey = key + 1;

        for (let i = nextKey; i < list.length; i++) {
            if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress==='Waiting')) {
                const currentXhr = list[i].xhr;
                currentXhr.open('POST', list[i].url, true);
                currentXhr.send(list[i].form);
                this.setState({ currentXhr: currentXhr });
                return;
            }
        }
        this.setState({ isUpload: false, currentXhr: null })
    }
    uploadFailed = (e) => {
        const list = this.state.uploadFileList, key = e.target.key, xhr = list[key].xhr;
        list[key].progress = this.formatIntl('mediaPublish.failed');
        this.setState({ uploadFileList: list })

        const nextKey = key + 1;

        for (let i = nextKey; i < list.length; i++) {
            if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress==='Waiting')) {
                const currentXhr = list[i].xhr;
                currentXhr.open('POST', list[i].url, true);
                currentXhr.send(list[i].form);
                this.setState({ currentXhr: currentXhr });
                return;
            }
        }
        this.setState({ isUpload: false, currentXhr: null })


    }
    uploadCanceled = (e) => {
        console.log('取消上传');
    }

    addUploadFile(file) {
        
        const self = this;
        const url = 'http://192.168.155.196:3001/api/file/upload';
        const name = file.name, key = file.key;

        const form = new FormData();
        form.append('file', file.data);
        form.append('name', name)

        const xhr = new XMLHttpRequest();
        xhr.key = key, xhr.upload.key = key;

        xhr.upload.addEventListener('progress', this.uploadProgress);
        xhr.addEventListener('load', this.uploadComplete);
        xhr.addEventListener('error', this.uploadFailed);
        xhr.addEventListener('abort', this.uploadCanceled);

        const newUploadFileList = this.state.uploadFileList;
        newUploadFileList.push({ name: file.name, progress: file.progress, xhr: xhr, url: url, form: form });
        const usefulListLength = this.state.usefulListLength + 1;

        this.setState({
            uploadFileList: newUploadFileList,
            usefulListLength: usefulListLength
        }, () => {
            this.showUploadNotify();

            if (!this.state.afterFirstUpload) {
                let currentList = this.state.uploadFileList, currentXhr;
                currentXhr = currentList[0].xhr;
                currentXhr.open('POST', currentList[0].url, true);
                currentXhr.send(currentList[0].form);
                this.setState({ currentXhr: currentXhr, afterFirstUpload: true, isUpload: true })
                return;
            }
            if (this.state.isUpload) {
                return;
            }

            let currentList = this.state.uploadFileList, currentXhr;
            currentXhr=currentList[currentList.length-1].xhr;
            currentXhr.open('POST',currentList[currentList.length-1].url,true);
            currentXhr.send(currentList[currentList.length-1].form);
            this.setState({currentXhr:currentXhr,isUpload:true})
        })
    }

    cancelUploadFile(index) {

        console.log('取消上传')
        const newUploadFileList = this.state.uploadFileList, xhr = newUploadFileList[index].xhr;

        if (this.state.currentXhr === xhr) {

            xhr.abort();
            xhr.upload.removeEventListener('progress', this.uploadProgress)
            xhr.removeEventListener('load', this.uploadComplete);
            xhr.removeEventListener('error', this.uploadFailed);
            xhr.removeEventListener('abort', this.uploadCanceled);

            const list = this.state.uploadFileList;
            const nextKey = index + 1;
            for (let i = nextKey; i < list.length; i++) {
                if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress==='Waiting')) {
                    const currentXhr = list[i].xhr;
                    currentXhr.open('POST', list[i].url, true);
                    currentXhr.send(list[i].form);

                    newUploadFileList[index] = undefined;
                    const usefulListLength = this.state.usefulListLength - 1;
                    this.setState({
                        uploadFileList: newUploadFileList,
                        usefulListLength: usefulListLength,
                        currentXhr: currentXhr
                    }, () => {
                        if (this.state.usefulListLength === 0) {
                            this.hideUploadNotify()
                        }
                    })
                    return;
                }
            }

            newUploadFileList[index] = undefined;
            const usefulListLength = this.state.usefulListLength - 1;
            this.setState({
                uploadFileList: newUploadFileList,
                usefulListLength: usefulListLength,
                currentXhr: null,
                isUpload: false
            }, () => {
                if (this.state.usefulListLength === 0) {
                    this.hideUploadNotify()
                }
            })
        }
        else if (xhr.readyState === 0) {
            newUploadFileList[index] = undefined;
            const usefulListLength = this.state.usefulListLength - 1;
            this.setState({
                uploadFileList: newUploadFileList,
                usefulListLength: usefulListLength
            }, () => {
                if (this.state.usefulListLength === 0) {
                    this.hideUploadNotify();
                }
            })
        }
        else {
            xhr.abort();
            xhr.upload.removeEventListener('progress', this.uploadProgress)
            xhr.removeEventListener('load', this.uploadComplete);
            xhr.removeEventListener('error', this.uploadFailed);
            xhr.removeEventListener('abort', this.uploadCanceled);

            newUploadFileList[index] = undefined;
            const usefulListLength = this.state.usefulListLength - 1;
            this.setState({
                uploadFileList: newUploadFileList,
                usefulListLength: usefulListLength
            }, () => {
                if (this.state.usefulListLength === 0) {
                    this.hideUploadNotify();
                }
            })
        }
    }

    onToggle = (node)=> {
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

    sidebarClick = (id)=> {
        const libStyle = id == 'propertyCollapsed' && !this.state.sidebarInfo[id] ? {'position':'absolute', 'top':'79px', 'bottom':'0px'} : {};
        const assetStyle = id == 'propertyCollapsed' && !this.state.sidebarInfo[id] ? {'position':'absolute','top':'61px','right':'20px','bottom':0,'left':'20px'}:{'height':'309px'}
        this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: !this.state.sidebarInfo[id] }), libStyle:libStyle, assetStyle:assetStyle});
    }

    render() {
        const {
            project, curType, playerData, sidebarInfo, playerListAsset, assetList, assetType, assetSort, assetSearch, page, assetStyle, controlStyle,libStyle,
            lastPress, isPressed, mouseXY, isClick, isAddClick
        } = this.state;
        const {router} = this.props;

        let add_title = "";
        switch (curType) {
            case "cyclePlan":
                add_title = ` (${this.formatIntl('mediaPublish.cyclePlayPlan')})`;
                break;
            case "timingPlan":
                add_title = ` (${this.formatIntl('mediaPublish.timingPlayPlan')})`;
                break;
        }

        console.log(assetStyle);

        return <div className={"container " + "mediaPublish-playerArea " + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName='app.mediaPublish' router={router} />
            <SideBar data={playerData} title={project && project.name} isClick={isClick} isAddClick={isAddClick}
                onClick={this.areaClick} onToggle={this.onToggle} />

            <Content className="player-area">
                <div className="left">
                    <div className="form-group control-container-top">
                        <div className="form-group play-container" onClick={() => this.playHandler()}>
                            <span className="icon icon_play"></span><span className="word"><FormattedMessage id='mediaPublish.play'/></span></div>
                        <div className="form-group zoom-out-container" onClick={() => this.zoomOutHandler()}>
                            <span className="icon icon_enlarge"></span><span className="word"><FormattedMessage id='mediaPublish.enlarge'/></span></div>
                        <div className="form-group zoom-in-container" onClick={() => this.zoomInHandler()}>
                            <span className="icon icon_reduce"></span><span className="word"><FormattedMessage id='mediaPublish.narrow'/></span></div>
                    </div>
                    <div className="img-container">
                        <img src="" />
                    </div>
                    <div className="control-container-bottom" style={controlStyle}>
                        <div className="form-group pull-right quit-container " onClick={() => this.quitHandler()}>
                            <span className="icon icon_send"></span><span><FormattedMessage id='mediaPublish.quit'/></span>
                        </div>
                        <div className="form-group pull-right save-plan-container "
                            onClick={() => this.savePlanHandler()}>
                            <span className="icon icon_save save-plan"></span><span><FormattedMessage id='mediaPublish.savePlan'/></span>
                        </div>
                    </div>
                </div>
                <div className="mediaPublish-footer">
                    <span className="asset-title"><FormattedMessage id='mediaPublish.playList'/></span>
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
                            <button className="btn btn-primary" onClick={() => this.playerListAssetClick('add')}><FormattedMessage id='button.add'/></button>
                            <button className="btn btn-gray" onClick={() => this.playerListAssetClick('edit')}><FormattedMessage id='button.edit'/></button>
                        </div>
                        <div className={"list-group " + (playerListAsset.get('isEdit') ? 'hidden' : '')}>
                            <button className="btn btn-gray" onClick={() => this.playerListAssetClick('remove')}><FormattedMessage id='button.delete'/>
                            </button>
                            <button className="btn btn-primary" onClick={() => this.playerListAssetClick('complete')}><FormattedMessage id='button.finish'/>
                            </button>
                        </div>
                    </div>
                </div>
            </Content>

            <div className={"right sidebar-info "}>
                <div className="row collapse-container" onClick={() => this.sidebarClick('collapsed')}>
                    <span className={sidebarInfo.collapsed ? "icon_horizontal" : "icon_vertical"}></span>
                </div>
                <div className="panel panel-default asset-property">
                    <div className="panel-heading pro-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('propertyCollapsed') }}>
                        <span className={sidebarInfo.collapsed ? "icon_info" :
                            "glyphicon " + (sidebarInfo.propertyCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span>{`${this.formatIntl('mediaPublish.property')}${add_title}`}
                    </div>
                    <div className={"panel-body " + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
                        {curType == 'playerProject' && <PlayerProject />}
                        {curType == 'playerPlan' && <PlayerPlan />}
                        {curType == 'playerScene' && <PlayerScene />}
                        {curType == 'playerArea' && <PlayerAreaPro playEndIndex={1} />}
                        {curType == 'cyclePlan' && <CyclePlan pause={1} />}
                        {curType == 'timingPlan' && <TimingPlan actions={this.props.actions} />}
                        {curType == 'playerPicAsset' && <PlayerPicAsset />}
                        {curType == 'playerVideoAsset' && <PlayerVideoAsset />}
                        {curType == 'playerText' && <PlayerText />}
                        {curType === 'digitalClock' && <DigitalClock />}
                        {curType === 'virtualClock' && <VirtualClock />}
                        {curType === 'playerTimeAsset' && <PlayerTimeAsset />}
                    </div>
                </div>

                <div className="panel panel-default asset-lib" style={libStyle}>
                    <div className="panel-heading lib-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('assetLibCollapsed') }}>
                        <span className={sidebarInfo.collapsed ? "icon_file" : "glyphicon " + (sidebarInfo.assetLibCollapsed ? "glyphicon-triangle-right" : "glyphicon-triangle-bottom")}></span><FormattedMessage id='mediaPublish.materialLib'/>
                    </div>
                    <div className={"panel-body " + (sidebarInfo.assetLibCollapsed ? 'assetLib-collapsed' : '')} style={sidebarInfo.propertyCollapsed?{'position':'absolute','top':'49px', 'bottom':0}:{}}>
                        <div className="asset-container" style={{height:sidebarInfo.propertyCollapsed?'100%':'auto'}}>

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
                                    <button className="btn btn-gray" onClick={() => this.assetList('edit')}><FormattedMessage id='button.edit'/></button>
                                    <button className="btn btn-primary add" onClick={this.showModal}><FormattedMessage id='button.import'/></button>
                                </div>
                                <div className={"btn-group " + (assetList.get('isEdit') ? 'hidden' : '')}>
                                    <button className="btn btn-gray" onClick={() => this.assetList('remove')}><FormattedMessage id='button.delete'/>
                                    </button>
                                    <button className="btn btn-primary" onClick={() => this.assetList('complete')}><FormattedMessage id='button.finish'/>
                                    </button>
                                </div>
                                <PreviewFile showModal={this.state.showModal} hideModal={this.hideModal} addUploadFile={this.addUploadFile} />
                            </div>
                            <div className="bottom" style={assetStyle}>
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
            <UploadNotify showUploadNotify={this.state.showUploadNotify} hideUploadNotify={this.hideUploadNotify} showUploadFile={this.showUploadFile} />
            {this.state.showUploadFile ? <UploadFile showUploadFile={this.state.showUploadFile} hideUploadFile={this.hideUploadFile} uploadFileList={this.state.uploadFileList} cancelUploadFile={this.cancelUploadFile} /> : null}
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
)(injectIntl(PlayerArea));
