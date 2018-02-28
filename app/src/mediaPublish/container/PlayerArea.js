/**
 * Created by a on 2017/10/20.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import '../../../public/styles/mediaPublish-playList.less';

import HeadBar from '../../components/HeadBar';
import SideBar from '../component/SideBar';
import Overlayer from '../../common/containers/Overlayer';

import Content from '../../components/Content';
import Page from '../../components/Page';

import RenderPropertyPanel from '../component/RenderPropertyPanel';
import RenderAssetLibTop from '../component/RenderAssetLibTop';
import RenderAssetLib from '../component/RenderAssetLib';
import RenderPlayerAsset from '../component/RenderPlayerAsset';

import ConfirmPopup from '../../components/ConfirmPopup';

import UploadNotify from '../component/uploadNotify';
import UploadFile from '../component/uploadFile';

import NotifyPopup from '../../common/containers/NotifyPopup';

import { treeViewInit } from '../../common/actions/treeView';
import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';

import Immutable from 'immutable';

import { Name2Valid } from '../../util/index';
import { getIndexByKey } from '../../util/algorithm';
import {formatTransformType, getAssetData, getTitleByType, getPropertyTypeByNodeType, getTipByType, getActiveItem, getItemOfScene} from '../util/index';

import {
  uploadMaterialFile, addItem, searchAssetList, getAssetListByTypeWithName, removeAssetById, previewPlayItem, projectPublish} from '../../api/mediaPublish';

import { initProject, updateOnToggle, updateCurType, updateCurNode, initItemList, playerAssetSelect, playerAssetCancel, updateItemEdit,
    addPlayerPlan, addPlayerSceneArea, applyClick, updateTreeJudge, treeOnMove, treeOnRemove, playerAssetMove, playerAssetRemove } from '../action/index';
import { FormattedMessage, injectIntl } from 'react-intl';

import lodash from 'lodash';

import PreviewImg from '../component/previewImg';
import getPreviewListCheck from '../component/previewImgList';
import systemFile from '../data/systemFile.json';
import systemInitFile from '../data/systemInitFile.json';
export class PlayerArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        assetLibCollapsed: false,
      },

      assetType: Immutable.fromJS({ list: [{ id: 1, value: '系统' }, { id: 2, value: '自定义' }], index: 0, value: '系统' }),
      assetSort: Immutable.fromJS({
        list: [{ id: 1, type: 'text', value: '素材文字' }, { id: 2, type: 'image', value: '素材图片' }, { id: 3, type: 'video', value: '素材视频' }],
        index: 0, value: '素材文字',
      }),
      assetSearch: Immutable.fromJS({ placeholder: this.formatIntl('sysOperation.input.asset'), value: '' }),
      assetList: Immutable.fromJS({
        list: [/*{ id: 1, name: '素材1', active: true, assetType: "system", type: "word" }, { id: 2, name: '素材2', assetType: "source", type: "video" },
                 { id: 3, name: '素材3', assetType: "source", type: "picture" }, { id: 4, name: '素材4', assetType: "source", type: "video" }*/], id: 1, name: '素材1', isEdit: true,
      }),
      page: Immutable.fromJS({
        pageSize: 10,
        current: 1,
        total: 2,
      }),

      //上传文件模块字段
      showModal: false,
      showUploadNotify: false,
      showUploadFile: false,
      uploadFileList: [],
      usefulListLength: 0,
      currentXhr: null,
      isUpload: false,
      afterFirstUpload: false,

      assetStyle: { 'height': '309px', 'position': 'relative' },
      controlStyle: { 'left': 'auto', 'right': 'auto' },
      libStyle: {},
      pageStyle: {},
      scrollHeight: 0,
      //拖拽
      mouseXY: [0, 0],
      mouseCircleDelta: [0, 0],
      lastPress: null,
      isPressed: false,

      //播放列表单击
      isClick: false,
      //左侧栏添加单击
      isAddClick: false,
      previewList: [], // 发送给后台的图片预览队列
      previewSrc: '', //图片预览的src
      scaling: 1, //图片预览缩放系数
      parentInfo: {}, // 图片预览父元素对比
      scenePlayList:{},
    };

    this.systemFile = [];
    this.systemInitFile = systemInitFile;
    this.typeList = [{ id: 'playerPlan', name: '播放计划' }, { id: 'playerScene', name: '场景' }, { id: 'playerArea', name: '区域' }];

  }
  componentWillMount() {
    this.mounted = true;
    this.updatePlayerTree();
    this.mounted && this.setSize();
    window.onresize = event => {
      this.mounted && this.setSize();
    };

    this.systemFile = systemFile.map(file => {
      return Object.assign({}, file, { assetType: 'system' });
    });

    const { router, actions } = this.props;
    if (router && router.location) {
      const routerState = router.location.state;
      const project = routerState ? routerState.item : null;
      actions.initProject(project);
    }

    this.requestAssetList();
    this.requestSearchAssetList();
  }

  componentDidMount() {
    // window.addEventListener("mousemove", this.handleMouseMove, true);
    // window.addEventListener("mouseup", this.handleMouseUp, true);
    this.updateSidebarInfoStyle();
  }

  componentWillReceiveProps(nextProps){
    this.updatePlayerTree();
  }
  /*shouldComponentUpdate(nextProps, nextState){
    if(this.props.IsUpdateTree){
      return true;
    }

    return false;
  }*/
  componentDidUpdate() {
    this.updatePlayerTree();
    this.updateSidebarInfoStyle();
    // this.setParentInfo();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.props.actions.removeAllNotify();
    window.onresize = event => {

    };

    const list = this.state.uploadFileList;
    list.map((item) => {
      if (item !== undefined) {
        this.cancelXhr(item.xhr);
      }
    });
  }

  formatIntl = (formatId) => {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : "";
    // return formatId;
  }

  updateSidebarInfoStyle = () => {
    const sidebarInfoDom = findDOMNode(this.refs.sidebarInfo);
    const assetPropertyDom = findDOMNode(this.refs.assetProperty);
    if (sidebarInfoDom && sidebarInfoDom.scrollHeight !== this.state.scrollHeight || assetPropertyDom && assetPropertyDom.offsetHeight !== this.state.assetProperHeight) {
      const pageStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? {} : { position: 'absolute' };
      const libStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? {} : { 'position': 'absolute', 'top': assetPropertyDom.offsetHeight + 30 + 'px', 'bottom': '0px' };
      const assetStyle = sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight ? { 'height': '309px' } : { 'position': 'absolute', 'top': '61px', 'right': '20px', 'bottom': 0, 'left': '20px' };

      this.setState({
        IsScroll: sidebarInfoDom.scrollHeight > sidebarInfoDom.clientHeight, scrollHeight: sidebarInfoDom.scrollHeight, assetProperHeight: assetPropertyDom.offsetHeight,
        libStyle: libStyle, assetStyle: assetStyle, pageStyle: pageStyle,
      }, () => {
        setTimeout(() => {
          this.setParentInfo();
        }, 400);
      });
    }
  }

  setParentInfo() {
    this.setState({
      parentInfo:{ width: this._previewImg.offsetWidth, height: this._previewImg.offsetHeight },
    });
  }

  handleMouseMove = ({ pageX, pageY }) => {
    const { isPressed, mouseCircleDelta: [dx, dy] } = this.state;
    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      this.setState({ mouseXY });
    }
  }

  handleMouseDown = (item, [pressX, pressY], { pageX, pageY }) => {
    this.assetSelect(item);
    this.setState({
      lastPress: item.get('id'),
      isPressed: true,
      mouseCircleDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY],
    });
  }

  handleMouseUp = () => {
    this.setState({ isPressed: false, mouseCircleDelta: [0, 0] });
  }

  setSize = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let cleft = 'auto';
    let cright = 'auto';
    if (width < 1578) {
      cright = 0;
    } else {
      cleft = '535px';
    }

    this.setState({ controlStyle: { 'left': cleft, 'right': cright } });
  }

  requestAssetList = () => {
    const { assetType, assetSort, assetSearch } = this.state;
    const type = assetType.get('index');
    const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
    const name = assetSearch.get('value');
    if (type === 0) {
      this.updatePageTotal(this.systemFile);
    } else {
      getAssetListByTypeWithName(aType, name, data => { this.mounted && this.updatePageTotal(data); });
    }
  }

  requestSearchAssetList = () => {
    const { assetType, assetSort, assetSearch, page } = this.state;
    const type = assetType.get('index');
    const aType = assetSort.getIn(['list', assetSort.get('index'), 'type']);
    const name = assetSearch.get('value');
    if (type === 0) {
      this.setState({ assetList: this.state.assetList.update('list', v => Immutable.fromJS(this.systemFile)) });
    } else {

      const current = page.get('current');
      const pageSize = page.get('pageSize');
      const limit = pageSize;
      const offset = (current - 1) * limit;
      searchAssetList(aType, name, offset, limit, data => { this.mounted && this.updateAssetList(data); });
    }
  }

  updatePageTotal = (data) => {
    this.setState({ page: this.state.page.update('total', v => data.length) });
  }

  updateAssetList = (data) => {
    const { page } = this.state;
    const curPage = page.get('current');
    const newData = data.map(item => {
      return Object.assign({}, item, { assetType: 'source' });
    });
    this.setState({ assetList: this.state.assetList.update('list', v => Immutable.fromJS(newData)) });
  }

  updatePlayerTree(){
    const { actions, playerData, IsUpdateTree } = this.props;
    console.log('IsUpdateTree:', IsUpdateTree, playerData);
    if(IsUpdateTree){
      actions.updateTreeJudge(false);
      actions.treeViewInit(playerData);
    }
  }

  assetSelect = (item) => {
  //  console.log(item.toJS());
    this.state.assetList = this.state.assetList.update('id', v => item.get('id'));
    this.setState({ assetList: this.state.assetList.update('name', v => item.get('name')) });
  }

  playerAssetSelect = (item) => {
    this.props.actions.playerAssetSelect(item);
    this.setPlayItemArray();
  }

  // 设定预览区域列表 Start
  // 获取区域列表，通过map拿到按照顺序排列的区域列表，
  // 此步并没有使用区域字典，因为区域字典是JSON无序，而要求的预览列表必须有序
  getAreaList() {
    let areaList = [];
    const { parentNode: sceneInfo = [] } = this.props;
    if (sceneInfo === []) {
      return false;
    } else {
      areaList = sceneInfo.children.map(item => { return item.id; });
    }
    return areaList;
  }

  // 获取区域字典，作为接下来所有验证的凭据
  getAreaDic() {
    let areaDic = {};
    const projectId = this.props.project.id;
    const programId = this.props.parentParentNode.id;
    const sceneId = this.props.parentNode.id;
    areaDic = getItemOfScene(this.props.curSceneItem, projectId, programId, sceneId);
    return areaDic;
  }

  // 初始化预览列表，被调用于新场景下第一次预览，此时没有任何播放项被选中
  initPreviewList() {
    const areaList = this.getAreaList();
    const curAreaId = this.props.curNode.id;
    const selectedItem = this.props.playerListAsset.get('id');
    const previewList = areaList.map((areaId) => {
      if (areaId === curAreaId) {
        return { areaId: curAreaId, playItemId: selectedItem };
      }
      return { areaId: areaId, playItemId: 65535 };
    });
    this.setState({
      previewList: previewList,
    }, () => {return this.getPreviewImg();});
  }

  /* 根据获取到的区域列表对选择的播放项进行排序
  *  如果该区域下没有播放项被选中，则设为65535
  *  test_case: 
  * areaList: [1, 2, 3, 4, 5] 
  * previewList [
  * { areaId: 1, playItemId: 1 }, 
  * { areaId: 3, playItemId: 1 }, 
  * { areaId: 4, playItemId: 1 }, 
  * { areaId: 5, playItemId: 1 }
  * ]
  * 最终得到: [
  * { areaId: 1, playItemId: 1 },
  * { areaId: 2, playitem:65535 },
  * { areaId: 3, playItemId: 1 }, 
  * { areaId: 4, playItemId: 1 }, 
  * { areaId: 5, playItemId: 1 }]
  */

  setPreviewListOrder(previewList) {  
    let orderedPreviewList = [];
    const areaList = this.getAreaList();
    orderedPreviewList = areaList.map((areaId) => {
      for (let i = 0; i < previewList.length; i++) {
        if (areaId === previewList[i].areaId) {
          return previewList[i];
        }
      }
      return { areaId: areaId, playItemId: 65535 };
    });
    return orderedPreviewList;
  }

  // 设置被选中，将要预览的播放项
  setPlayItemArray() {
    const { state } = this;
    if (!state.previewList || state.previewList.length == 0) {
      return this.initPreviewList();
    } else {
      const { previewList } = this.state;
      const orederedPreviewList = this.setPreviewListOrder(previewList);
      const curAreaId = this.props.curNode.id;
      const selectedItem = this.props.playerListAsset.get('id');
      const newPrevieList = orederedPreviewList.map((previewItem) => {
        if (previewItem.areaId === curAreaId) {
          return { areaId: curAreaId, playItemId: selectedItem };
        } else {
          return previewItem;
        }
      });
      this.setState({
        previewList: newPrevieList,
      }, () => {return this.getPreviewImg();});
    }
  }

  getFixedPlayItemList(areaIdList, playItemObj) {
    let fixedPlayItemObj = {};
    for (let i = 0; i < areaIdList.length; i++) {
      const areaId = areaIdList[i];
      fixedPlayItemObj[areaId] = playItemObj[areaId] || [];
    }
    return fixedPlayItemObj;
  }

  getPreviewImg() {
    const projectId = this.props.project.id;
    const programId = this.props.parentParentNode.id;
    const sceneId = this.props.parentNode.id;
    const zoneId = this.props.curNode.id;
    const items = this.state.previewList;
    const areaDic = this.getAreaDic();
    const compareAreaDic = this.getAreaList();
    const finalAreaDic = this.getFixedPlayItemList(compareAreaDic, areaDic);
    console.log('Befor Compare =======', areaDic, 'Target AreaList =======', compareAreaDic, finalAreaDic);

    // 最后再确认一次数值，避免因为各种原因导致区域字典发生改变以引起的BUG.
    // 此步主要解决的是当用户删除了区域最后一个播放项后，将无法通过点击来记录这一操作，将通过数据验证将原本的Id替换为65535.
    const finalItem = getPreviewListCheck(items, finalAreaDic).map(item => { return item.playItemId; });
    const requestJson = { projectId, programId, sceneId, zoneId, finalItem };
    return previewPlayItem(requestJson, data => { this.setState({ previewSrc:data }); });
  }
  // 设定预览列表 End

  onChange = (id, value) => {
    let prompt = false;
    if (id == 'assetType' || id == 'assetSort') {
      this.state[id] = this.state[id].update('index', v => value);
      this.setState({ [id]: this.state[id].update('value', v => this.state[id].getIn(['list', value, 'value'])) }, () => {
        this.requestAssetList();
        this.requestSearchAssetList();
      });
    } else if (id == 'assetSearch') {
      this.setState({ assetSearch: this.state.assetSearch.update('value', v => value) }, () => {
        this.requestAssetList();
        this.requestSearchAssetList();
      });
    } else {
      const val = value.target.value;
      if (!Name2Valid(val)) {
        prompt = true;
      }

      this.setState({
        property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], { value: val }) }),
        prompt: Object.assign({}, this.state.prompt, { [id]: prompt }),
      });
    }
  }

  pageChange = (current, pageSize) => {
    let page = this.state.page.set('current', current);
    this.setState({ page: page }, () => {
      this.requestSearchAssetList();
    });
  }

  playerListAssetClick = (id) => {
    if (id == 'add') {
      let addList = getActiveItem(this.state.assetList);

      if (addList.length == 0) {
        this.props.actions.addNotify(0, '请选中右边素材库素材');
      }
    } else if (id == 'edit') {
      this.props.actions.updateItemEdit(false);
    } else if (id == 'remove') {
      const { actions } = this.props;
      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
        cancel={() => { actions.overlayerHide(); }} confirm={() => {

        }} />);
    } else if (id == 'complete') {
      this.props.actions.updateItemEdit(true);
    }
  }

  assetList = (id) => {
    if (id == 'add') {

    } else if (id == 'edit') {
      this.setState({ assetList: this.state.assetList.update('isEdit', v => false) });
    } else if (id == 'remove') {
      const { actions } = this.props;
      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="是否删除选中素材？"
        cancel={() => { actions.overlayerHide(); }} confirm={() => {

        }} />);
    } else if (id == 'complete') {
      this.setState({ assetList: this.state.assetList.update('isEdit', v => true) });
    }
  }

  addClick = (item) => {
    const { project, parentParentNode, parentNode, curNode } = this.props;
    if (!curNode || curNode.type !== 'area') {
      this.props.actions.addNotify(0, this.formatIntl('mediaPublish.area.alert'));
      return false;
    }

    if (typeof curNode.id === 'string' && curNode.id.indexOf('area') > -1) {
      this.props.actions.addNotify(0, '请提交区域');
      return false;
    }

    const data = item.toJS();
    const index = lodash.findIndex(this.systemInitFile, file => { return file.baseInfo.type == data.type; });
    if (index < 0 && !data.type) {
      return this.props.actions.addNotify(0, 'asset unknow type');
    }
    const itemType = index > -1 ? data.type : formatTransformType(data.type);
    const itemData = index > -1 ? this.systemInitFile[index] : getAssetData(data);
    addItem(project.id, parentParentNode.id, parentNode.id, curNode.id, itemType, itemData, data => {
      this.requestItemList(parentParentNode.id, parentNode.id, curNode.id);
    });
  }

  assetLibRemove = (item) => {
    console.log('assetLibRemove:', item.toJS());
    const { actions } = this.props;
    actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={'是否删除选中素材？'}
      cancel={() => { actions.overlayerHide(); }} confirm={() => {
        const itemId = item.get('id');
        const list = this.state.assetList.get('list');
        const curIndex = getIndexByKey(list, 'id', itemId);

        removeAssetById(itemId, data => {
          actions.overlayerHide();
          this.requestAssetList();
          this.requestSearchAssetList();
        });
      }} />);

  }

  playerAssetRemove = (item) => {
    this.props.actions.playerAssetRemove(item);
  }

  playerAssetMove = (id, item) => {
    this.props.actions.playerAssetMove(id, item);
  }

  areaClick = (id) => {
    const { actions, project } = this.props;

    if (id == 'add') {
      if (this.props.curType == 'playerProject') {
        this.setState({ isAddClick: true });
      } else {
        this.props.actions.addPlayerSceneArea();
      }
    } else if (id == 'edit') {
      this.setState({ isAddClick: false }, () => {
        this.props.actions.initItemList();
      });
    } else if (id == 'remove') {
      let tips = getTipByType(this.state.curType);

      actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips={tips}
        cancel={() => { actions.overlayerHide(); }} confirm={() => {
        }} />);
    } else if (id == 'project') {
      this.props.actions.updateCurType('playerProject', false);
    } else if (id == 'complete') {

    } else {
      this.setState({ isAddClick: false }, ()=>{this.props.actions.addPlayerPlan(id)})
    }
  }
  
  applyClick = (id, data) => {
    this.props.actions.applyClick(id, data);
  }

  playHandler = () => {

  }

  zoomOutHandler = () => {
    const { scaling: curScaling } = this.state;
    const scaling = curScaling + 0.3;
    if (scaling > 2) {
      return false;
    }
    this.setState({
      scaling: scaling,
    });
  }

  zoomInHandler = () => {
    const { scaling: curScaling } = this.state;
    const scaling = curScaling - 0.3;
    if (scaling < 0) {
      return false;
    }
    this.setState({
      scaling: scaling,
    });
  }

  savePlanHandler = () => {
    projectPublish(this.state.project.id, () => {

    });
  }

  quitHandler = () => {
    const { actions } = this.props;
    actions.overlayerShow(<ConfirmPopup iconClass="icon_popup_delete" tips="未保存内容将会丢失，是否退出？"

      cancel={() => { actions.overlayerHide(); }} confirm={() => {
        actions.overlayerHide();
        this.props.router.push('/mediaPublish/playProject');
      }} />);
  }

  positionHandler = (id) => {
    console.log(id);
  }

  searchSubmit = () => {
    this.requestAssetList();
    this.requestSearchAssetList();
  }

  showModal = () => {
    this.setState({ showModal: true });
  }
  hideModal = () => {
    this.setState({ showModal: false });
  }
  showUploadNotify = () => {
    this.setState({ showUploadNotify: true });
  }
  hideUploadNotify = () => {
    this.setState({ showUploadNotify: false });
  }
  showUploadFile = () => {
    this.setState({ showUploadFile: true });
  }
  hideUploadFile = () => {
    this.setState({ showUploadFile: false });
  }
  uploadProgress = (e) => {
    if (e.lengthComputable) {
      const progress = Math.round((e.loaded / e.total) * 100);
      const list = this.state.uploadFileList, key = e.target.key;
      list[key].progress = progress + '%';
      this.setState({ uploadFileList: list });
    }
  }
  uploadComplete = (e) => {
    const { key, status } = e.target;
    const list = this.state.uploadFileList;
    if (status === 200) {
      list[key].progress = this.formatIntl('mediaPublish.completed');
      this.requestAssetList();
      this.requestSearchAssetList();
    } else {
      list[key].progress = this.formatIntl('mediaPublish.failed');
    }
    this.setState({ uploadFileList: list });
    const nextKey = key + 1;
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({ currentXhr });
        return;
      }
    }
    this.setState({ isUpload: false, currentXhr: null });//无待上传文件时
  }
  uploadFailed = (e) => {
    const { key } = e.target;
    const list = this.state.uploadFileList;
    list[key].progress = this.formatIntl('mediaPublish.failed');
    this.setState({ uploadFileList: list });
    const nextKey = key + 1;
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({ currentXhr });
        return;
      }
    }
    this.setState({ isUpload: false, currentXhr: null });//无待上传文件时
  }
  uploadCanceled = (e) => {
    console.log('取消上传');
  }
  createUploadXHR = (file, cb) => {
    const { name, key, type } = file;
    const form = new FormData();
    form.append('file', file.data);
    form.append('name', name);
    form.append('type', type);
    const xhr = new XMLHttpRequest();
    xhr.key = key, xhr.upload.key = key;
    xhr.upload.addEventListener('progress', this.uploadProgress);
    xhr.addEventListener('load', this.uploadComplete);
    xhr.addEventListener('error', this.uploadFailed);
    xhr.addEventListener('abort', this.uploadCanceled);
    const { uploadFileList, usefulListLength } = this.state;
    uploadFileList.push({ name: file.name, progress: file.progress, xhr: xhr, form: form });
    this.setState({ uploadFileList, usefulListLength: usefulListLength + 1 }, cb);
  }
  addUploadFile = (file) => {
    this.createUploadXHR(file, () => {
      this.showUploadNotify();
      const { uploadFileList, afterFirstUpload, isUpload } = this.state;
      //第一次上传文件
      if (!afterFirstUpload) {
        const currentXhr = uploadFileList[0].xhr;
        uploadMaterialFile(uploadFileList, 0);
        this.setState({ currentXhr, afterFirstUpload: true, isUpload: true });
        return;
      }
      if (isUpload) {
        return;
      }
      //已上传过文件，所有已完成，下次继续上传触发最新的文件
      const currentXhr = uploadFileList[uploadFileList.length - 1].xhr;
      uploadMaterialFile(uploadFileList, uploadFileList.length - 1);
      this.setState({ currentXhr, isUpload: true });
    });
  }
  cancelXhr = (xhr) => {
    xhr.abort();
    xhr.upload.removeEventListener('progress', this.uploadProgress);
    xhr.removeEventListener('load', this.uploadComplete);
    xhr.removeEventListener('error', this.uploadFailed);
    xhr.removeEventListener('abort', this.uploadCanceled);
  }
  cancelCurrentXhr = (list, index, usefulListLength) => {
    const nextKey = index + 1;
    //后面还有待上传文件时
    for (let i = nextKey; i < list.length; i++) {
      if (list[i] !== undefined && (list[i].progress === '待上传' || list[i].progress === 'Waiting')) {
        const currentXhr = list[i].xhr;
        uploadMaterialFile(list, i);
        this.setState({
          uploadFileList: list,
          usefulListLength,
          currentXhr,
        }, () => {
          if (this.state.usefulListLength === 0) {
            this.hideUploadNotify();
          }
        });
        return;
      }
    }
    //没有待上传文件时
    this.setState({
      uploadFileList: list,
      usefulListLength,
      currentXhr: null,
      isUpload: false,
    }, () => {
      if (this.state.usefulListLength === 0) {
        this.hideUploadNotify();
      }
    });
  }
  cancelUploadFile = (index) => {
    const list = this.state.uploadFileList, xhr = list[index].xhr;
    this.cancelXhr(xhr);
    list[index] = undefined;
    const usefulListLength = this.state.usefulListLength - 1;
    if (xhr === this.state.currentXhr) {
      //取消当前正在上传的文件
      this.cancelCurrentXhr(list, index, usefulListLength);
      return;
    }
    //取消已上传或未上传的文件
    this.setState({
      uploadFileList: list,
      usefulListLength,
    }, () => {
      if (this.state.usefulListLength === 0) {
        this.hideUploadNotify();
      }
    });
  }

  onRemove = node => {
    this.props.actions.treeOnRemove(node);
  }

  onMove = (key, node) => {
    this.props.actions.treeOnMove(key, node);
  }

  onToggle = (node) => {
    const type = getPropertyTypeByNodeType(node);
    this.props.actions.initItemList();
    this.props.actions.updateOnToggle(node);
    if(type === "playerArea"){
      this.props.actions.playerAssetCancel();
    }
  }

  sidebarClick = (id) => {
    const { sidebarInfo } = this.state;
    const state = !sidebarInfo[id];
    if (id == 'propertyCollapsed') {
      this.state.sidebarInfo['propertyCollapsed'] = state;
    }

    this.setState({ sidebarInfo: Object.assign({}, this.state.sidebarInfo, { [id]: state }) });
  }

  render() {
    const {
      sidebarInfo, assetList, assetType, assetSort, assetSearch, page, IsScroll, assetStyle, controlStyle, libStyle, pageStyle,
      lastPress, isPressed, mouseXY, isAddClick, previewSrc, scaling, parentInfo} = this.state;
    const { router, curType, curNode, project, parentNode, parentParentNode, playerData,
        isClick, playerListAsset } = this.props;
    const add_title = getTitleByType(curType, this.formatIntl);
    const imgInfo = { width: project?project.width:0, height: project?project.height:0, src: previewSrc.image };

    return <div className={'container ' + 'mediaPublish-playerArea ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
      <HeadBar moduleName="app.mediaPublish" router={router} />
      <SideBar data={playerData} title={project && project.name} isActive={curType == 'playerProject'} isClick={isClick} isAddClick={isAddClick}
        onClick={this.areaClick} onToggle={this.onToggle} onMove={this.onMove} onRemove={this.onRemove} />

      <Content className="player-area">
        <div className="left">
          <div className="form-group control-container-top">
            <div className="form-group play-container" onClick={() => this.playHandler()}>
              <span className="icon icon_play"></span><span className="word"><FormattedMessage id="mediaPublish.play" /></span></div>
            <div className="form-group zoom-out-container" onClick={() => this.zoomOutHandler()}>
              <span className="icon icon_enlarge"></span><span className="word"><FormattedMessage id="mediaPublish.enlarge" /></span></div>
            <div className="form-group zoom-in-container" onClick={() => this.zoomInHandler()}>
              <span className="icon icon_reduce"></span><span className="word"><FormattedMessage id="mediaPublish.narrow" /></span></div>
          </div>
          <div className="img-container" ref={_previewImg => this._previewImg = _previewImg}>
            <PreviewImg imgInfo={imgInfo} scaling={scaling} parentInfo={parentInfo}/>
          </div>
          <div className="control-container-bottom" style={controlStyle}>
            <div className="form-group pull-right quit-container " onClick={() => this.quitHandler()}>
              <span className="icon icon_send"></span><FormattedMessage id="mediaPublish.quit" />
            </div>
            <div className="form-group pull-right save-plan-container "
              onClick={() => this.savePlanHandler()}>
              <span className="icon icon_save save-plan"></span><FormattedMessage id="mediaPublish.publish" />
            </div>
          </div>
        </div>
        <div className="mediaPublish-footer">
          {/*<span className="asset-title"><FormattedMessage id='mediaPublish.playList'/></span>*/}
          <RenderPlayerAsset curNode={curNode} playerListAsset={playerListAsset} playerAssetSelect={this.playerAssetSelect} playerAssetMove={this.playerAssetMove} playerAssetRemove={this.playerAssetRemove} />
          <div className="pull-right control-container">
            <div className={'list-group ' + (playerListAsset.get('isEdit') ? '' : 'hidden')}>
              <button className="btn btn-primary" onClick={() => this.playerListAssetClick('add')}><FormattedMessage id="button.add" /></button>
              <button className="btn btn-gray" onClick={() => this.playerListAssetClick('edit')}><FormattedMessage id="button.edit" /></button>
            </div>
            <div className={'list-group ' + (playerListAsset.get('isEdit') ? 'hidden' : '')}>
              <button className="btn btn-gray" onClick={() => this.playerListAssetClick('remove')}><FormattedMessage id="button.delete" />
              </button>
              <button className="btn btn-primary" onClick={() => this.playerListAssetClick('complete')}><FormattedMessage id="button.finish" />
              </button>
            </div>
          </div>
        </div>
      </Content>
      <div ref="sidebarInfo" className={'right sidebar-info '}>
        <div className="row collapse-container" onClick={() => this.sidebarClick('collapsed')}>
          <span className={sidebarInfo.collapsed ? 'icon_horizontal' : 'icon_vertical'}></span>
        </div>
        <div ref="assetProperty" className="panel panel-default asset-property">
          <div className="panel-heading pro-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('propertyCollapsed'); }}>
            <span className={sidebarInfo.collapsed ? 'icon_info' :
              'glyphicon ' + (sidebarInfo.propertyCollapsed ? 'glyphicon-triangle-right' : 'glyphicon-triangle-bottom')}></span>{`${this.formatIntl('mediaPublish.property')}${add_title}`}
          </div>
          <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
            <RenderPropertyPanel curType={curType} project={project} parentParentNode={parentParentNode} parentNode={parentNode} curNode={curNode} playerListAsset={playerListAsset}
              actions={this.props.actions} applyClick={this.applyClick} />
          </div>
        </div>

        <div className="panel panel-default asset-lib" style={libStyle}>
          <div className="panel-heading lib-title" onClick={() => { !sidebarInfo.collapsed && this.sidebarClick('assetLibCollapsed'); }}>
            <span className={sidebarInfo.collapsed ? 'icon_file' : 'glyphicon ' + (sidebarInfo.assetLibCollapsed ? 'glyphicon-triangle-right' : 'glyphicon-triangle-bottom')}></span><FormattedMessage id="mediaPublish.materialLib" />
          </div>
          <div className={'panel-body ' + (sidebarInfo.assetLibCollapsed ? 'assetLib-collapsed' : '')} style={!IsScroll ? { 'position': 'absolute', 'top': '49px', 'bottom': 0, 'right': 0, 'left': 0 } : {}}>
            <div className="asset-container" style={{ height: !IsScroll ? '100%' : 'auto' }}>
              <RenderAssetLibTop assetType={assetType} assetSort={assetSort} assetSearch={assetSearch} assetListPro={assetList} showModalPro={this.state.showModal}
                onChange={this.onChange} searchSubmit={this.searchSubmit} assetList={this.assetList} showModal={this.showModal} hideModal={this.hideModal} addUploadFile={this.addUploadFile} />
              <div className="bottom" style={assetStyle}>
                <RenderAssetLib playerListAsset={playerListAsset} assetList={assetList} lastPress={lastPress} isPressed={isPressed} mouseXY={mouseXY} assetSelect={this.assetSelect} addClick={this.addClick} assetLibRemove={this.assetLibRemove} />
                <div className="page-container" style={pageStyle}>
                  <Page className={'page ' + (page.get('total') == 0 ? 'hidden' : '')} showSizeChanger
                    pageSize={page.get('pageSize')}
                    current={page.get('current')} total={page.get('total')}
                    onChange={this.pageChange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      <NotifyPopup />
      <Overlayer />
      <UploadNotify showUploadNotify={this.state.showUploadNotify} hideUploadNotify={this.hideUploadNotify} showUploadFile={this.showUploadFile} />
      {this.state.showUploadFile ? <UploadFile showUploadFile={this.state.showUploadFile} hideUploadFile={this.hideUploadFile} uploadFileList={this.state.uploadFileList} cancelUploadFile={this.cancelUploadFile} /> : null}
    </div>;
  }
}

const mapStateToProps = state => {
  return {
    sidebarNode: state.mediaPublish.sidebarNode,
    project: state.mediaPublish.project,
    parentParentNode: state.mediaPublish.parentParentNode,
    parentNode: state.mediaPublish.parentNode,
    curNode: state.mediaPublish.curNode,
    curType:state.mediaPublish.curType,
    playerData: state.mediaPublish.playerData,
    playerListAsset: state.mediaPublish.playerListAsset,
    curSceneItem: state.mediaPublish.curSceneItem,
    IsUpdateTree: state.mediaPublish.IsUpdateTree
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
      treeViewInit: treeViewInit, initProject: initProject, updateCurType: updateCurType, updateCurNode: updateCurNode,
      updateOnToggle: updateOnToggle, initItemList: initItemList, playerAssetSelect: playerAssetSelect, playerAssetCancel: playerAssetCancel,
      updateItemEdit: updateItemEdit, addPlayerPlan: addPlayerPlan, addPlayerSceneArea: addPlayerSceneArea, applyClick: applyClick,
      treeOnMove: treeOnMove, treeOnRemove: treeOnRemove, playerAssetMove: playerAssetMove, playerAssetRemove: playerAssetRemove,updateTreeJudge:updateTreeJudge
    }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayerArea));