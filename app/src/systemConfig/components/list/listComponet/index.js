import React, { Component } from 'react';

export default class Item extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    render() {
        let {className='', item, showIcon=false, operations=['firstOperation', 'secondOperation']} = this.props;
        console.log('PROPS', this.props);
        const showDiv = showIcon === false ? operations[0] : <span className='delete'></span>;
        return (<li className='clearfix' onClick={ this.onClick } key={ this.props.key }>
                  <div>
                    { this.props.item.name }
                  </div>
                </li>)
    }
}