/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react';

import  Overlayer from '../overlayer/containers/overlayer'

export default class Content extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return <div className="content">
            {this.props.children}
            <Overlayer />
        </div>
    }
}