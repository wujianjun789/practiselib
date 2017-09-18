/**
 * Created by a on 2017/8/1.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../../../public/styles/systemOperation-config.less';
import '../../../public/styles/systemOperation-strategy.less';
import '../../../public/styles/systemOperation-sysConfig.less';
import '../../../public/styles/systemOperation-serviceMonitoring.less';
import '../../../public/styles/systemOperation-deviceMonitoring.less';

import HeadBar from '../../components/HeadBar'
import SideBar from '../../components/SideBar'
import Overlayer from '../../common/containers/Overlayer'

import { getModelData, TreeData } from '.././../data/systemModel'
import { treeViewInit } from '../../common/actions/treeView'
import { sideBarToggled } from '../action/index'
import { intlFormat, getClassByModel } from '../../util/index'

class SystemOperationIndex extends Component {
    constructor(props) {
        super(props);
        this.initTreeData = this.initTreeData.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount() {
        this.mounted = true;
        getModelData(null, () => {
            this.mounted && this.initTreeData()
        })
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {}

    initTreeData() {
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node) {
        // console.log(node); this.props.actions.sideBarToggled(node);
    }

    render() {
        let parentPath = "";
        let childPath = "";
        const {routes} = this.props;
        if(routes.length>3){
            parentPath = routes[3].path;
        }

        if(routes.length>4){
            childPath = routes[4].path;
        }

        return <div className={ "container " +"systemOperation-"+parentPath+" "+parentPath+"-"+childPath }>
                    <HeadBar moduleName={ "系统运维" } router={ this.props.router } />
                    <SideBar onToggle={ this.onToggle } />
                    { this.props.children }
                    <Overlayer/>
                </div>
    }
}

function mapStateToProps(state) {
    return {
        userCenter: state.userCenter
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
export default connect(mapStateToProps, mapDispatchToProps)(SystemOperationIndex);