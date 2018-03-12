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
import NotifyPopup from '../../common/containers/NotifyPopup';

import PlanerPlanPro from '../component/PlayerPlanPro';

import { overlayerShow, overlayerHide } from '../../common/actions/overlayer';
import { addNotify, removeAllNotify } from '../../common/actions/notifyPopup';

import { FormattedMessage, injectIntl } from 'react-intl';

import { initProject, initPlan, addPlayerPlan, treeOnMove, treeOnRemove, applyClick } from '../action/index';

export class PlayProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarInfo: {
        collapsed: false,
        propertyCollapsed: false,
        assetLibCollapsed: false,
      },
    };

    this.sidebarClick = this.sidebarClick.bind(this);
    this.headbarClick = this.headbarClick.bind(this);
    this.editAlert = this.editAlert.bind(this);
    this.navigatorScene = this.navigatorScene.bind(this);

    this.formatIntl = this.formatIntl.bind(this);
  }

  componentWillMount() {
    this.initProject();
  }



  formatIntl(formatId) {
    const { intl } = this.props;
    return intl ? intl.formatMessage({ id: formatId }) : '';
    // return formatId;
  }

  initProject() {
    const { router, actions } = this.props;
    if (router && router.location) {
      const routerState = router.location.state;
      const project = routerState ? routerState.item : null;
      project && actions.initProject(project);
    }
  }

  applyClick(id, data){
    this.props.actions.applyClick(id, data);
  }

  activePlan(plan) {
    const {actions} = this.props;
    actions.initPlan(plan);
  }

  headbarClick(key) {
    switch (key) {
      case 'edit':
        this.editAlert() && this.navigatorScene();
        break;
      case 'up':
      case 'down':
        this.editAlert() && this.props.plan && this.props.actions.treeOnMove(key, this.props.plan);
        break;
      case 'remove':
        this.props.plan && this.props.actions.treeOnRemove(this.props.plan);
        break;
      default:
        this.props.actions.addPlayerPlan(key, this.formatIntl);
        break;
    }
  }

  navigatorScene(){
    const {project, plan, actions} = this.props;
    this.props.router.push({
      pathname: '/mediaPublish/playProject/' + project.id + '/' + plan.id,
        state: { project:project, item: plan }
    });

  }

  editAlert() {
    const {plan, actions} = this.props;
    if (!plan) {
        actions.addNotify(0, '请选择播放计划。');
        return false;
    }
    return true;
  }

    sidebarClick(key){
        const {sidebarInfo} = this.state;
        this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {[key]: !sidebarInfo[key]})});
    }

    render(){
        const {sidebarInfo} = this.state;
        const {router, data, project, plan} = this.props;
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
                <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={()=>{this.sidebarClick('collapsed')}} >
                    <div ref="assetProperty" className="panel panel-default asset-property">
                        <div className={"panel-heading pro-title "+(sidebarInfo.propertyCollapsed?'property-collapsed':'')} onClick={() => { this.sidebarClick('propertyCollapsed'); }}>
                            <span className={'icon_info'}></span>
                            {`${this.formatIntl('mediaPublish.property')}`}
                            <span className="icon icon_collapse pull-right"></span>
                        </div>
                        <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
                            {plan && <PlanerPlanPro projectId={project.id} data={plan} applyClick={data=>{this.applyClick("playerPlan", data)}}/>}
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
        item: state.mediaPublishProject.item
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
            initProject: initProject, initPlan: initPlan, addPlayerPlan: addPlayerPlan, treeOnMove: treeOnMove, treeOnRemove: treeOnRemove,
            applyClick: applyClick
        }, dispatch),
    };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayProject));