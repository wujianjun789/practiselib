/**
 * Created by a on 2017/10/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import 'antd/lib/date-picker/style';
import 'antd/lib/checkbox/style';
import '../../../public/styles/mediaPublish-playList.less';

import HeadBar from '../../components/HeadBar';
import SideBar from '../../components/SideBar';
import Overlayer from '../../common/containers/Overlayer';

import {TreeData} from '.././../data/mediaPublishModel';
import {treeViewInit} from '../../common/actions/treeView';
import {sideBarToggled} from '../action/index';

class MediaPublishIndex extends Component {
  constructor(props) {
    super(props);
    this.initTreeData = this.initTreeData.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  componentWillMount() {
    this.initTreeData();
  }

  componentWillUnmount() {

  }

  componentDidMount() {
  }

  initTreeData() {
    this.props.actions.treeViewInit(TreeData);
  }

  onToggle(node) {
    this.props.actions.sideBarToggled(node);
  }

  render() {
    let parentPath = '';
    let childPath = '';
    const {routes} = this.props;
    if (routes.length > 3) {
      parentPath = routes[3].path;
    }

    if (routes.length > 4) {
      childPath = routes[4].path;
    }
    return <div className={'container mediaPublish-' + parentPath + ' ' + parentPath + '-' + childPath}>
      <HeadBar moduleName="app.mediaPublish" router={this.props.router}/>
      <SideBar onToggle={this.onToggle}/>
      {this.props.children}
      <Overlayer />
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    userCenter:state.userCenter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      treeViewInit: treeViewInit,
      sideBarToggled: sideBarToggled,
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaPublishIndex);