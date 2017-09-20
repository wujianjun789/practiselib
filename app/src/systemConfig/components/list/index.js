/** Created By ChrisWen
 *  17/09/06
 *  This Component is a DeviceList.
 *  For this componet, showIcon control whether the second <div /> shows Icon or not.The first div provide two operationWords for two situation.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(item) {
    this.props.itemClick(item);
  }


  render() {
    /**In realityEnv, sometimes we received more property than we need in this componet.We user ...otherProps to filter other useless property for this component */
    let {className='', iconClassName='', data, showIcon=false, operations=['firstOperation', 'secondOperation'], ...otherProps} = this.props;
    const showDiv = item => {
      /*item.add will control the firstDiv's status.You can use this property to control the operations(array)'s value such as index below */
      let index = item.added === true ? 1 : 0;
      return showIcon === true ? <span className={ iconClassName }></span> : operations[index];
    }

    const deviceList = data.length === 0 ? null : data.map((item, index) => {
      return (<li className='clearfix' key={ index }>
                <div>
                  { item.name }
                </div>
                <div onClick={ () => this.onClick(item) }>
                  { showDiv(item) }
                </div>
              </li>)
    });

    return (<ul className={ className }>
              { deviceList }
            </ul>)
  }
}

