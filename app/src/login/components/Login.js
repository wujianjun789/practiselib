/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loginHandler} from '../../api/login'

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
        this.loginSuccess = this.loginSuccess.bind(this);
        this.handleTest = this.handleTest.bind(this);
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

    handleTest(){
        console.log(getCookie("user"));
    }

    submitHandler() {
        this.props.actions.loginHandler(this.state.user.username, this.state.user.password, this.loginSuccess, this.loginFail);
    }

    componentDidMount() {
        var canvas = document.getElementById("canvas"),
            ctx = canvas.getContext("2d"),
            cw = window.innerWidth,
            ch = 460;
        canvas.width = cw;
        canvas.height = ch;
        var fontsize = 32;
        var columns = Math.ceil(cw/fontsize);
        var drops = [];
        var texts = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        for(var i=0,len=columns;i<len;i++){
            drops[i] = 1;
        }
        function run(){
            ctx.fillStyle = "rgba(24,133,255,0.4)";
            ctx.fillRect(0,0,cw,ch);
            ctx.fillStyle = "rgba(0,240,255,1)";
            ctx.font = fontsize + "px Tahoma";
            for(var i=0,len=drops.length;i<len;i++){
                var text = texts[Math.floor(Math.random()*texts.length)];
                ctx.fillText(text,i*fontsize,drops[i]*fontsize);

                if(drops[i]*fontsize>ch || Math.random()>0.95){
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(run,80);
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

    loginSuccess(){
        this.props.router.push('/')
    }
    
    render() {
        const style = this.state.style?this.state.style:{ visibility: 'hidden' };

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
                    <div className="bg-anm">
                        <canvas id="canvas"></canvas>
                    </div>
                    <div className="bg-cover"></div>
                    <div className="login-right pull-right">
                        <p onClick={this.handleTest}>用户登录</p>
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
        userCenter:state.userCenter
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({loginHandler}, dispatch)
    }
}


Login = connect(mapStateToProps, mapDispatchToProps)(Login);



