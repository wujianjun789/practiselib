/**
 * Created by a on 2017/10/24.
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux';

import {Treebeard} from 'react-treebeard';

import treeStyle from './treeStyle';
// import TreeView from '../../components/TreeView'

export default class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.onClick = this.onClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillReceiveProps() {
        // console.log("receive receive");
    }

    onToggle(node, toggled) {
        if(this.state.cursor){
            this.state.cursor.active = false;
        }

        node.active = true;
        if(node.children){
            node.toggled = toggled;
        }

        this.setState({cursor:node});
        this.props.onToggle && this.props.onToggle(node);
    }

    onClick(id){
        this.props.onClick && this.props.onClick(id);
    }
    render() {
        const {data} = this.props;
        return <div className="sidebar">
            <div className="title">计划划分</div>
            <div className="edit-container">
                <button className="btn btn-primary" onClick={()=>this.onClick("add")}>添加</button>
                <button className="btn btn-primary" onClick={()=>this.onClick("edit")}>编辑</button>
            </div>
            {/*<TreeView onToggle={ (node) => this.onToggle(node) } />*/}
            <Treebeard data={data} style={treeStyle} onToggle={this.onToggle}/>
        </div>
    }
}