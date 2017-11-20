/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

import React, { Component } from 'react';
import '../../../public/styles/digitalClock.less';

 export default class DigitalClock extends Component {
   constructor(props) {
     super(props);
     this.state = {
       config:{
         key: 'digitalClock',
         title: '属性'
       }
     }
   }
   render() {
     const { config } = this.state;
     return(
       <div className='pro-container digitalClock' id='digitalClock'>
        <ul>
          <li>
            <div>素材名称:</div>
            <div>
              <input type='text'/>
              <div>123</div>
            </div></li>
        </ul>
       </div>
     )
   }
 }
