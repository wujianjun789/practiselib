/**
 * Created by a on 2017/7/7.
 */
import React,{Component} from 'react'

const Select = (props, context) => {
    const {className='', titleField='value', valueField='value', options=[], value="", onChange} = props;
    return <select className={`select ${className}`} value={value} onChange={onChange}>
        {
            options.map( (option, index) => <option key={index} value={option[valueField]}>{option[titleField]}</option> )
        }
    </select>
}

export default Select;