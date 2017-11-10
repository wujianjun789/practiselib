/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {onToggle,onMove, onRemove} from '../common/actions/treeView'

import {getLanguage} from '../util/index'
export class TreeView extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: getLanguage()
        },
        this.renderTree = this.renderTree.bind(this);
        this.renderRemove = this.renderRemove.bind(this);
        this.renderMove = this.renderMove.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onMove = this.onMove.bind(this);
    }

    onMove(key, node){
        const {actions} = this.props;
        actions && actions.onMove(key, node);
        this.setState({update: true});
        this.props.onMove && this.props.onMove(key, node);
    }

    onRemove(node){
        console.log("remove:", node);
        const {actions} = this.props;
        actions && actions.onRemove(node);
        this.setState({update: true});
        this.props.onRemove && this.props.onRemove(node);
    }

    onToggle(node){
        const {actions,className} = this.props
        if(className == "mediaPublish"){node.defaultSelect = true;}
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

    renderMove(node, key){
        return this.props.IsMove && !this.props.IsCancelSelect && node.active && <span className={"glyphicon "+key+ " up-down"} title={key=="glyphicon-triangle-bottom"?"下移":"上移"}
                                                         onClick={(event)=>{event.stopPropagation();this.onMove(key=="glyphicon-triangle-bottom"?"down":"up", node)}}></span>
    }

    renderRemove(node){
        return this.props.IsRemove && <span className="icon_delete_c remove" title="删除" onClick={(event)=>{event.stopPropagation();this.onRemove(node)}}></span>
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
                        return <li key={index} className={'node '+(!this.props.IsCancelSelect && node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                        <div onClick={()=>this.onToggle(node)} title={node.name}>
                                            <span className={"icon "+node.class}></span>
                                            <span>{value}</span>
                                            {this.renderRemove(node)}
                                            {index<datalist.length-1 && this.renderMove(node, "glyphicon-triangle-bottom")}
                                            {index>0 && this.renderMove(node, "glyphicon-triangle-top")}
                                        </div>
                                    </Link>
                                    {node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }else{
                        return <li key={index} className={'node '+(!this.props.IsCancelSelect && node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={node.name}>
                                        <span className={'glyphicon '+(node.toggled ? 'glyphicon-triangle-bottom':'glyphicon-triangle-right')+' toggled'}></span>
                                        {value}
                                        {this.renderRemove(node)}
                                        {index<datalist.length-1 && this.renderMove(node, "glyphicon-triangle-bottom")}
                                        {index>0 && this.renderMove(node, "glyphicon-triangle-top")}
                                    </div>
                                    </Link>
                                    {this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }
                })
            }
        </ul>
    }

    render(){
        const { className, datalist } = this.props;
        console.log("datalist:", datalist);
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
            onToggle: onToggle,
            onMove: onMove,
            onRemove: onRemove
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TreeView);