/**
 * Created by a on 2017/6/29.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types';
import '../../../public/styles/app.less';
import Card from './Card';
import UserCenter from '../../common/containers/UserCenter';
import Overlayer from '../../common/containers/Overlayer';
import {loginHandler} from '../../api/login'
import {getModule} from '../action/index'
/**
 * @param {String} title required
 * @param {String} name  required
 * @param {Array}  items required
 */
export class App extends Component{
    constructor(props){
        super(props);
        this.loginFail = this.loginFail.bind(this);
        this.loginSuccess = this.loginSuccess.bind(this);
    }

    componentWillMount(){
        console.log(localStorage)
        /*if(sessionStorage.sessionID==0||sessionStorage.sessionID==null||sessionStorage.sessionID==""){
            
            this.props.router.push('/login')
            
        }else{

            this.props.actions.loginHandler(sessionStorage.username, sessionStorage.password, this.loginSuccess, this.loginFail);

        }*/
        // if(this.props.userCenter.islogin!=1){
        //     this.props.router.push('/login')
        // }
        const {actions} = this.props;
        actions && actions.getModule();
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {



    }

    loginFail(){
        this.setState({style:{visibility: 'visible'}})
    }

    loginSuccess(){
        this.props.router.push('/')
    }

    render(){
        const {title="StarRiver", name="智慧路灯管理系统", items} = this.props;
        return (
            <div className="app">
                <div className="header clearfix">
                    <div className="header-left clearfix">
                        <span className="icon icon-logo"></span>
                        <span className="tit">{title}</span>
                    </div>
                    <UserCenter router={this.props.router}/>
                    <div className="header-right clearfix">
                        <span className="name">{name}</span>
                    </div>
                </div>
                <div className="cont">
                    <ul className="clearfix">
                        {items.map((item, index)=><li key={item.key}><Card _key={item.key} title={item.title} link={item.link}/></li>)}
                    </ul>
                </div>
                <Overlayer />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let app = state.app;
    return {
        title: app.title,
        name: app.name,
        items: app.items,
        userCenter:state.userCenter
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getModule: getModule,
            loginHandler
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired
        })
    ).isRequired
}