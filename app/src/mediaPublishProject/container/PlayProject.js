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
import NotifyPopup from '../../common/containers/NotifyPopup'

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';

import { FormattedMessage, injectIntl } from 'react-intl';

import { initProject, initPlan } from '../action/index'
export class PlayProject extends Component {
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
        this.headbarClick = this.headbarClick.bind(this);
    }

    componentWillMount(){
        this.initProject();
    }

    initProject(){
        const { router, actions } = this.props;
        if (router && router.location) {
            const routerState = router.location.state;
            const project = routerState ? routerState.item : null;
            project && actions.initProject(project);
        }
    }

    activePlan(plan){
        const {actions} = this.props;
        actions.initPlan(plan);
    }

    onMove(){
    }

    onRemove(){

    }

    headbarClick(key){
        const {project, plan, actions} = this.props;
        console.log(plan);
        if(!plan){
            return actions.addNotify(0, '请选择播放计划。');
        }

        this.props.router.push({
            pathname: "/mediaPublish/playProject/"+project.id+"/"+plan.id
        });
    }

    sidebarClick(){
        const {sidebarInfo} = this.state;
        this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {collapsed: !sidebarInfo.collapsed})});
    }

    render(){
        const {sidebarInfo} = this.state;
        const {router, data} = this.props;
        return <div className={'container ' + 'mediaPublish-playProject ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName="app.mediaPublish" router={router} url={"/mediaPublish/playerProject"}/>
            <SideBar isEdit={true} onClick={this.headbarClick} onMove={this.onMove} onRemove={this.onRemove}>
                <ul className="plan-list">
                    {
                      data.map(plan=>{
                          return <li key={plan.id} className={this.props.plan && this.props.plan.id === plan.id ?"active":""} role="listitem"
                          onClick={()=>this.activePlan(plan)}>{plan.name}</li>
                      })
                    }
                </ul>
            </SideBar>

            <Content className="play-project">
                播放计划列表
                <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={this.sidebarClick} >

                </SidebarInfo>
                <NotifyPopup/>
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
            initProject: initProject, initPlan: initPlan
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(PlayProject));