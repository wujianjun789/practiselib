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
import {getProjectById} from '../../api/mediaPublish';

import PlayerProgram from '../component/PlayerProgram/index';

import {projectFilterDate} from '../util/index';

import moment from 'moment';
export class PlayProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curDate: moment(),
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
    this.selectDate = this.selectDate.bind(this);
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
    const projectId = router.params.project;
    getProjectById({id: projectId}, response=>{
      if(response && response.id === projectId){
        actions.initProject(response);
      }
    }, error=>{

    })
  }

  applyClick(id, data) {
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
      this.addAlert() && this.props.actions.addPlayerPlan(key, this.formatIntl);
      break;
    }
  }

  navigatorScene() {
    const {project, plan, actions} = this.props;
    this.props.router.push({
      pathname: '/mediaPublish/playProject/' + project.id + '/' + plan.id,
    });

  }

  editAlert() {
    const {plan, actions} = this.props;
    if (!plan) {
      actions.addNotify(0, this.formatIntl('mediaPublish.plan.select.alert'));
      return false;
    }
    return true;
  }

  addAlert() {
    const {plan, actions} = this.props;
    if (plan && typeof plan.id === 'string' && plan.id.indexOf('plan') > -1) {
      actions.addNotify(0, this.formatIntl('mediaPublish.plan.submit.alert'));
      return false;
    }

    return true;
  }

  sidebarClick(key) {
    const {sidebarInfo} = this.state;
    this.setState({sidebarInfo:Object.assign({}, sidebarInfo, {[key]: !sidebarInfo[key]})});
  }

  selectDate(date) {
    this.setState({curDate: date});
  }

  render() {
    const {sidebarInfo, curDate} = this.state;
    const {router, data, project, plan, actions} = this.props;

    const programList = projectFilterDate(data, curDate, this.props.plan);
    return <div className={'container ' + 'mediaPublish-playProject ' + (sidebarInfo.collapsed ? 'sidebar-collapse' : '')}>
      <HeadBar moduleName="app.mediaPublish" router={router} url={'/mediaPublish/playerProject'}/>
      <SideBar isEdit={true} isPopup={true} formatIntl={this.formatIntl} onClick={this.headbarClick}>
        <ul className="plan-list">
          {
            data.map(plan => {
              return <li key={plan.id} className={this.props.plan && this.props.plan.id === plan.id ? 'active' : ''} role="listitem"
                onClick={() => this.activePlan(plan)}>{plan.name}</li>;
            })
          }
        </ul>
      </SideBar>

      <Content className="play-project">
        <div className="left" ref={(left) => this._left = left}>
          <PlayerProgram programList={programList} defaultValue={curDate} selectDate={this.selectDate} />
        </div>
        <SidebarInfo collapsed={sidebarInfo.collapsed} sidebarClick={() => {this.sidebarClick('collapsed');}} >
          <div ref="assetProperty" className="panel panel-default asset-property">
            <div className={'panel-heading pro-title ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')} onClick={() => { this.sidebarClick('propertyCollapsed'); }}>
              <span className={'icon_info'}></span>
              {`${this.formatIntl('mediaPublish.property')}`}
              <span className="icon icon_collapse pull-right"></span>
            </div>
            <div className={'panel-body ' + (sidebarInfo.propertyCollapsed ? 'property-collapsed' : '')}>
              {plan && <PlanerPlanPro projectId={project.id} data={plan} actions={actions} applyClick={data => {this.applyClick('playerPlan', data);}}/>}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      overlayerShow: overlayerShow, overlayerHide: overlayerHide, addNotify: addNotify, removeAllNotify: removeAllNotify,
      initProject: initProject, initPlan: initPlan, addPlayerPlan: addPlayerPlan, treeOnMove: treeOnMove, treeOnRemove: treeOnRemove,
      applyClick: applyClick,
    }, dispatch),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(PlayProject));