/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import TreeView from './TreeView'

export default class SideBar extends Component{
    constructor(props){
        super(props);

        this.onToggle = this.onToggle.bind(this);
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
