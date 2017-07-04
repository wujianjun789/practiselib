/**
 * Created by a on 2017/4/19.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class AssetManage extends Component {
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
            <div className="container">
                <div className="head">
                    资产管理
                </div>
                <div className="sidebar">资产模型</div>
                <div className="content">content</div>
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
        }, dispatch)
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AssetManage);