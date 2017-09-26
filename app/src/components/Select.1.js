/**
 * Created by a on 2017/7/7.
 */

import React, { Component } from 'react'

const Select = (props, context) => {
  const {id="", className='', titleField='value', valueField='value', index, options=[], value="", onChange, ...otherProps} = props;
  //console.log('Select收到的props为:', props);
  return <select id={ id } className={ `form-control select ${className}` } value={ value } onChange={ onChange } {...otherProps}>
           {id=="domain"&&options.length==0 && <option value="" defaultValue>请添加域</option>}
           {id=="device"&&options.length==0 && <option value="" defaultValue>请添加场景设备</option>}
           { options.map((option, index) => <option key={ index } value={ option[valueField] }>
                                              { option[titleField] }
                                            </option>) }
         </select>
}

export default Select;