/**
 * Created by a on 2017/8/1.
 */
import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Content from '../../components/Content'

export default class LampConCenter extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount(){
    }

    componentWillUnmount(){

    }


    render(){
        return <Content>
            灯集中控制器
        </Content>
    }
}