/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loginHandler} from '../action/index'

import '../../../public/styles/login.less';
import {getCookie} from '../../util/cache';
export class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
            style: { visibility: 'hidden' },
            user: { 
                username: '',
                password: ''
            }
        }
        this.submitHandler = this.submitHandler.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.loginFail = this.loginFail.bind(this);
    }

    //兼容ie下的清除事件
    // componentDidMount() {
    //     if (SYS.ie && window.addEventListener) {
    //         this.changeHack = () => { this.onChange('username', this.refs.username.value) };
    //     } 
    //     this.refs.username.addEventListener('change', this.changeHack);
    // }
    // componentWillUnmount() {
    //     if (this.changeHack) 
    //         this.refs.username.removeEventListener('change', this.changeHack);
    // }

    onChange(id,value){
        this.setState({user:Object.assign({},this.state.user,{[id]:value})});
    }

    onFocus() {
        this.setState({style:{visibility: 'hidden'}})
    }

    handleClick(event) {
        this.submitHandler();
        event.stopPropagation();
    }

    submitHandler() {
        this.props.actions.loginHandler(this.state.user.username, this.state.user.password, this.loginFail);
    }

    componentDidMount() {
        
    }

    onKeyDown(event) {
        if (event.key == 'Enter') {
            this.submitHandler();
        }
        event.stopPropagation();
    }

    loginFail(){
        this.setState({style:{visibility: 'visible'}})
    }
    
    render() {
        const style = this.state.style?this.state.style:{ visibility: 'hidden' };

        return (
            <div className="container-login" onKeyDown={this.onKeyDown}>
                <header>
                    <div className="main-title">
                        <svg className="svgOnload"> 
                            <defs>
                                <linearGradient id="orange_red" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor:'rgb(0,105,212)',
                                stopOpacity:1}}/>
                                <stop offset="100%" style={{stopColor:'rgb(4,83,166)',
                                stopOpacity:1}}/>
                                </linearGradient>
                            </defs>
                            <symbol id="login_logo"><path fill="url(#orange_red)" d="M100,3C46.428,3,3,46.428,3,100s43.428,97,97,97s97-43.428,97-97S153.572,3,100,3z M96.869,41.074
                c3.489-3.489,5.68-16.123,5.68-16.123s1.988,12.35,5.72,16.082c3.732,3.733,16.082,5.721,16.082,5.721s-12.471,2.029-16.123,5.68
                c-3.651,3.651-5.68,16.123-5.68,16.123s-2.191-12.634-5.68-16.123c-3.489-3.489-16.123-5.68-16.123-5.68S93.38,44.563,96.869,41.074
                z M14.829,86.988c0,0,24.676-4.279,31.491-11.094c6.815-6.815,11.094-31.491,11.094-31.491s3.883,24.122,11.173,31.412
                S100,86.988,100,86.988S75.641,90.95,68.509,98.082c-7.132,7.132-11.094,31.491-11.094,31.491s-4.279-24.676-11.094-31.491
                C39.506,91.267,14.829,86.988,14.829,86.988z M135.424,87.877c-2.401,26.318,6.978,80.141,6.978,80.141
                c-8.124,5.312-24.398,13.068-40.986,13.012c17.286-23.264,16.624-55.598,16.624-55.598c-8.675,27.996-31.975,53.823-31.975,53.823
                c-28.65-5.718-46.331-27.602-46.331-27.602s44.789,2.169,71.208-52.246c23.264-56.386,52.345-49.19,52.837-48.894
                C144.853,60.372,137.116,75.17,135.424,87.877z
                            "/></symbol>
                        </svg>
                        <svg className="login_logo"><use xlinkHref={"#login_logo"} transform="scale(0.41,0.41)" x="0" y="0" viewBox="0 0 81 81" width="200" height="200"/></svg>
                        <h3 >StarRiver</h3>
                    </div>
                    <div className="sub-title">
                        <p>智慧路灯管理系统</p>
                        <p>Smart Pole Control System</p>
                    </div>
                </header>
                <div className="container-mid">
                    <div className="bg-cover"></div>
                    <div className="login-right pull-right">
                        <p>用户登录</p>
                        <div className="form-group has-feedback">
                            <input id = 'username' type="text" className="form-control" value={this.state.user.username} onFocus={this.onFocus} onChange={(event) => this.onChange('username', event.target.value)}/>
                            <span className = "login_user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input id = 'password' type="password" className="form-control" value={this.state.user.password} onFocus={this.onFocus} onChange = {(event) => this.onChange('password',event.target.value)}/>
                            <span className = "login_password form-control-feedback"></span>
                        </div>
                        <p style={style}>用户名或密码错误</p>
                        <button type="button" className="btn btn-block btn-login" onClick={this.handleClick}>登录</button>
                    </div>
                </div>
                <footer>Copyright © 2017 SANSITECH.All rights reserverd.</footer>
            </div>
        )
    }
}

Login.propTypes = {
}

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({loginHandler}, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);



