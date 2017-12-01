import React from 'react';
import PropTypes from 'prop-types';
import PanelFooter from './PanelFooter';
import {FormattedMessage} from 'react-intl';

const ConfirmPopup = ({tips='', iconClass='', cancel, confirm}) => {
    return <div className="usr-exit">
        <div className='tips'>
            <div><span className={`icon ${iconClass}`}></span></div>
            {tips}
        </div>
         <div className="btn-toolbar">
            <div className='btn-group'><button className="btn btn-default" onClick={cancel}><FormattedMessage id='button.cancel'/></button></div>
            <div className='btn-group'><button className="btn btn-primary" onClick={confirm}><FormattedMessage id='button.confirm'/></button></div>
        </div> 
    </div>
}

ConfirmPopup.prototype = {
    tips: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]).isRequired,
    iconClass: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    confirm: PropTypes.func.isRequired
}

export default ConfirmPopup;