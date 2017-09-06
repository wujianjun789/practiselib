import React, { Component } from 'react';
import Panel from '../../components/Panel.js';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';

import StepComponet from './addOrEditPopupChildren/index.js';

export default class AddOrEditPopup extends Component {
    constructor(props) {
        super(props);
    }

    // onCancel() {
    //     console.log('在popup调用onCancel')
    // }

    onConfirmed() {
        console.log(345)
    }

    render() {
        const props = this.props;
        console.log('props', props)
        return (
            <div id='sysConfigSmartLight-popup'>
              <Panel {...props} closeBtn>
                <StepComponet {...props}/>
              </Panel>
            </div>
        )
    }
}