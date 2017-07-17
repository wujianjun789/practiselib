/**
 * Created by a on 2017/7/3.
 */
import React, { Component } from 'react'
import {Link} from 'react-router';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import {history} from '../root/assetManage';
import {onToggle} from '../common/actions/treeView'
class TreeView extends Component{
    constructor(props){
        super(props)

        this.curNode = null
        this.renderTree = this.renderTree.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount(){

    }

    onToggle(node){
        // if(this.curNode && node.toggled == undefined){
        //     this.setState(Object.assign(this.curNode, {active:false}))
        // }
        //
        // this.setState({node:this.curNode});
        // this.setState(Object.assign(node, {toggled: node.children && !node.toggled, active:true}))
        // if(node.toggled && node.children){
        //
        // }
        this.props.actions.onToggle(node)
        this.props.onToggle && this.props.onToggle(node);

        // if(node.link){
        //     history.push(node.link);
        // }
    }

    renderTree(datalist, index, toggled){
        let curIndex = index;
        let nextIndex = index + 1;
        let style = {"height":index>1 ? (toggled ? datalist.length*40+'px':'0'):'auto'};
        return <ul className={"tree-"+curIndex} style={style}>
            {
                datalist.map((node, index)=> {
                    return <li key={index} className={'node '+(node.active ? 'active':'')}>
                        <Link to={node.link}>
                        <div onClick={()=>this.onToggle(node)}><span className={'glyphicon '+(curIndex > 1 ? (node.class+(node.active ? '_hover':'')) : (node.toggled ? 'glyphicon-triangle-bottom':'glyphicon-triangle-right'))}></span>
                            {node.name}</div></Link>
                        { node.children && this.renderTree(node.children, nextIndex, node.toggled)}
                    </li>
                })
            }
        </ul>
    }

    render(){
        const {datalist} = this.props;
        return <div className="tree-list">
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