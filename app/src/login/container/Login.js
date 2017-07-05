/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../../components/Page';
import {loginHandler} from '../action/index'
class Login extends Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    login(){
        this.props.actions.loginHandler(true);
    }

    render() {
        return (
            <div className="container-login">
                <header>
                    <div className="main-title">
                        <span className="login_logo" />
                        <h3 >StarRiver</h3>
                    </div>
                    <div className="sub-title">
                        <p>智慧路灯管理系统</p>
                        <p>Smart Pole Control System</p>
                    </div>       
                </header>
                <div className="container-mid">
                    <div className="login-right pull-right">
                        <p>用户登录</p>
                        <div className="form-group has-feedback">
                            <input type="text" className="form-control"/>
                            <span className = "login_user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="text" className="form-control"/>
                            <span className = "login_password form-control-feedback"></span>
                        </div>
                        <button type="button" className="btn btn-block btn-login">登录</button>
                    </div>
                </div>
                <footer>Copyright © 2017 SANSITECH.All rights reserverd.</footer>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isLogin: state.login.get('isLogin')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            loginHandler: loginHandler
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);