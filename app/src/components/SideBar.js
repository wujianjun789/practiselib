/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import TreeView from './TreeView'

import {getModelData, TreeData} from '../data/models'
import {treeViewInit} from '../common/actions/treeView'
class SideBar extends Component{
    constructor(props){
        super(props);

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
    }

    componentWillMount(){
        // getModelData(this.initTreeData);
    }

    componentDidMount(){
        getModelData(this.initTreeData);
    }

    componentDidUpdate(){
        getModelData(this.initTreeData);
    }

    initTreeData(){
        this.props.actions.treeViewInit(TreeData)
    }

    onToggle(node){
        this.props.onToggle && this.props.onToggle(node);
    }

    render(){
        return <div className="sidebar">
            <TreeView onToggle={(node)=>this.onToggle(node)}/>
        </div>
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            treeViewInit: treeViewInit
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SideBar);