/**
 * Created by a on 2017/7/17.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/assetManage-model.less';
import '../../../public/styles/assetManage-statistics.less'

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {getModelData, TreeData} from '../../data/assetModels'
import {treeViewInit} from '../../common/actions/treeView'

import {sideBarToggled} from '../action/index'
class AssetManageIndex extends Component{
    constructor(props){
        super(props);

        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){
        this.mounted = true;
        getModelData(()=>{this.mounted && this.initTreeData()});
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData)
    }

    onToggle(node){
        const {actions} = this.props;
        actions.sideBarToggled(node);
    }

    render(){
        let path = "";
        const {routes} = this.props;
        if(routes.length>3){
            path = routes[3].path;
        }

        return <div className={"container "+"asset-"+path}>
            <HeadBar moduleName={path=="manage"?"资产管理":"资产统计"} router={this.props.router}/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
            <Overlayer />
        </div>
    }
}

function mapStateToProps(state) {
    return {
        userCenter:state.userCenter
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
            sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetManageIndex);