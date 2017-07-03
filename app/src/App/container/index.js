/**
 * Created by a on 2017/6/29.
 */
import React, { Component } from 'react';
import TreeView from '../../components/TreeView';
import {TreeData} from '../../data/treeData'
export default class App extends Component{
    constructor(props){
        super(props);
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node){
    }

    render(){
        return (
            <div>
                welcome to starriver
                <button onClick={()=>location.href="/login"}>单击</button>
                <TreeView datalist={TreeData} onToggle={this.onToggle}/>
            </div>
        )
    }
}