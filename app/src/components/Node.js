import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NodeHeader from './NodeHeader'
import {getObjectByKey} from '../util/algorithm'
import '../../public/styles/tree.less'
export default class Node extends Component {
    constructor(props){
        super(props);
        this.renderChildren = this.renderChildren.bind(this);
    }

    renderChildren(children){
        const {nodes} = this.props;
        return (
            children.map((node, index) => {
                return <Node tree={node} nodes={nodes} key={node.id} onToggle={this.props.onToggle} onClick={this.props.onClick}/>
            })
        );
    }

    render() {
        const {tree,nodes} = this.props;
        const node = getObjectByKey(nodes,'id',tree.id);
        return (
            <ul className={`tree-ul ${node.get('hidden')?'hidden':''}`}>
                <li className='tree-li'>
                    <NodeHeader node = {node} hasChild={tree.children?true:false} onToggle={this.props.onToggle} onClick={this.props.onClick}/>
                    {tree.children && node.get('toggle') && this.renderChildren(tree.children)}
                </li>
            </ul>
        )
    }
}