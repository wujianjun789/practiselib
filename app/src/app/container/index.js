/**
 * Created by a on 2017/6/29.
 */
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import '../../../public/styles/app.less';
import Card from './Card';
import UserCenter from '../../common/containers/UserCenter';
import LanguageSwitch from '../../common/containers/LanguageSwitch'
import Overlayer from '../../common/containers/Overlayer';
import {getModule} from '../action/index'
/**
 * @param {String} title required
 * @param {String} name  required
 * @param {Array}  items required
 */
export class App extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount(){
        const {actions} = this.props;
        actions && actions.getModule();
    }

    render(){
        const {title="StarRiver", name="智慧路灯管理系统", items} = this.props;
        return (
            <div className="app">
                <svg className="svgOnload">
                    <defs>
                        <linearGradient id="orange_red" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor:'rgb(0,216,255)',
                        stopOpacity:1}}/>
                        <stop offset="100%" style={{stopColor:'rgb(0,192,255)',
                        stopOpacity:1}}/>
                        </linearGradient>
                    </defs>
                    <symbol id="logo"><path fill="url(#orange_red)" d="M100,3C46.428,3,3,46.428,3,100s43.428,97,97,97s97-43.428,97-97S153.572,3,100,3z M96.869,41.074
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
                <div className="header clearfix">
                    <div className="header-left clearfix">
                        <svg className="logo"><use xlinkHref={"#logo"} transform="scale(0.19,0.19)" x="0" y="0" viewBox="0 0 38 38" width="200" height="200"/></svg>
                        <span className="tit">{title}</span>
                    </div>
                    <UserCenter />
                    <LanguageSwitch/>
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

const mapStateToProps = (state, ownProps) => {
    let app = state.app;
    return {
        title: app.title,
        name: app.name,
        items: app.items
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({
            getModule: getModule
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);