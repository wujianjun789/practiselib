import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({onChange, allChecked, id}) => {
    return <label className="checkbox ant-checkbox-wrapper">
        <span className={`checkbox-span ${allChecked?"checkbox-checked":''}`}>
            <input id={id} type="checkbox" className="checkbox-input" value="on" onChange={onChange}/>
            <span className="checkbox-inner"></span>
        </span>全选
    </label>
}

Checkbox.prototype = {

}
export default Checkbox;