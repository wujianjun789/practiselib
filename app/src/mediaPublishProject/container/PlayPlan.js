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

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import {treeViewInit} from '../../common/actions/treeView';

import {initProject, initPlan, initScene, initZone, initItem, requestSceneList, requestZoneList, requestItemList,
  updateTreeJudge, addPlayerSceneArea, treeOnMove, treeOnRemove} from '../action/index';

import { FormattedMessage, injectIntl } from 'react-intl';
import lodash from 'lodash';
export class PlayPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curNode: null,
            sidebarInfo: {
                collapsed: false,
                propertyCollapsed: false,
                assetLibCollapsed: false,
            }
        }

        this.sidebarClick = this.sidebarClick.bind(this);
        this.headbarClick = this.headbarClick.bind(this);

        this.playerAssetSelect = this.playerAssetSelect.bind(this);
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

    updateSceneTree(){
        const {data, plan, actions} = this.props;

        actions.updateTreeJudge(false);
        if(!data || data.length===0){
            return actions.treeViewInit([]);
        }
        const treeData = lodash.find(data, planItem=>{ return planItem.id == plan.id}).children;
        actions.treeViewInit(treeData);
    }

    playerAssetSelect(item){
        this.props.actions.initItem(item);
    }

    onToggle(node){
        const {plan, scene, actions} = this.props;
        if(node.type === "scene"){
            actions.initScene(node);
            !node.toggled && actions.requestZoneList(plan.id, node.id);
        }else if(node.type === 'area'){
            actions.initZone(node);
            actions.requestItemList(plan.id, scene.id, node.id);
        }

        this.setState({curNode: node});
    }

    headbarClick(key) {
        switch (key) {
            case 'edit':
                this.editAlert() && this.navigatorScene();
                break;
            case 'up':
            case 'down':
                this.editAlert() && this.props.actions.treeOnMove(key, this.state.curNode.type==="scene"?this.props.scene:this.props.zone);
                break;
            case 'remove':
                this.editAlert() && this.props.actions.treeOnRemove(this.state.curNode.type==="scene"?this.props.scene:this.props.zone);
                break;
            default:
                this.props.actions.addPlayerSceneArea(this.state.curNode);
                break;
        }
    }

    editAlert() {
        const {scene, zone, actions} = this.props;
        const {curNode} = this.state;
        if (!curNode || curNode.type==="scene" && !scene || curNode.type==="area" && !zone) {
            actions.addNotify(0, '请选择播放场景或播放区域。');
            return false;
        }
        return true;
    }

  sidebarClick() {
    const {sidebarInfo} = this.state;
    this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {collapsed: !sidebarInfo.collapsed})});
  }

  render() {
    const {curNode, sidebarInfo} = this.state;
    const {data, project, plan, scene, zone, item, router} = this.props;

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
        <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={this.sidebarClick}>
        </SidebarInfo>
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
    IsUpdateTree: state.mediaPublishProject.IsUpdateTree,
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
            treeViewInit: treeViewInit, initProject: initProject, initPlan: initPlan, initScene: initScene, initZone: initZone,
            initItem: initItem, requestSceneList: requestSceneList, requestZoneList: requestZoneList, requestItemList: requestItemList,
            updateTreeJudge: updateTreeJudge, addPlayerSceneArea: addPlayerSceneArea,
            treeOnMove: treeOnMove, treeOnRemove: treeOnRemove
        }, dispatch),
    };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayPlan));