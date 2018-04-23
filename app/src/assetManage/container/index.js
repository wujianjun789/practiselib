/**
 * Created by a on 2017/7/17.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {injectIntl} from 'react-intl';

import '../../../public/styles/assetManage-model.less';
import '../../../public/styles/assetManage-statistics.less';

import HeadBar from '../../components/HeadBar';
import SideBar from '../../components/SideBar';
import Overlayer from '../../common/containers/Overlayer';

import {getModelData, TreeData} from '../../data/assetModels';
import {treeViewInit, onToggleById} from '../../common/actions/treeView';

import {sideBarToggled} from '../action/index';
import {treeViewNavigator} from '../../common/util/index';
class AssetManageIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathname: ""
    }

    this.initModel = this.initModel.bind(this);
    this.initTreeData = this.initTreeData.bind(this);
    this.onToggle = this.onToggle.bind(this);

    this.getMathNode = this.getMathNode.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.initModel();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.location.pathname !==  this.props.location.pathname){
      this.props.actions.onToggleById(nextProps.location.pathname);
    }
  }
  componentDidUpdate(){
    // console.log(this.props);
    // const {location} = this.props;
    // if(location.pathname !== this.state.pathname){
    //   this.setState({pathname: location.pathname}, ()=>{
    //     this.initModel();
    //   });
    // }
  }
  initModel(){
    getModelData(() => {this.mounted && this.initTreeData();});
  }

  initTreeData() {
    TreeData.map(tree=>{
      return Object.assign({}, tree, {name:this.props.intl.formatMessage({id:tree.name})});
    })
    this.props.actions.treeViewInit(TreeData);
    treeViewNavigator(TreeData, this.props.router);

    const node = this.getMathNode(TreeData, this.props.location.pathname);
    if(node){
      this.onToggle(node);
    }
  }

  getMathNode(data, pathname){
    for(let i=0;i<data.length;i++){
      if(!data[i].children && data[i].link.indexOf(pathname) > -1){
        return data[i];
      }else{
        if(data[i].children){
          const node = this.getMathNode(data[i].children, pathname);
          if(node){
            return node;
          }
        }

      }
    }

    return null;
  }

  onToggle(node) {
    const {actions} = this.props;
    actions.sideBarToggled(node);
  }

  render() {
    let parentPath = '';
    let childPath = '';
    const {routes} = this.props;
    if (routes.length > 4) {
      parentPath = routes[4].path;
    }

    if (routes.length > 5) {
      childPath = routes[5].path;
    }

    return <div className={'container ' + 'asset-' + parentPath + ' ' + parentPath + '-' + childPath}>
      <HeadBar moduleName="app.asset.manage" router={this.props.router}/>
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
      onToggleById: onToggleById,
      sideBarToggled: sideBarToggled,
    }, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AssetManageIndex));