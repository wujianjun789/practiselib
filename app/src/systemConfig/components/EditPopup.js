import React, { Component } from 'react';
import Panel from '../../components/Panel.js';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';

import EditPopupComponet from './EditPopupComponent.js';

export default class EditPopup extends Component {
    constructor(props) {
        super(props);
    }

    // onCancel() {
    //     console.log('在popup调用onCancel')
    // }

    onConfirmed() {}

    render() {
        const props = this.props;
        console.log('props', props);
        return (
            <div id='sysConfigSmartLight-popup'>
              <Panel {...props} closeClick={ this.props.closeClick } closeBtn>
                <EditPopupComponet {...props}/>
              </Panel>
            </div>
        )
    }
}