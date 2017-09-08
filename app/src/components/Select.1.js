/**
 * Created by a on 2017/7/7.
 */

import React, { Component } from 'react'

const Select = (props, context) => {
  const {id="", className='', titleField='value', valueField='value', index, options=[], value="", onChange, ...otherProps} = props;
  return <select id={ id } className={ `form-control select ${className}` } value={ value } onChange={ onChange } {...otherProps}>
           { options.map((option, index) => <option key={ index } value={ option[valueField] }>
                                              { option[titleField] }
                                            </option>) }
         </select>
}

export default Select;