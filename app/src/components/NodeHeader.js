import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

export default class NodeHeader extends PureComponent {
    render() {
        const {node,hasChild} = this.props;
        return (
            <div className="row tree-node">
                <div className='tree-node-info' onClick={()=>hasChild && this.props.onToggle(node.get('id'))}>
                    <span className={hasChild?`glyphicon glyphicon-triangle-${node.get('toggle')?'bottom':'right'}`:''}></span>
                    <span>{node.get('name')}</span>
                </div>
                {node.get('isAdd')?<span className='tree-node-add'><FormattedMessage id='permission.added'/></span>:<span className='glyphicon glyphicon-plus tree-node-add' onClick={()=>this.props.onClick(node.get('id'))}></span>}
            </div>
        )
    }
}