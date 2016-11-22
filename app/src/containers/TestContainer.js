import React, { Component } from 'react';
import TestComponent from '../components/TestComponent';
export default class TestContainer extends Component {

    render() {
        
        return (
            <div>
               <TestComponent value="Hello World" />
            </div>
        )
    }
}