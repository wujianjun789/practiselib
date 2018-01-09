import React from 'react';
import PropTypes from 'prop-types';

const Select = (props, context) => {
    const { id, className = '', options, onChange } = props;
    return (
        <select className={`form-control select ${className}`} id={id} onChange={onChange} >
            {options.map((option, index) => {
                const value = option['name'];
                return <option key={index} value={value}>{value}</option>
            })}
        </select>
    )
}

Select.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
}

export default Select;
