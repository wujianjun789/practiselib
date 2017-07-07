/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Page from '../../components/Page';
import {loginHandler,onChange,onFocus} from '../action/index'
import '../../../public/styles/login.less';
class Login extends Component {
    constructor(props) {
        super(props);
        this.submitHandler = this.submitHandler.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentWillMount(){
        const query = this.props.location.query;
    }

    onChange(id,value){
        this.props.actions.onChange({id: id,data: value});
    }

    onFocus() {
        this.props.actions.onFocus();
    }

    handleClick(event) {
        this.submitHandler();
        event.stopPropagation();
    }

    submitHandler() {
        this.props.actions.loginHandler(this.props.data.user.username, this.props.data.user.password);
    }

    onKeyDown(event) {
        if (event.key == 'Enter') {
            this.submitHandler();
        }
        event.stopPropagation();
    }

    render() {
        const {data} = this.props;

        return (
            <div className="container-login" onKeyDown={this.onKeyDown}>
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
                            <input type="text" className="form-control" onFocus={this.onFocus} onChange={(event) => this.onChange('username', event.target.value)}/>
                            <span className = "login_user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="password" className="form-control" onFocus={this.onFocus} onChange = {(event) => this.onChange('password',event.target.value)}/>
                            <span className = "login_password form-control-feedback"></span>
                        </div>
                        <p style={data.style}>用户名或密码错误</p>
                        <button type="button" className="btn btn-block btn-login" onClick={this.handleClick}>登录</button>
                    </div>
                </div>
                <footer>Copyright © 2017 SANSITECH.All rights reserverd.</footer>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            loginHandler: loginHandler,
            onFocus: onFocus,
            onChange: onChange
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);