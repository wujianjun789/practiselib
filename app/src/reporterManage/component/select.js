import React from 'react';
import PropTypes from 'prop-types';

const Select = (props, context) => {
    const { id, className = '', disabled = false, hidden = false, options, onChange, current } = props;

    let defaultValue = null;
    if (id === 'domain' && current) {
        defaultValue = current.name;
    }
    return (
        <select className={`form-control select ${className}`} disabled={disabled} id={id} onChange={onChange}
            defaultValue={defaultValue}>
            {options.map((item, index) => {
                return <option key={index} hidden={item.hidden} value={item.name}>{item.name}</option>;
            })}
        </select>
    );
};

Select.propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func.isRequired,
    current: PropTypes.any,
};

export default Select;
