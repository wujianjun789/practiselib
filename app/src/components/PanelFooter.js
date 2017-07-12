import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
/**
 * Panel footer with button
 * @prop funcNames {array}  btn's function
 * @prop btnTitles {array}  btn's title
 */
export default class PanelFooter extends PureComponent {
    render() {
        const {funcNames, btnTitles, btnDisabled=[false, false], btnClassName=['btn-default','btn-primary']} = this.props;
        return (
            <div className="row">
                <div className="btn-toolbar pull-right padding-right" role="toolbar" aria-label="toolbar">
                    <div className="btn-group" role='group' aria-label="group">
                        <button type="button" className={`btn ${btnClassName[0]}`} disabled={btnDisabled[0]} onClick={this.props[funcNames[0]]}>{btnTitles[0]}</button>
                    </div>
                    <div className="btn-group" role="group" aria-label="group">
                        <button type="button" className={`btn ${btnClassName[1]}`} disabled={btnDisabled[1]} onClick={this.props[funcNames[1]]}>{btnTitles[1]}</button>
                    </div>
                </div>
            </div>
        )
    }
}

PanelFooter.PropTypes = {
    funcNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    btnTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
    btnDisabled: PropTypes.arrayOf(PropTypes.bool)
}