
import React, { Component } from 'react';
export default class List extends Component {

    render() {
        const {list} = this.props;
        return (
            <ul>
                {
                    list.map(v => <li key={v.get('id')}>{v.get('text')}</li>)
                }
            </ul>
        )
    }
}