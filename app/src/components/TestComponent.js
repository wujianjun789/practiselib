
import React, { Component } from 'react';


export default class TestComponent extends Component {

    render() {
        const {value} = this.props;
        return (
            <div>
                {value}
            </div>
        )
    }
}