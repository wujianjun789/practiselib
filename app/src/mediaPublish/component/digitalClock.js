/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

import React, { Component } from 'react';
import Select from '../../components/Select.1.js'
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
            <div className='input_form'>
              <input type='text' disabled/>
              <div>123</div>
            </div>
          </li>
          <li>
            <div>
              <div>时区:</div>
              <div><Select/></div>
            </div>
            <div>
              <div>播放时长:</div>
              <div className='input_form'>
                <input type='text'/>
                <div>123</div>
            </div>
          </div>
            <div>背景颜色</div>
          </li>
        </ul>
       </div>
     )
   }
 }
