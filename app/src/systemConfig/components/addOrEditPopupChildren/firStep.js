import React, { Component } from 'react';
import PanelFooter from '../../../components/PanelFooter.js';

export default class FirstStepComponet extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const props = this.props;
        const footer = <PanelFooter funcNames={ ['onCancel', 'onFlip'] } btnTitles={ ['取消', '下一步'] } {...props}/>;
        return (<div>
                  <h1>123</h1>
                  { footer }
                </div>)
    }
}