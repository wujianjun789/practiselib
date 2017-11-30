import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

/**
 * Panel footer with button
 * @prop funcNames {array}  btn's function
 * @prop btnTitles {array}  btn's title
 */
export default class PanelFooter extends PureComponent {
    static propTypes = {
        funcNames: PropTypes.arrayOf(PropTypes.string).isRequired,
        btnTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
        btnDisabled: PropTypes.arrayOf(PropTypes.bool)
    }
    
    render() {
        const {funcNames, btnTitles, btnDisabled=[false, false], btnClassName=['btn-default','btn-primary']} = this.props;
        return (
            <div className="modal-footer">
                <button type="button" className={`btn ${btnClassName[0]}`} disabled={btnDisabled[0]} onClick={this.props[funcNames[0]]}><FormattedMessage id={btnTitles[0]}/></button>
                <button type="button" className={`btn ${btnClassName[1]}`} disabled={btnDisabled[1]} onClick={this.props[funcNames[1]]}><FormattedMessage id={btnTitles[1]}/></button>
            </div>
        )
    }
}