import React, { Component } from 'react';
import Header from '../../components/Header';
import TestComponent from '../../components/TestComponent';
export default class Home extends Component {

    render() {

        return (
            <div>
                <Header />
                <TestComponent value="Home page!" />
            </div>
        )
    }
}