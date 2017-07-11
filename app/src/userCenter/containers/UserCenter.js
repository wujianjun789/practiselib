/**
 * create by Azrael on 2017/7/4
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {overlayerShow, overlayerHide} from '../../overlayer/actions/overlayer';
import ExitPopup from '../components/ExitPopup';
import AlterPwPopup from './AlterPwPopup';
/**
 * @param {String} className  optional
 */
export class UserCenter extends Component{
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
        this.itemClick = this.itemClick.bind(this);
        this.cancel = this.cancel.bind(this);
        this.confirm = this.confirm.bind(this);
    }

    userListToggle() {
        this.setState((prevState)=> {
            return {active: !prevState.active};
        });
    }

    cancel() {
        this.props.actions.overlayerHide();
    }

    confirm() {
        this.props.actions.overlayerHide();
    }

    itemClick(key) {
        if(key == 'alter') {
            this.props.actions.overlayerShow(<AlterPwPopup className='alter-pw-popup'/>);
        } else {
            this.props.actions.overlayerShow(<ExitPopup cancel={this.cancel} confirm={this.confirm}/>);
        }
        
    }

    render() {
        const {active, list} = this.state;
        const {className=""} = this.props;
        return (
            <div className={`user-center ${className}`} onClick={this.userListToggle}>
                <div className="user-icon clearfix"><span className="icon icon-usr"></span></div>
                <ul className={`user-list ${active ? '' : 'hidden'}`}>
                {
                    list.map(item => <li key={item.key} onClick={()=>this.itemClick(item.key)}><span className={`icon icon-${item.key}`}></span>{item.name}</li>)
                }
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            overlayerShow,
            overlayerHide
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserCenter);

UserCenter.propTypes = {
    className: PropTypes.string
}