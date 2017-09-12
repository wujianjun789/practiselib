/**
 * Created by a on 2017/7/17.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/domainmanage.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {TreeData} from '.././../data/domainModel'
import {treeViewInit} from '../../common/actions/treeView'
import {sideBarToggled} from '../action/index'
class DomainManageIndex extends Component{
    constructor(props){
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){
        this.initTreeData();
    }

    componentWillUnmount(){

    }

    componentDidMount(){
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
        this.props.actions.sideBarToggled(node);
    }

    render(){
        let parentPath = "";
        let childPath = "";
        const {routes} = this.props;
        if(routes.length>3){
            parentPath = routes[3].path;
        }

        if(routes.length>4){
            childPath = routes[4].path;
        }
        return <div className={"container "+"domain-"+parentPath+" "+parentPath+"-"+childPath}>
            <svg className="svgOnload" > 
                <symbol id="icon_domain_property"><path d="M100.229,183.061l0.068-18.842c4.926,0.075,9.989-0.468,14.821-1.635c9.539-1.781,5.087-6.359-3.943-9.666c-6.232-2.085-12.662-14.081-8.776-21.876l16.789-41.844c3.979-8.698,3.194-18.031-3.561-21.367c-16.293-7.33-38.283-2.671-38.283-2.671c-9.539,1.017-0.382,4.452,8.776,7.631c0,0,18.047,7.209,12.21,22.639l-18.442,44.77c-3.554,7.301-3.221,18.301,3.943,21.367c5.087,1.933,10.905,2.556,16.466,2.653L100.229,183.061c-45.658,0-82.79-37.013-82.79-82.671c0.07-45.629,37.042-82.601,82.671-82.671l4.834,0.139l0.009,16.267c-6.181,0-11.202,5.012-11.202,11.193s5.011,11.192,11.192,11.192c6.181,0,11.192-5.011,11.192-11.192s-5.001-11.193-11.182-11.193l-0.009-16.267c43.408,2.503,77.838,38.497,77.838,82.532c0,45.611-36.938,82.596-82.531,82.671 M100.11,5C47.428,5,4.72,47.708,4.72,100.39s42.708,95.39,95.39,95.39s95.39-42.708,95.39-95.39S152.792,5,100.11,5z"/></symbol>
            </svg>
            <HeadBar moduleName={/*path=="domainEdit"?*/"域管理"/*:"地图预览"*/} router={this.props.router}/>
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
)(DomainManageIndex);