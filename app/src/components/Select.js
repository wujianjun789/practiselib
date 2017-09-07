/**
 * Created by a on 2017/7/7.
 */
import React, { Component } from 'react'
import Immutable from 'immutable';

export default class Select extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.onChange && this.props.onChange(event.target.selectedIndex);
    }

    render() {
        const {className='', id='', valueKey="value", titleKey="value", data=Immutable.fromJS({
                list: [],
                value: '',
                placeholder: ""
            })} = this.props;

        return <select className={ "select " + className + " form-control" } id={ id } placeholder={ data.get('placeholder') } value={ data.get("value") } onChange={ this.onChange }>
                 { data.get('list').map((option, index) => {
                       let value = option.get(valueKey);
                       let title = option.get(titleKey);
                       return <option key={ index } value={ value }>
                                { title }
                              </option>
                   }) }
               </select>
    }
}