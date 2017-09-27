/**
 * Created by a on 2017/7/7.
 */

import React from 'react';
import PropTypes from 'prop-types';
/**
 *
 * @param {{id: string, className: string, titleField: string, valueField: string, options: [{}], value: any, onChange: function, ...otherProps: any}} props
 * @param {*} context
 */

const Select = (props, context) => {
  	const {className='', titleField='value', valueField='value', index, options=[], value="", onChange, ...otherProps} = props;
  	return (
		<select className={ `form-control select ${className}` } value={ value } onChange={ onChange } {...otherProps}>
           { options.map((option, index) => <option key={ index } value={ option[valueField] }>
                                              { option[titleField] }
                                            </option>) }
		</select>
	  )
}

Select.propTypes = {
	className: PropTypes.string,
	titleField: PropTypes.string,
	valueField: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.object),
	value: PropTypes.any,
	onChange: PropTypes.func
}

export default Select;
