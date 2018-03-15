/**
 * Created by a on 2018/3/8.
 */
import React, { Component } from 'react';
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

import NotifyPopup from '../../common/containers/NotifyPopup';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import {treeViewInit} from '../../common/actions/treeView';

import {initProject, initPlan, initScene, initZone, initItem, initCurnode, requestSceneList, requestZoneList, requestItemList,
  updateTreeJudge, addPlayerSceneArea, treeOnMove, treeOnRemove, playerAssetRemove, playerAssetMove, applyClick, clearTreeState} from '../action/index';
import {tranformAssetType} from '../util/index'

import { FormattedMessage, injectIntl } from 'react-intl';
import lodash from 'lodash';
export class PlayPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarInfo: {
                collapsed: false,
                propertyCollapsed: false,
                assetLibCollapsed: false,
            }
        }

        this.formatIntl = this.formatIntl.bind(this);

        this.sidebarClick = this.sidebarClick.bind(this);
        this.headbarClick = this.headbarClick.bind(this);

        this.playerAssetSelect = this.playerAssetSelect.bind(this);
        this.playerAssetRemove = this.playerAssetRemove.bind(this);
        this.playerAssetMove = this.playerAssetMove.bind(this);
        this.applyClick = this.applyClick.bind(this);
        this.getPropertyName = this.getPropertyName.bind(this);
    }

    componentWillMount(){
        const {router, actions} = this.props;
        this.updateSceneTree();
        if(this.props.plan){
            actions.requestSceneList(this.props.plan.id);
        }else{
            if (router && router.location) {
                const routerState = router.location.state;
                const project = routerState ? routerState.project : null;
                const plan = routerState ? routerState.item : null;
                project && actions.initProject(project);
                plan && actions.initPlan(plan);
                setTimeout(()=>{plan && actions.requestSceneList(plan.id);}, 66);
            }
        }
    }

    componentDidUpdate(){
        const {IsUpdateTree, actions} = this.props;
        if(IsUpdateTree){
            this.updateSceneTree();
        }
    }

    componentWillUnmount(){

    }

    formatIntl(formatId) {
        const { intl } = this.props;
        return intl ? intl.formatMessage({ id: formatId }) : '';
        // return formatId;
    }

    updateSceneTree(){
        const {data, plan, actions} = this.props;

        actions.updateTreeJudge(false);
        if(!data || data.length===0){
            return actions.treeViewInit([]);
        }
        const treeData = lodash.find(data, planItem=>{ return planItem.id == plan.id}).children;
      console.log('updateSceneTree:',treeData);
        actions.treeViewInit(treeData, false);
    }

    playerAssetSelect(item){
        this.props.actions.initCurnode(item);
        this.props.actions.initItem(item);

    }

    playerAssetRemove(item){
      this.props.actions.playerAssetRemove(item);
    }

    playerAssetMove(index){
      this.props.actions.playerAssetMove(index);
    }

    onToggle(node){
        const {plan, scene, actions} = this.props;
        if(node.type === "scene"){
            actions.initScene(node);
            if(!node.toggled){
              actions.clearTreeState();
              actions.requestZoneList(plan.id, node.id);
            }
        }else if(node.type === 'area'){
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
                this.editAlert() && this.props.actions.treeOnMove(key, this.props.curNode.type==="scene"?this.props.scene:this.props.zone);
                break;
            case 'remove':
                this.editAlert() && this.props.actions.treeOnRemove(this.props.curNode.type==="scene"?this.props.scene:this.props.zone);
                break;
            default:
                this.addAlert() && this.props.actions.addPlayerSceneArea(this.props.curNode);
                break;
        }
    }

    editAlert() {
        const {scene, zone, curNode, actions} = this.props;
        if (!curNode || curNode.type==="scene" && !scene || curNode.type==="area" && !zone) {
            actions.addNotify(0, '请选择播放场景或播放区域。');
            return false;
        }
        return true;
    }

    addAlert(){
      const {curNode, actions} = this.props;
      console.log('addAlert:',curNode);
      if(curNode && typeof curNode.id === 'string' && curNode.id.indexOf('area') > -1){
        actions.addNotify(0, '请提交新建区域。');
        return false;
      }

      return true;
    }

  sidebarClick(key) {
    const {sidebarInfo} = this.state;
    this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {[key]: !sidebarInfo[key]})});
  }

  applyClick(id, data){
    this.props.actions.applyClick(id, data);
  }

  getPropertyName(curNode){
    if(!curNode){
      return "";
    }
    switch (curNode.type){
      case "scene":
        return "场景";
      case "area":
        return "区域";
      default:
        return "素材"
    }
  }

  render() {
    const {sidebarInfo} = this.state;
    const {data, project, plan, scene, zone, item, curNode, router, actions} = this.props;
    const playerListAsset = zone && zone.children ? zone.children:[];

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
          <RenderPlayerAsset curNode={curNode} playerListAsset={playerListAsset} curItem={item} playerAssetSelect={this.playerAssetSelect} playerAssetMove={this.playerAssetMove} playerAssetRemove={this.playerAssetRemove} />
        </div>
        <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={()=>{this.sidebarClick('collapsed')}}>
          <div ref="assetProperty" className="panel panel-default asset-property">
            <div className={"panel-heading pro-title "+(sidebarInfo.propertyCollapsed?'property-collapsed':'')} onClick={() => { this.sidebarClick('propertyCollapsed'); }}>
                <span className={'icon_info'}></span>
                {this.getPropertyName(curNode)+this.formatIntl('mediaPublish.property')}
                <span className="icon icon_collapse pull-right"></span>
            </div>
            <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
                <RenderPropertyPanel curType={curNode && curNode.type} project={project} plan={plan} scene={scene} zone={zone} actions={actions} applyClick={this.applyClick}/>
            </div>
          </div>
        </SidebarInfo>
        <NotifyPopup/>
      </Content>
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
            clearTreeState: clearTreeState
        }, dispatch),
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayPlan));