/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {FormattedMessage} from 'react-intl';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {onToggle,onMove, onRemove} from '../common/actions/treeView'

import {getDefaultIntl} from '../intl/index'
export class TreeView extends Component{
    constructor(props){
        super(props)
        this.state = {
            language: 'zh'
        },
        this.renderTree = this.renderTree.bind(this);
        this.renderRemove = this.renderRemove.bind(this);
        this.renderMove = this.renderMove.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onMove = this.onMove.bind(this);
    }

    componentWillMount(){
        getDefaultIntl(intl=>{
            this.setState({language: intl.locale});
        })
    }

    onMove(key, node){
        const {actions} = this.props;
        // setTimeout(()=>{actions && actions.onMove(key, node)}, 33);
        this.setState({update: true});
        this.props.onMove && this.props.onMove(key, node);
    }

    onRemove(node){
        const {actions} = this.props;
        setTimeout(()=>{actions && actions.onRemove(node)}, 33);
        this.setState({update: true});
        this.props.onRemove && this.props.onRemove(node);
    }

    onToggle(node){
        const {actions,className} = this.props
        if(className === "mediaPublish"){node.defaultSelect = true;}
        setTimeout(()=>{ actions && actions.onToggle(node)}, 33);
        this.props.onToggle && this.props.onToggle(node);
    }

    getHeight(datalist){
        for (let i=0;i<datalist.length;i++){
            const node = datalist[i];
            if(node.toggled && !node.IsEndNode && node.children){
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
        const {intl} = this.props;
        if(!datalist){
            return null;
        }
        let curIndex = index;
        let nextIndex = index + 1;
        let style = {"height":index>1 ? (toggled ? (this.getHeight(datalist)*40)+'px':'0'):'auto'};
        return <ul className={"tree-"+curIndex} style={style}>
            {
                datalist.map((node, index)=> {
                    let count = this.state.language=='zh'?6:12;
                    let intlMessage = intl?intl.messages[node.name]:null;
                    let name = intlMessage?intlMessage:node.name;
                    let value = name?name.slice(0, count)+(name.length>count?'...':''):'';
                    if(node.IsEndNode || !(node.children)){
                        return <li key={index} className={'node '+(this.props.IsPrompt && node.active ? 'selected ':' ')+(!this.props.IsCancelSelect && node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                        <div onClick={()=>this.onToggle(node)} title={name}>
                                            <span className={"icon "+node.class}></span>
                                            <span>{value}</span>
                                            {this.renderRemove(node)}
                                            {index<datalist.length-1 && this.renderMove(node, "glyphicon-triangle-bottom")}
                                            {index>0 && this.renderMove(node, "glyphicon-triangle-top")}
                                        </div>
                                        {this.props.IsPrompt && node.active && <div className="selected-background"/>}
                                    </Link>
                                    {!node.IsEndNode && node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                                </li>
                    }else{
                        return <li key={index} className={'node '+(!this.props.IsCancelSelect && node.active ? 'active':'')}>
                                    <Link to={node.link}>
                                    <div onClick={()=>this.onToggle(node)} title={name}>
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
      /**
       *
       */
        const { className, datalist, intl, IsCancelSelect,  IsPrompt} = this.props;

        return <div className={"tree-list "+className}>
            {
                this.renderTree(datalist, 1)
            }
        </div>
    }
}

function mapStateToProps(state) {
    return {
        datalist: state.treeView.datalist,
        intl: state.intl
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