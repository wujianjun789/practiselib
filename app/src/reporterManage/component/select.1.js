import React from 'react';
import PropTypes from 'prop-types';

const Select = (props, context) => {
    let { id, className = '', disabled = true, options, onChange, } = props;
    return (
        <select className='form-control select fl' id={id} onChange={onChange} defaultValue={options[0]['value']} disabled={disabled}>
            {options.map((item, index) => {
                return <option key={index}  {...item}>{item.value}</option>
            })}
        </select>
    )
}

Select.propTypes = {
    id: PropTypes.string,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,

}

export default Select;
