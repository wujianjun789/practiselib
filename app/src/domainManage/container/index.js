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
import {treeViewInit, onToggleById} from '../../common/actions/treeView'
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

    componentWillReceiveProps(nextProps){
        if(nextProps.location.pathname !== this.props.location.pathname){
            this.props.actions.onToggleById(nextProps.location.pathname);
        }
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
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
        return <div className={"container "+"domain-"+parentPath+" "+parentPath+"-"+childPath}>
            <HeadBar moduleName={/*path=="domainEdit"?*/"app.domain.manage"/*:"地图预览"*/} router={this.props.router}/>
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
            sideBarToggled: sideBarToggled
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DomainManageIndex);