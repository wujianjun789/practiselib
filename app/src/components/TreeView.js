/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {onToggle} from '../common/actions/treeView'

import {getLanguage} from '../util/index'
export class TreeView extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage()
        },
        this.renderTree = this.renderTree.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.getHeight = this.getHeight.bind(this);
    }

    onToggle(node){
        const {actions} = this.props
        actions && actions.onToggle(node)
        this.props.onToggle && this.props.onToggle(node);
    }

    getHeight(datalist){
        for (let i=0;i<datalist.length;i++){
            const node = datalist[i];
            if(node.toggled && node.children){
                return datalist.length+this.getHeight(node.children);
            }
        }

        return datalist.length;
    }

    renderTree(datalist, index, toggled){
        if(!datalist){
            return null;
        }
        let curIndex = index;
        let nextIndex = index + 1;
        let style = {"height":index>1 ? (toggled ? (this.getHeight(datalist)*40)+'px':'0'):'auto'};
        return <ul className={"tree-"+curIndex} style={style}>
            {
                datalist.map((node, index)=> {
                    let count = this.state.language=='zh'?6:10;
                    let value = node.name.slice(0, count)+(node.name.length>count?'...':'');
                    if(!(node.children)){
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><span className={node.class}></span>
                                        <span>{value}</span></div></Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }else{
                        return <li key={index} className={'node '+(node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}><span className={'glyphicon '+(node.toggled ? 'glyphicon-triangle-bottom':'glyphicon-triangle-right')}></span>
                                        {value}</div></Link>
                                    {this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }
                })
            }
        </ul>
    }

    render(){
        const {datalist, className} = this.props;
        return <div className={"tree-list "+className}>
            {
                this.renderTree(datalist, 1)
            }
        </div>
    }
}

function mapStateToProps(state) {
    return {
        datalist: state.treeView.datalist
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            onToggle: onToggle
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeView);