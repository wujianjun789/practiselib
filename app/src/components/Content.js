/**
 * Created by a on 2017/7/4.
 */
import React,{Component} from 'react';

export default class Content extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const {className=""} = this.props;
        return <div className={"content "+className}>
            {this.props.children}
        </div>
    }
}