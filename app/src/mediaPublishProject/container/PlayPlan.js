/**
 * Created by a on 2018/3/8.
 */
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../../public/styles/mediaPublish-project.less';

import HeadBar from '../component/HeadBar';
import SideBar from '../component/SideBar';
import Content from '../../components/Content';

import SidebarInfo from '../component/SidebarInfo';
import TreeView from '../../components/TreeView';

import RenderPlayerAsset from '../component/RenderPlayerAsset';
import RenderPropertyPanel from '../component/RenderPropertyPanel';
import PlayerAssetLibPopup from '../component/PlayerAssetLibPopup';
import PreviewFile from '../component/previewFile';

import NotifyPopup from '../../common/containers/NotifyPopup';
import Overlayer from '../../common/containers/Overlayer';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import {treeViewInit} from '../../common/actions/treeView';

import {initProject, initPlan, initScene, initZone, initItem, initCurnode, requestSceneList, requestZoneList, requestItemList,
  updateTreeJudge, addPlayerSceneArea, treeOnMove, treeOnRemove, playerAssetRemove, playerAssetMove, applyClick, clearTreeState, addItemToArea} from '../action/index';

import {uploadMaterialFile} from '../../api/mediaPublish';

import {tranformAssetType} from '../util/index';

import lodash from 'lodash';
export class PlayPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        assetLibCollapsed: false,
      },

      //上传文件模块字段
      showModal: false,
      showUploadNotify: false,
      showUploadFile: false,
      uploadFileList: [],
      usefulListLength: 0,
      currentXhr: null,
      isUpload: false,
      afterFirstUpload: false,
    };

    this.formatIntl = this.formatIntl.bind(this);

    this.sidebarClick = this.sidebarClick.bind(this);
    this.headbarClick = this.headbarClick.bind(this);

    this.playerAssetSelect = this.playerAssetSelect.bind(this);
    this.playerAssetRemove = this.playerAssetRemove.bind(this);
    this.playerAssetMove = this.playerAssetMove.bind(this);
    this.playerAssetAdd = this.playerAssetAdd.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.getPropertyName = this.getPropertyName.bind(this);
  }

  componentWillMount() {
    const {router, actions} = this.props;
    this.updateSceneTree();
    if (this.props.plan) {
      actions.requestSceneList(this.props.plan.id);
    }else {
      if (router && router.location) {
        const routerState = router.location.state;
        const project = routerState ? routerState.project : null;
        const plan = routerState ? routerState.item : null;
        project && actions.initProject(project);
        plan && actions.initPlan(plan);
        setTimeout(() => {plan && actions.requestSceneList(plan.id);}, 66);
      }
    }
  }

  componentDidUpdate() {
    this.mounted = true;
    const {IsUpdateTree, actions} = this.props;
    if (IsUpdateTree) {
      this.updateSceneTree();
    }
  }

  componentWillUnmount() {
    this.mounted =false;
  }

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : '';
    // return formatId;
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

  updateSceneTree() {
    const {data, plan, actions} = this.props;

    actions.updateTreeJudge(false);
    if (!data || data.length === 0) {
      return actions.treeViewInit([]);
    }
    const treeData = lodash.find(data, planItem => { return planItem.id == plan.id;}).children;
    console.log('updateSceneTree:', treeData);
    actions.treeViewInit(treeData, false);
  }

  playerAssetSelect(item) {
    this.props.actions.initCurnode(item);
    this.props.actions.initItem(item);

  }

  playerAssetRemove(item) {
    this.props.actions.playerAssetRemove(item);
  }

  playerAssetMove(index) {
    this.props.actions.playerAssetMove(index);
  }

  playerAssetAdd(type){
    console.log('playerAssetAdd:');
    const {actions} = this.props;
    actions.overlayerShow(<PlayerAssetLibPopup title="素材库" assetType={type} actions={actions} onCancel={()=>{
      actions.overlayerHide();
    }} onConfirm={(data)=>{
      this.props.actions.addItemToArea(data, this.formatIntl);
      actions.overlayerHide();
    }} assetAdd={()=>{
      actions.overlayerHide();
      this.showModal()
    }}/>);
  }

  onToggle(node) {
    const {plan, scene, actions} = this.props;
    if (node.type === 'scene') {
      actions.initScene(node);
      if (!node.toggled) {
        actions.clearTreeState();
        actions.requestZoneList(plan.id, node.id);
      }
    } else if (node.type === 'area') {
      actions.initZone(node);
      actions.requestItemList(plan.id, scene.id, node.id);
    }

    actions.initCurnode(node);
  }

  headbarClick(key) {
    console.log('headbarClick:', key);
    switch (key) {
    case 'edit':
      this.editAlert() && this.navigatorScene();
      break;
    case 'up':
    case 'down':
      this.editAlert() && this.props.actions.treeOnMove(key, this.props.curNode.type === 'scene' ? this.props.scene:this.props.zone);
      break;
    case 'remove':
      this.editAlert() && this.props.actions.treeOnRemove(this.props.curNode.type === 'scene' ? this.props.scene:this.props.zone);
      break;
    default:
      this.addAlert() && this.props.actions.addPlayerSceneArea(this.props.curNode);
      break;
    }
  }

  editAlert() {
    const {scene, zone, curNode, actions} = this.props;
    if (!curNode || curNode.type === 'scene' && !scene || curNode.type === 'area' && !zone) {
      actions.addNotify(0, '请选择播放场景或播放区域。');
      return false;
    }
    return true;
  }

  addAlert() {
    const {curNode, actions} = this.props;
    console.log('addAlert:', curNode);
    if (curNode && typeof curNode.id === 'string' && curNode.id.indexOf('area') > -1) {
      actions.addNotify(0, '请提交新建区域。');
      return false;
    }

    return true;
  }

  sidebarClick(key) {
    const {sidebarInfo} = this.state;
    this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {[key]: !sidebarInfo[key]})});
  }

  applyClick(id, data) {
    this.props.actions.applyClick(id, data);
  }

  getPropertyName(curNode) {
    if (!curNode) {
      return '';
    }
    switch (curNode.type) {
    case 'scene':
      return '场景';
    case 'area':
      return '区域';
    default:
      return '素材';
    }
  }

  render() {
    const {sidebarInfo} = this.state;
    const {data, project, plan, scene, zone, item, curNode, router, actions} = this.props;
    const playerListAsset = zone && zone.children ? zone.children : [];

    return <div className={'container ' + 'mediaPublish-playPlan ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
      <HeadBar moduleName="app.mediaPublish" router={router} url={{
        pathname: '/mediaPublish/playProject/' + (project ? project.id : ''),
        state: { item: project },
      }} />
      <SideBar isEdit={false} onClick={this.headbarClick}>
        <TreeView className="mediaPublish" IsCancelSelect={false} onToggle={ (node) => this.onToggle(node) }/>
      </SideBar>

      <Content className="play-project">
                播放场景列表
        <div className="mediaPublish-footer">
          {/*<span className="asset-title"><FormattedMessage id='mediaPublish.playList'/></span>*/}
          <RenderPlayerAsset curNode={curNode} playerListAsset={playerListAsset} curItem={item} playerAssetSelect={this.playerAssetSelect}
                             playerAssetMove={this.playerAssetMove} playerAssetRemove={this.playerAssetRemove} playerAssetAdd={this.playerAssetAdd}/>
        </div>
        <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={() => {this.sidebarClick('collapsed');}}>
          <div ref="assetProperty" className="panel panel-default asset-property">
            <div className={'panel-heading pro-title ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed':'')} onClick={() => { this.sidebarClick('propertyCollapsed'); }}>
              <span className={'icon_info'}></span>
              {this.getPropertyName(curNode) + this.formatIntl('mediaPublish.property')}
              <span className="icon icon_collapse pull-right"></span>
            </div>
            <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
              <RenderPropertyPanel curType={curNode && curNode.type} project={project} plan={plan} scene={scene} zone={zone} actions={actions} applyClick={this.applyClick}/>
            </div>
          </div>
        </SidebarInfo>
        <NotifyPopup/>
      </Content>
      <Overlayer />
      <PreviewFile showModal={this.state.showModal} hideModal={this.hideModal} addUploadFile={this.addUploadFile} />
    </div>;
  }
}

const mapStateToProps = state => {
  return {
    data: state.mediaPublishProject.data,
    project: state.mediaPublishProject.project,
    plan: state.mediaPublishProject.plan,
    scene: state.mediaPublishProject.scene,
    zone: state.mediaPublishProject.zone,
    item: state.mediaPublishProject.item,
    curNode: state.mediaPublishProject.curNode,
    IsUpdateTree: state.mediaPublishProject.IsUpdateTree,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
      treeViewInit: treeViewInit, initProject: initProject, initPlan: initPlan, initScene: initScene, initZone: initZone,
      initItem: initItem, initCurnode: initCurnode, requestSceneList: requestSceneList, requestZoneList: requestZoneList,
      requestItemList: requestItemList, updateTreeJudge: updateTreeJudge, addPlayerSceneArea: addPlayerSceneArea,
      treeOnMove: treeOnMove, treeOnRemove: treeOnRemove, playerAssetRemove, playerAssetMove: playerAssetMove, applyClick: applyClick,
      clearTreeState: clearTreeState, addItemToArea: addItemToArea
    }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayPlan));