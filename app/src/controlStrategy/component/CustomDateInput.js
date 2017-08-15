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
        return <div className="date-custom-input">
            <input type="text" className="form-control" value={this.props.value} onChange={this.onChange}/><span className="icon icon_calendar" onClick={this.props.onClick}></span>
        </div>
    }
}