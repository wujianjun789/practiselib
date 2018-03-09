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

import { initProject, initPlan, addPlayerPlan, treeOnMove, treeOnRemove } from '../action/index'
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

        this.formatIntl = this.formatIntl.bind(this);
    }

    componentWillMount(){
        this.initProject();
    }

    componentDidUpdate(){
    }

    formatIntl(formatId){
        const { intl } = this.props;
        return intl ? intl.formatMessage({ id: formatId }) : "";
        // return formatId;
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

    headbarClick(key){
        switch (key){
            case "edit":
                this.editAlert() && this.navigatorScreen();
                break;
            case "up":
            case "down":
                this.editAlert() && this.props.plan && this.props.actions.treeOnMove(key, this.props.plan);
                break;
            case "remove":
                this.props.plan && this.props.actions.treeOnRemove(this.props.plan);
                break;
            default:
                this.props.actions.addPlayerPlan(key, this.formatIntl);
                break;
        }

    }

    editAlert(){
        const {plan, actions} = this.props;
        if(!plan){
            actions.addNotify(0, '请选择播放计划。');
            return false;
        }

        if(typeof plan.id === "string" && plan.id.indexOf("plan")>-1){
            actions.addNotify(0, '请提交播放计划。');
            return false;
        }

        return true;
    }
    navigatorScreen(){
        const {project, plan, actions} = this.props;


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
        console.log('planList:', data);
        return <div className={'container ' + 'mediaPublish-playProject ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
            <HeadBar moduleName="app.mediaPublish" router={router} url={"/mediaPublish/playerProject"}/>
            <SideBar isEdit={true} isPopup={true} onClick={this.headbarClick}>
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
            initProject: initProject, initPlan: initPlan, addPlayerPlan: addPlayerPlan, treeOnMove: treeOnMove, treeOnRemove: treeOnRemove
        }, dispatch),
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(PlayProject));