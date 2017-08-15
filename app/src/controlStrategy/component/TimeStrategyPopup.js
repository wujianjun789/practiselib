/**
 * Created by a on 2017/8/14.
 */
import React,{Component} from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CustomDateInput from './CustomDateInput';

import {getMomentDate, momentDateFormat,getMomentUTC} from '../../util/time'
export default class TimeStrategyPopup extends Component{
    constructor(props){
        super(props);
        this.state = {
            date:getMomentDate()
        }

        this.onChange = this.onChange.bind(this);
    }

    onChange(data){
        console.log(data);
    }

    render(){
        const {date} = this.state;
        console.log(momentDateFormat(date));
        console.log(getMomentUTC(date));
        return <DatePicker customInput={<CustomDateInput />} dateFormat="MM/DD" selected={date} onChange={this.onChange}/>;
    }
}