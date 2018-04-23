/**
 * Created by a on 2017/8/24.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import '../../../public/styles/smartLightManage-map.less';
import '../../../public/styles/smartLightManage-control.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import {TreeData} from '.././../data/smartLightModel'
import {treeViewInit, onToggleById} from '../../common/actions/treeView'
// import {sideBarToggled} from '../action/index'
class SystemOperationIndex extends Component{
    constructor(props){
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){

        this.mounted = true;
        this.mounted && this.initTreeData();
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.location.pathname !== this.props.location.pathname){
            this.props.actions.onToggleById(nextProps.location.pathname);
        }
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
        // console.log(node);
        // this.props.actions.sideBarToggled(node);
    }

    render(){
        let parentPath = "";
        let childPath = "";
        const {routes} = this.props;
        if(routes.length>4){
            parentPath = routes[4].path;
        }

        if(routes.length>5){
            childPath = routes[5].path;
        }

        return <div className={"container smartLight-"+parentPath+" "+parentPath+"-"+childPath}>
            <HeadBar moduleName={"app.smart.light"} router={this.props.router}/>
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
            onToggleById: onToggleById,
            // sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SystemOperationIndex);