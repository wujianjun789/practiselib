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

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';

import { FormattedMessage, injectIntl } from 'react-intl';
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
        const {router} = this.props;
        return <div className={'container ' + 'mediaPublish-playPlan ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName="app.mediaPublish" router={router} />
            <SideBar isEdit={false} onClick={this.areaClick} onMove={this.onMove} onRemove={this.onRemove}>
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
        item: state.mediaPublishProject.item
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(PlayPlan));