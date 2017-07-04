/**
 * Created by a on 2017/6/29.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../../../public/styles/app.less';
import {Card} from './Card';
import UserCenter from './UserCenter';

class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {title="StarRiver", name="智慧路灯管理系统", items} = this.props;
        return (
            <div className="app">
                <div className="header clearfix">
                    <div className="header-left clearfix">
                        <span className="icon icon-logo"></span>
                        <span className="tit">{title}</span>
                        <span className="name">{name}</span>
                    </div>
                    <UserCenter className="header-right" />
                </div>
                <div className="cont">
                    <ul className="clearfix">
                        {items.map((item, index)=><li key={index}><Card _key={item.key} title={item.title} link={item.link}/></li>)}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let app = state.app;
    return {
        title: app.title,
        name: app.name,
        items: app.items
    }
}

export default connect(mapStateToProps)(App);