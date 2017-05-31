import React, { Component } from 'react';
import { Link } from 'react-router';
export default class Header extends Component {

    render() {

        return (
            <ul>
                <li>
                    <Link to="/" activeStyle={{ color: 'red' }}>Home</Link>
                </li>
                <li>
                    <Link to="/about" activeStyle={{ color: 'red' }}>About</Link>
                </li>
                <li>
                    <Link to="/course" activeStyle={{ color: 'red' }}>Course</Link>
                </li>
            </ul>
        )
    }
}