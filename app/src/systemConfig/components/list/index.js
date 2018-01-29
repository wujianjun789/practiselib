/** Created By ChrisWen
 *  17/09/06
 *  This Component is a DeviceList.
 *  For this componet, showIcon control whether the second <div /> shows Icon or not.
 *  The first div provide two operationWords for two situation.
 */
import React, { Component } from 'react';

export default class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(item) {
    this.props.itemClick(item);
  }

  render() {
    /**In realityEnv, sometimes we received more property than we need in this componet.
     * We user ...otherProps to filter other useless property for this component */
    let { className = '', iconClassName = '', data, showIcon = false,
      operations = ['firstOperation', 'secondOperation'] } = this.props;
    const showDiv = item => {
      /*item.add will control the firstdiv's status.
      You can use this property to control the operations(array)'s value such as index below */
      let index = item.added === true ? 1 : 0;
      return showIcon === true ?
        <svg className={iconClassName}>
          <use
            xlinkHref={'#logo_del'}
            className={'logo_del '}
            transform="scale(0.081,0.081)"
            x="0"
            y="0"
            viewBox="1 -2 20 20"
            width="200"
            height="200" />
        </svg> : operations[index];
    };

    const deviceList = data.length === 0 ? null : data.map((item, index) => {
      return (<li className="clearfix" key={ index }>
        <div>
          { item.name }
        </div>
        <div onClick={ (e) => this.onClick(item) } role="button">
          { showDiv(item) }
        </div>
      </li>);
    });

    return (<ul className={ className }>
      { deviceList }
    </ul>);
  }
}

