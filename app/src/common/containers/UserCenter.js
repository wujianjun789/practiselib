/**
 * create by Azrael on 2017/7/4
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {overlayerShow, overlayerHide} from '../actions/overlayer';
import ConfirmPopup from '../../components/ConfirmPopup';
import AlterPwPopup from '../../components/AlterPwPopup';
import {modifyPassword, confirmExit} from '../actions/userCenter';
/**
 * @param {String} className  optional
 */
export class UserCenter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            list: [
                {name: '修改密码', key: 'alter', path:'icon_password'},
                {name: '退出管理系统', key: 'exit', path:'icon_exit'}
            ]
        }
        this.itemClick = this.itemClick.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    cancel() {
        this.props.actions.overlayerHide();
    }

    confirm() {
        this.props.actions.confirmExit(() => {
            this.props.actions.overlayerHide();
        }, () => {
            this.props.actions.overlayerHide();
        });
    }

    itemClick(key) {
        let {overlayerHide, overlayerShow} = this.props.actions;
        if(key == 'alter') {
            overlayerShow(<AlterPwPopup className='alter-pw-popup' overlayerShow={overlayerShow} overlayerHide={overlayerHide} modifyPassword={ this.props.actions.modifyPassword}/>);
        } else {
            overlayerShow(<ConfirmPopup tips="是否退出？" iconClass="icon-popup-exit" cancel={this.cancel} confirm={this.confirm}/>);
        }
    }

    render() {
        const {list} = this.state;
        const {className=""} = this.props;
        return (
            <div className={`user-center ${className}`}>
                <div className="user-icon clearfix"><span className="glyphicon glyphicon-user" aria-hidden="true"></span></div>
                <ul className='user-list'>
                {
                    list.map(item => <li key={item.key} onClick={()=>this.itemClick(item.key)}><span className={item.path}></span><span>{item.name}</span></li>)
                }
                </ul>
            </div>
        )
    }
}

UserCenter.propTypes = {
    className: PropTypes.string,
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            overlayerShow,
            overlayerHide,
            confirmExit,
            modifyPassword
        }, dispatch)
    }
}

export default connect(null, mapDispatchToProps)(UserCenter);