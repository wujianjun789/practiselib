/**
 * Created by Azrael on 2017/10/17
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HeadBar from '../components/HeadBar';
import SideBar from '../components/SideBar';
import Overlayer from '../common/containers/Overlayer';
import {TreeData} from '../data/reporterModel';
import {treeViewInit} from '../common/actions/treeView';

class ReporterManage extends Component{
    constructor(props){
        super(props);

        this.moduleName = 'app.report.manage';

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

    initTreeData(){
        this.props.actions.treeViewInit(TreeData);
    }

    onToggle(node){
    }

    render(){
        const {routes} = this.props;

        return <div className="container reporter-manage">
            <HeadBar moduleName={this.moduleName} router={this.props.router}/>
            <SideBar onToggle={this.onToggle}/>
            {this.props.children}
            <Overlayer />
        </div>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit,
        }, dispatch)
    };
}
export default connect(
    null,
    mapDispatchToProps
)(ReporterManage);
