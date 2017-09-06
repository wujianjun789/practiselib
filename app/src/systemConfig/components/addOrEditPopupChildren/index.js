/** Created By ChrisWen
 *  17/09/04
 *  Declaring: All componets' className all follw the B_E-M(Block_Element-Modify) rules.
 *  Declaring: This componet provides AddOrEdit function as a popup.Import all two childrenComponents;
 *  ChildrenComponets just recevied all props that from parentComponet, with no logic funtions;
 *  All the datas and logic functions were setted or declared here.
 */
import React, { Component } from 'react';
import FirstStepComponent from './stepPopup/firStep.js';
import SecondStepComponent from './stepPopup/secStep.js';

import { overlayerHide } from '../../../common/actions/overlayer.js';

export default class StepComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFirstPage: true
        }
        this.onFlip = this.onFlip.bind(this);
    }

    onFlip() {
        this.setState({
            showFirstPage: !this.state.showFirstPage
        })
    }



    render() {
        const props = this.props;
        console.log('index.props', props);
        const StepComponent = this.state.showFirstPage === true
            ? <FirstStepComponent {...props} onFlip={ this.onFlip } disabled/>
            : <SecondStepComponent {...props} onFlip={ this.onFlip } />
        return (<div>
                  { StepComponent }
                </div>)
    }
}