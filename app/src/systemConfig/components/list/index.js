/** Created By ChrisWen
 *  17/09/06
 *  This Componet is a DeviceList.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  //this.onSpanClick = this.onSpanClick.bind(this);
  }

  onClick(item) {
    //console.log(item);
    this.props.itemClick(item);
  }

  // onSpanClick(item) {
  //   this.props.onSpanClick(item);
  // }
  render() {
    // console.log('Item-List-props', this.props);
    let {className='', iconClassName='', data, showIcon=false, operations=['firstOperation', 'secondOperation']} = this.props;
    const showDiv = item => {
      let index = item.added === true ? 1 : 0;
      return showIcon === true ? <span className={ iconClassName }></span> : operations[index];
    }

    // // const showOperation = 
    // const showDiv = showIcon === false ? operations[0] : <span className='delete'></span>;
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

