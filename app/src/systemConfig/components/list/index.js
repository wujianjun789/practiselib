/** Created By ChrisWen
 *  17/09/06
 *  This Componet is a DeviceList.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stepCount: 1
        }
        this.nextStep = this.nextStep.bind(this);
    }

    nextStep(e) {
        e.target.innerHTML = this.props.operations[1];
    }

    render() {
        let {className='', data, showIcon=false, operations=['firstOperation', 'secondOperation']} = this.props;
        const deviceList = data.map((item, index) => {
            return (<li className='clearfix' key={ index }>
                      <div>
                        { item.name }
                      </div>
                      <div onClick={ this.nextStep }>
                        { item.added === false ? operations[0] : operations[1] }
                      </div>
                    </li>)
        })
        return (<ul className={ className }>
                  { deviceList }
                </ul>)
    }
}