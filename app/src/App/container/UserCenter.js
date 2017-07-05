/**
 * create by Azrael on 2017/7/4
 */
import React, { Component } from 'react';
export default class UserCenter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            list: [
                {name: '修改密码', key: 'alter'},
                {name: '退出管理系统', key: 'exit'}
            ]
        }
        this.userListToggle = this.userListToggle.bind(this);
    }

    userListToggle() {
        this.setState((prevState)=> {
            return {active: !prevState.active};
        });
    }

    render() {
        const {active, list} = this.state;
        const {className=""} = this.props;
        return (
            <div className={`header-right ${className}`} onClick={this.userListToggle}>
                <div className="user-icon clearfix"><span className="icon icon-user"></span></div>
                <ul className={`user-list ${active ? '' : 'hidden'}`}>
                {
                    list.map(item => <li key={item.key}><span className={`icon icon-${item.key}`}></span>{item.name}</li>)
                }
                </ul>
            </div>
        )
    }
}