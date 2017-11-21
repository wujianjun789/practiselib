/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import _digitalClock from '../config/digitalClock.js';
import { SketchPicker, BlockPicker } from 'react-color';
import '../../../public/styles/digitalClock.less';

 export default class DigitalClock extends Component {
   constructor(props) {
     super(props);
     this.state = {
       config: _digitalClock,
       initData: {
         timeZone: 'ShangHai',
         fontFamily: 'Microsoft YaHei',
         fontSize: 'Middle',
         location: 'ShangHai',
         dateFormat: 'Lunar + YMD',
         timeFormat: 'Lunar + YMD'
       },
       data: this.props.data ? this.props.data :{
        timeZone: 'BeiJing',
        fontFamily: 'Microsoft YaHei',
        fontSize: 'Middle',
        location: 'ShangHai',
        dateFormat: 'Lunar + YMD',
        timeFormat: 'Lunar + YMD',
        fontColor: 'red',
        bgColor: 'pink'
      },
      colorPicker: {
        bgColor: false,
        fontColor: false
      }
     }

    this.selectChange = this.selectChange.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleColorPicker = this.handleColorPicker.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
   }
   componentDidMount() {
     const { config } = this.state;
   }
   selectChange(e){
    const _key = e.target.name;
    const _value = e.target.value;
    const _data = this.state.data;
    this.setState({
      data: {
        ..._data,
        [_key]:_value
      }
    }, ()=>{console.log(this.state.data)})
   }
   resetData(){
     const {initData} = this.state;
     this.setState({
       data: initData
     })
   }
   handleData(){
    const _digitalClockData = this.state.data;
    console.log('数字时钟的设置:', _digitalClockData);
   }
   handleColorPicker(e){
     // console.log(e.target.id);
     const id = e.target.id;
     // const status = this.state.colorPicker[id];
     // console.log(status);
     this.setState({
      colorPicker: {
        [id]: !this.state.colorPicker[id]
      }
     })
   }
  handleColorChange(color, e){
    // console.log(color, e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id);
    const colorPicker_id = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.id;
    this.setState({
      data:{
        ...this.state.data,
        [colorPicker_id]: color.hex
      }
    });
  //this.handleColorPicker();
  }
   renderOptions(_propertyArray) {
     const { config } = this.state;
     const { data } = this.state;
     return _propertyArray.map((item, index) => {
       return <div>
                <select key={index} onChange={this.selectChange} name={item} value={data[item]}>{config[item].map((_item, _index) => {
                  for(let k in _item){
                    return <option value={_item[k]} key={_index}>{k}</option>
                  }
                })}
                </select>
              </div>
            })
   }
   render() {
     const { config,data,colorPicker } = this.state;
     const _propertyArray = ['timeZone', 'fontFamily', 'fontSize', 'location', 'timeFormat', 'dateFormat'];
     const _propertyOptions = this.renderOptions(_propertyArray);
     const timeZone  = _propertyOptions[_propertyArray.indexOf('timeZone')];
     const fontFamily = _propertyOptions[_propertyArray.indexOf('fontFamily')];
     const fontSize = _propertyOptions[_propertyArray.indexOf('fontSize')];
     const location = _propertyOptions[_propertyArray.indexOf('location')];
     const timeFormat = _propertyOptions[_propertyArray.indexOf('timeFormat')];
     const dateFormat = _propertyOptions[_propertyArray.indexOf('dateFormat')];
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
                {timeZone}
            </div>
            <div>
              <div>播放时长</div>
              <div><input type='text'/></div>
            </div>
            <div>
              <div>背景颜色</div>
              <div className='color-picker' id='bgColor' onClick={this.handleColorPicker} style={{backgroundColor:data.bgColor,borderColor:data.bgColor}}>
                  {colorPicker.bgColor ? <SketchPicker color={data.bgColor} onChange={ this.handleColorChange }/> : null}
              </div>
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
                {fontFamily}
            </div>
            <div>
              <div>文字大小</div>
                {fontSize}
            </div>
            <div>
              <div>文字颜色</div>
              <div className='color-picker' id='fontColor' onClick={this.handleColorPicker} style={{backgroundColor:data.fontColor,borderColor:data.fontColor}}>
                  {colorPicker.fontColor ? <SketchPicker color={data.fontColor} onChange={ this.handleColorChange }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>
              <div>区域设置</div>
                {location}
            </div>
          </li>
          <li>
            <div>
              <div>日期格式</div>
                {dateFormat}
            </div>
            <div>
              <div>时间格式</div>
                {timeFormat}
            </div>
            <div>
              <div>单行显示</div>
              <div><input type='checkbox' /></div>
            </div>
          </li>
          <li>
            <div>
              <button className='btn btn-primary' onClick={this.resetData}>重置</button>
              <button className='btn btn-primary' onClick={this.handleData}>应用</button>
            </div>
          </li>
        </ul>
       </div>
     )
   }
 }
