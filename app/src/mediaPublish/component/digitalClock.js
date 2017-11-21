/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import _digitalClock from '../config/digitalClock.js';
import '../../../public/styles/digitalClock.less';

 export default class DigitalClock extends Component {
   constructor(props) {
     super(props);
     this.state = {
       config: _digitalClock
     }
   }
   componentDidMount() {
     const { config } = this.state;
   }
   render() {
     const { config } = this.state;
     const timeZone  = config.timeZone.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });
     const fontFamily = config.fontFamily.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });
     const fontSize = config.fontSize.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });
     const location = config.location.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });
     const timeFormat = config.timeFormat.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });
     const dateFormat = config.dateFormat.map((item,index) => {
       for(let k in item){
         return <option value={item[k]} key={index}>{k}</option>
       }
     });

     return(
       <div className='pro-container digitalClock' id='digitalClock'>
        <ul>
          <li>
            <div>素材名称</div>
            <div className='input_form'>
              <input type='text' disabled/>
            </div>
          </li>
          <li>
            <div>
              <div>时区</div>
              <div>
                <select>{timeZone}</select>
              </div>
            </div>
            <div>
              <div>播放时长</div>
              <div><input type='text'/></div>
            </div>
            <div>
              <div>背景颜色</div>
              <div className='color-picker'></div>
            </div>
          </li>
          <li>
            <div>文字内容</div>
            <div className='input_form'>
              <input type='text' />
            </div>
          </li>
          <li>
            <div>
              <div>选择字体</div>
              <div>
                <select>{fontFamily}</select>
              </div>
            </div>
            <div>
              <div>文字大小</div>
              <div>
                <select>{fontSize}</select>
              </div>
            </div>
            <div>
              <div>文字颜色</div>
              <div className='color-picker'></div>
            </div>
          </li>
          <li>
            <div>
              <div>区域设置</div>
              <div>
                <select>{location}</select>
              </div>
            </div>
          </li>
          <li>
            <div>
              <div>日期格式</div>
              <div>
                <select>{dateFormat}</select>
              </div>
            </div>
            <div>
              <div>时间格式</div>
              <div>
                <select>{timeFormat}</select>
              </div>
            </div>
            <div>
              <div>单行显示</div>
              <div><input type='checkbox' /></div>
            </div>
          </li>
          <li>
            <div>
              <button className='btn btn-primary'>重置</button>
              <button className='btn btn-primary'>应用</button>
            </div>
          </li>
        </ul>
       </div>
     )
   }
 }
