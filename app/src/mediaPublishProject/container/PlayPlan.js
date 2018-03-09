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

import SidebarInfo from '../component/SidebarInfo'
import TreeView from '../../components/TreeView';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';
import {treeViewInit} from '../../common/actions/treeView';

import {requestSceneList, updateTreeJudge} from '../action/index';

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

        this.sidebarClick = this.sidebarClick.bind(this);
    }

    componentWillMount(){
        const {plan, actions} = this.props;
        // this.updateSceneTree();
        actions.requestSceneList(plan.id);
    }

    componentDidUpdate(){
        const {IsUpdateTree, actions} = this.props;
        if(IsUpdateTree){
            this.updateSceneTree();
        }
    }

    updateSceneTree(){
        const {data, plan, actions} = this.props;
        console.log(data);
        actions.updateTreeJudge(false);
        if(!data || data.length===0){
            return actions.treeViewInit([]);
        }

        const treeData = lodash.find(data, planItem=>{ return planItem.id == plan.id}).children;
        actions.treeViewInit(treeData);
    }

    onToggle(node){
        console.log('treeNode:', node);
    }

    areaClick(){
    }

    onMove(){
    }

    onRemove(){

    }

    sidebarClick(){
        const {sidebarInfo} = this.state;
        this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {collapsed: !sidebarInfo.collapsed})});
    }

    render(){
        const {sidebarInfo} = this.state;
        const {router, project} = this.props;
        return <div className={'container ' + 'mediaPublish-playPlan ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName="app.mediaPublish" router={router} url={{
            pathname: "/mediaPublish/playProject/"+(project?project.id:""),
            state: { item: project }
        }}/>
            <SideBar isEdit={false} onClick={this.areaClick} onMove={this.onMove} onRemove={this.onRemove}>
                <TreeView className="mediaPublish-plan" onToggle={ (node) => this.onToggle(node) }/>
            </SideBar>

            <Content className="play-project">
                播放场景列表
                <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={this.sidebarClick}>

                </SidebarInfo>
            </Content>
        </div>
    }
}

const mapStateToProps = state => {
    return {
        data: state.mediaPublishProject.data,
        project: state.mediaPublishProject.project,
        plan: state.mediaPublishProject.plan,
        screen: state.mediaPublishProject.screen,
        zone: state.mediaPublishProject.zone,
        item: state.mediaPublishProject.item,
        IsUpdateTree: state.mediaPublishProject.IsUpdateTree
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
            treeViewInit: treeViewInit, requestSceneList: requestSceneList, updateTreeJudge: updateTreeJudge
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(PlayPlan));