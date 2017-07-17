/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react'
import TreeView from './TreeView'

import {getModelData, TreeData} from '../data/models'
export default class SideBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            treeData:[]
        }

        this.onToggle = this.onToggle.bind(this);
        this.initTreeData = this.initTreeData.bind(this);
    }

    componentWillMount(){
        getModelData(this.initTreeData);
    }

    initTreeData(){
        this.setState({
            treeData:TreeData
        })
    }

    onToggle(node){
        this.props.onToggle && this.props.onToggle(node);
    }

    render(){
        const {treeData} = this.state;
        return <div className="sidebar">
            <TreeView datalist={treeData} onToggle={(node)=>this.onToggle(node)}/>
        </div>
    }
}