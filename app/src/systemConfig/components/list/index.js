/** Created By ChrisWen
 *  17/09/06
 *  This Componet is a DeviceList.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceList extends Component {
    render() {
        let {className='', data, showIcon=false, operations=['firstOperation', 'secondOperation']} = this.props;
        const showDiv = showIcon === false ? <div>
                                               { operations[0] }
                                             </div> : <div onClick={ this.props.onDeleted }><span className='delete'></span></div>
        const deviceList = data.map((item, index) => {
            return (<li className='clearfix' key={ index }>
                      <div>
                        { item.name }
                      </div>
                      { showDiv }
                    </li>)
        })
        return (<ul className={ className }>
                  { deviceList }
                </ul>)
    }
}