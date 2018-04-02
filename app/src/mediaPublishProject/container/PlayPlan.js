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
import ImgPreview from '../component/ImgPreview/index';
import ProjectPreview from '../component/ProjectPreview/index';

import UploadFile from '../component/uploadFile';
import UploadNotify from '../component/uploadNotify';
import PreviewFile from '../component/previewFile';

import NotifyPopup from '../../common/containers/NotifyPopup';
import Overlayer from '../../common/containers/Overlayer';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import {treeViewInit} from '../../common/actions/treeView';

import {initProject, initPlan, initScene, initZone, initItem, initCurnode, requestSceneList, requestZoneList, requestItemList,
  updateTreeJudge, addPlayerSceneArea, treeOnMove, treeOnRemove, playerAssetRemove, playerAssetMove, applyClick, clearTreeState, addItemToArea} from '../action/index';

import {HOST_IP, getMediaPublishPreview, getMediaPublishPreviewJson} from '../../util/network';
import {uploadMaterialFile, getScenePreview} from '../../api/mediaPublish';

import {tranformAssetType} from '../util/index';

import moment from 'moment';
import lodash from 'lodash';
import {HOST_IP_FILE} from '../../util/network';

export class PlayPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        assetLibCollapsed: false,
      },
      imgPreviewWrapperSize: {
        
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

      sideInfoHeight:{'height': 'auto'},
      IsCancelSelect: false,
    };
    this.previewUrl = '';
    this.formatIntl = this.formatIntl.bind(this);

    this.sidebarClick = this.sidebarClick.bind(this);
    this.headbarClick = this.headbarClick.bind(this);

    this.playerAssetSelect = this.playerAssetSelect.bind(this);
    this.playerAssetRemove = this.playerAssetRemove.bind(this);
    this.playerAssetMove = this.playerAssetMove.bind(this);
    this.playerAssetAdd = this.playerAssetAdd.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.getPropertyName = this.getPropertyName.bind(this);

    this.setSize = this.setSize.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    const {router, actions} = this.props;

    this.mounted && this.setSize();
    window.onresize = event => {
      this.mounted && this.setSize();
    };
    getMediaPublishPreview(response => {
      this.previewUrl = response;
    });

    this.updateSceneTree();
    if (this.props.plan) {
      actions.requestSceneList(this.props.plan.id);
    } else {
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
    const {IsUpdateTree, actions} = this.props;
    if (IsUpdateTree) {
      this.updateSceneTree();
    }
  }

  componentDidMount() {
    this.getImgPreviewWrapperSize();
  }

  componentWillUnmount() {
    this.mounted = false;
    const {actions} = this.props;
    actions.initScene(null);
    actions.initZone(null);
    actions.initItem(null);
    actions.initCurnode(null);

    window.onresize = event => {

    };
  }

  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : '';
    // return formatId;
  }

  setSize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({ sideInfoHeight: { height: (height - 133) + 'px' } }, () => {
      this.getImgPreviewWrapperSize();
    });
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
      // this.requestAssetList();
      // this.requestSearchAssetList();
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
    actions.treeViewInit(treeData, false);
  }

  playerAssetSelect(item) {
    this.props.actions.initCurnode(item);
    this.props.actions.initItem(item);

    this.setState({IsCancelSelect: true});
  }

  playerAssetRemove(item) {
    this.props.actions.playerAssetRemove(item);
  }

  playerAssetMove(index) {
    this.props.actions.playerAssetMove(index);
  }

  playerAssetAdd(type) {
    console.log('playerAssetAdd:');
    const {actions} = this.props;
    actions.overlayerShow(<PlayerAssetLibPopup title="素材库" assetType={type} actions={actions} onCancel={() => {
      actions.overlayerHide();
    }} onConfirm={(data) => {
      this.props.actions.addItemToArea(data, this.formatIntl);
      actions.overlayerHide();
    }} assetAdd={() => {
      // actions.overlayerHide();
      this.showModal();
    }}/>);
  }

  addZone() {
    this.addAlert() && this.props.actions.addPlayerSceneArea('area', this.formatIntl);

  }

  playHandler = () => {
    const { project, plan, scene, actions } = this.props;
    // chriswenflag
    /** ProjectPreview Props
     *  1. totalTime --- project total play time (second)
     *  2. imgArray:[{src:String,time:Number}] --- project preview imgArray
     *  3. example below
     */
    getScenePreview(project.id, plan.id, scene.id, response => {
      console.log('preview success');
    });

    let totalTime = 0;
    const imgArray = [];
    let imgArray2 = [];
    try {
      const url = '/' + project.id + '/' + plan.id + '/' + scene.id;
      getMediaPublishPreviewJson(url + '/pre.json', response => {
        response.pic.map(preview => {
          const mo = moment(preview.time, 'HH:mm:ss:SSS');
          imgArray.push({
            src: 'http://' + location.host + '/' + url + '/' + preview.name,
            time: mo.hours() * 3600 + mo.minutes() * 60 + mo.seconds() + mo.milliseconds() / 1000,
          });
        });

        imgArray2 = lodash.sortBy(imgArray, arr => {return arr.time;});
        if (imgArray2.length) {
          totalTime = imgArray2[imgArray2.length - 1].time;
        }

        actions.overlayerShow(<ProjectPreview totalTime={totalTime} imgArray={imgArray2} closeClick={() => { actions.overlayerHide(); }}/>);

      });

    } catch (error) {
      // console.log(error);
    }
    //  actions.overlayerShow(<ProjectPreview totalTime={100} imgArray={[]} closeClick={() => { actions.overlayerHide(); }}/>);

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
    actions.initItem(null);
    this.setState({IsCancelSelect: false});
  }

  headbarClick(key) {
    console.log('headbarClick:', key);
    switch (key) {
    case 'edit':
      this.editAlert() && this.navigatorScene();
      break;
    case 'up':
    case 'down':
      this.editAlert() && this.props.actions.treeOnMove(key, this.props.curNode.type === 'scene' ? this.props.scene : this.props.zone);
      break;
    case 'remove':
      this.editAlert() && this.props.actions.treeOnRemove(this.props.curNode.type === 'scene' ? this.props.scene : this.props.zone);
      break;
    default:
      this.addAlert() && this.props.actions.addPlayerSceneArea('scene', this.formatIntl);
      break;
    }
  }

  editAlert() {
    const {scene, zone, curNode, actions} = this.props;
    if (!curNode || curNode && curNode.type !== 'scene'  && curNode.type !== 'area') {
      actions.addNotify(0, '请选择播放场景或播放区域。');
      return false;
    }
    return true;
  }

  addAlert() {
    const {zone, curNode, actions} = this.props;
    console.log('addAlert:', curNode);
    if (curNode && typeof curNode.id === 'string' && curNode.id.indexOf('scene') > -1) {
      actions.addNotify(0, this.formatIntl('mediaPublish.scene.submit.alert'));
      return false;
    }

    // if (curNode && zone && typeof zone.id === 'string' && zone.id.indexOf('area') > -1) {
    //   actions.addNotify(0, '请提交新建区域。');
    //   return false;
    // }

    return true;
  }

  sidebarClick(key) {
    const {sidebarInfo} = this.state;
    this.setState({
      sidebarInfo: Object.assign({}, sidebarInfo, { [key]: !sidebarInfo[key] }),
    }, () => {
      setTimeout(() => {
        this.getImgPreviewWrapperSize();
      }, 500);
    });
  }

  getImgPreviewWrapperSize() {
    const { _imgPreview } = this;
    this.setState({
      imgPreviewWrapperSize: {
        width: _imgPreview.clientWidth,
        height: _imgPreview.clientHeight,
      },
    });
    
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
    const {sidebarInfo, sideInfoHeight, IsCancelSelect} = this.state;
    const {data, project, plan, scene, zone, item, curNode, router, actions} = this.props;
    const playerListAsset = zone && zone.children ? zone.children : [];

    let curType = '';
    if (curNode) {
      if (curNode.type === 'scene' || curNode.type === 'area') {
        curType = curNode.type;
      } else {
        curType = tranformAssetType(curNode.type);
      }
    }

    let areaList = [];
    if (scene && scene.children) {
      areaList = scene.children.map(zon => {
        if (typeof zon.id === 'string' && zon.id.indexOf('area') > -1) {
          zon.position = {w: 0, h: 0, x: 0, y: 0};
        }

        const {position} = zon;
        let index = -1;
        if (item && curNode.type !== 'area'  && curNode.type !== 'scene') {
          index = lodash.findIndex(zon.children, it => {return it.id == item.id;});
        } else {
          index = -1;
        }

        return {id: zon.id, style:{width:position.w, height:position.h, left:position.x, top:position.y},
          src:index > -1 ? (item.assetType === 'system' ? item.thumbnail : HOST_IP_FILE + '/api/file/thumbnail/' + item.thumbnail) : ''};
      });
    }

    return <div className={'container ' + 'mediaPublish-playPlan ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
      <HeadBar moduleName="app.mediaPublish" router={router} url={{
        pathname: '/mediaPublish/playProject/' + (project ? project.id : ''),
        state: { item: project },
      }} />
      <SideBar isEdit={false} onClick={this.headbarClick}>
        <TreeView className="mediaPublish" IsCancelSelect={IsCancelSelect} onToggle={ (node) => this.onToggle(node) }/>
      </SideBar>

      <Content className="play-plan">
        <div className="left preview-container">
          <div className="form-group control-container-top">
            <div className={'form-group add-zone ' + (curNode && curNode.type === 'scene' ? '' : 'hidden')} onClick={() => this.addZone()}>
              <span className="icon glyphicon glyphicon-plus"></span><span className="word">添加区域</span></div>
            <div className={'form-group play-container ' + (curNode && curNode.type === 'scene' ? '' : 'hidden')} onClick={() => this.playHandler()}>
              <span className="icon icon_play"></span><span className="word"><FormattedMessage id="mediaPublish.play" /></span></div>
            <div className="form-group zoom-out-container" onClick={() => this.zoomOutHandler()}>
              <span className="icon icon_enlarge"></span><span className="word"><FormattedMessage id="mediaPublish.enlarge" /></span></div>
            <div className="form-group zoom-in-container" onClick={() => this.zoomInHandler()}>
              <span className="icon icon_reduce"></span><span className="word"><FormattedMessage id="mediaPublish.narrow" /></span></div>
          </div>
          <div className="img-container" ref={(preview) => this._imgPreview = preview}>
            {/* ImgPreview --- props
            * 1. areaList:[{
            * id:Number --- areaId,
            * style: {
            *         width,
            *         height,
            *         top(offsetY),
            *         left(offsetX)
            *       },
            * src:String --- actived playItem pic img 
            * }]
            * 2. selectedId:Number --- actived area's id
            * 3. projectSize:{width,height} --- project width && height
            */}  
            <ImgPreview wrapperSize={this.state.imgPreviewWrapperSize} previewProps={{areaList:areaList, selectedId:zone && zone.id, projectSize:{width:project && project.width, height:project && project.height}}}/>
          </div>
        </div>
        <div className="mediaPublish-footer">
          {/*<span className="asset-title"><FormattedMessage id='mediaPublish.playList'/></span>*/}
          <RenderPlayerAsset curNode={curNode} playerListAsset={playerListAsset} curItem={item} playerAssetSelect={this.playerAssetSelect}
            playerAssetMove={this.playerAssetMove} playerAssetRemove={this.playerAssetRemove} playerAssetAdd={this.playerAssetAdd}/>
        </div>
        <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={() => {this.sidebarClick('collapsed');}}>
          <div ref="assetProperty" className="panel panel-default asset-property">
            <div className={'panel-heading pro-title ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')} onClick={() => { this.sidebarClick('propertyCollapsed'); }}>
              <span className={'icon_info'}></span>
              {this.getPropertyName(curNode) + this.formatIntl('mediaPublish.property')}
              <span className="icon icon_collapse pull-right"></span>
            </div>
            <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')} style={sideInfoHeight}>
              <RenderPropertyPanel curType={curType} project={project} plan={plan} scene={scene} zone={zone} item={item} actions={actions} applyClick={this.applyClick}/>
            </div>
          </div>
        </SidebarInfo>
        <NotifyPopup/>
      </Content>
      <Overlayer />
      <UploadNotify showUploadNotify={this.state.showUploadNotify} hideUploadNotify={this.hideUploadNotify} showUploadFile={this.showUploadFile} />
      {this.state.showUploadFile ? <UploadFile showUploadFile={this.state.showUploadFile} hideUploadFile={this.hideUploadFile} uploadFileList={this.state.uploadFileList} cancelUploadFile={this.cancelUploadFile} /> : null}
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
      clearTreeState: clearTreeState, addItemToArea: addItemToArea,
    }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayPlan));