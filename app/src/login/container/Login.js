/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
            <div className="container-fluid">
                <div className="container-login">
                    <div className="">
                       用户名: <input type="text"/>
                    </div>
                    <div className="">
                        密 码: <input type="password"/>
                    </div>
                    <div className="">
                        <input type="button" value="登录" onClick={this.login}/>
                    </div>
                </div>
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