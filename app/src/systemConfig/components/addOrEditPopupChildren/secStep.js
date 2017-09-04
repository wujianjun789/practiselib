import React, { Component } from 'react';
import PanelFooter from '../../../components/PanelFooter.js';

export default class SecondStepComponet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        const footer = <PanelFooter funcNames={ ['onFlip', 'onConfirm'] } btnTitles={ ['上一步', '完成'] } {...props}/>;
        return (<div>
                  <h1>456</h1>
                  { footer }
                </div>)
    }
}