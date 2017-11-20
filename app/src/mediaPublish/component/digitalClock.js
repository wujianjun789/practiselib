/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

 import React, { Component } from 'react';

 export default class DigitalClock extends Component {
   constructor(props) {
     super(props);
     this.state = {}
   }
   render() {
     const { curType } = this.props;
     return(
       <div className={'pro-container digitalClock' + (curType == 'digitalClock' ? '' : 'hidden')}>
        <div className='form-group clock-name'>
          <label className="control-label"
                 htmlFor={property.areaName.key}>{property.areaName.title}</label>
          <div className="input-container">
              <input type="text" className='form-control'/>
              <span className=''>{"请输入正确参数"}</span>
          </div>
        </div>
       </div>
     )
   }
 }
