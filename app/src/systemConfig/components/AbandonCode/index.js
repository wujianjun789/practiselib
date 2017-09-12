/** Created By ChrisWen
 *  17/09/04
 *  Declaring: All componets' className all follw the B_E-M(Block_Element-Modify) rules.
 *  Declaring: This componet provides AddOrEdit function as a popup.Import all two childrenComponents;
 *  ChildrenComponets just recevied all props that from parentComponet, with no logic funtions;
 *  All the datas and logic functions were setted or declared here.
 */
import React, { Component } from 'react';
import SecondStepComponent from './stepPopup/secStep.js';

export default class StepComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;
        return (<div>
                  <SecondStepComponent {...props} onFlip={ this.onFlip } />
                </div>)
    }
}