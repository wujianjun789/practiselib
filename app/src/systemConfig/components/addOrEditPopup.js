import React, { Component } from 'react';
import Panel from '../../components/Panel.js';
import PanelFooter from '../../components/PanelFooter.js';
import Select from '../../components/Select.1.js';

import StepComponet from './addOrEditPopupChildren/index.js';

export default class AddOrEditPopup extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        //const {funcNames, btnTitles, btnDisabled=[false, false], btnClassName=['btn-default','btn-primary']} = this.props;
        const footer = <PanelFooter funcNames={ ['onCancel', 'onNext'] } btnTitles={ ['取消', '下一步'] } />;
        const props = this.props;
        return (
            <div id='sysConfigSmartLight-popup'>
              <Panel {...props} closeBtn>
                <StepComponet/>
              </Panel>
            </div>
        )
    }
}