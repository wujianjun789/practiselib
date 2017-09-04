/** Created By ChrisWen
 *  17/09/04
 */
import React, { Component } from 'react';
import FirstStepComponet from './firStep.js';
import SecondStepComponet from './secStep.js';

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
        const StepComponent = this.state.showFirstPage === true ? <FirstStepComponet onFlip={ this.onFlip } /> : <SecondStepComponet onFlip={ this.onFlip } />
        return (<div>
                  { StepComponent }
                </div>)
    }
}