/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react';
export default class CustomDateInput extends Component{
    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this)
    }

    onChange(event){

    }

    render(){
        return <div className="custom-input">
            <input type="text" value={this.props.value} onChange={this.onChange}/><button onClick={this.props.onClick}>日期</button>
        </div>
    }
}