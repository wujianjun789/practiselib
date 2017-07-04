/**
 * Created by a on 2017/7/4.
 */
import React, { Component } from 'react'
export default class HeadBar extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const {moduleName} = this.props
        return <div className="head">
            <div className="home">
                <span className="icon"></span>
            </div>
            <span className="title">{moduleName}</span>
            <div className="people"></div>
        </div>
    }
}