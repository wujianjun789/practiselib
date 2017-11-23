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
         name: '数字时钟',
         playTime: '',
         textContent: '',
         timeZone: 'ShangHai',
         fontFamily: 'Microsoft YaHei',
         fontSize: 'Middle',
         location: 'ShangHai',
         dateFormat: 'Lunar + YMD',
         timeFormat: 'Lunar + YMD',
         fontColor: 'red',
         bgColor: 'pink',
         singleShow: false
       },
       data: this.props.data ? this.props.data :{
        name: '数字时钟',
        playTime: '',
        textContent: '',
        timeZone: 'BeiJing',
        fontFamily: 'Microsoft YaHei',
        fontSize: 'Middle',
        location: 'ShangHai',
        dateFormat: 'Lunar + YMD',
        timeFormat: 'Lunar + YMD',
        fontColor: 'red',
        bgColor: 'pink',
        singleShow: false
      },
      colorPicker: {
        bgColor: false,
        fontColor: false
      },
      options: {
        time_noticeShow: false,
        text_noticeShow: false
      }
     }

    this.selectChange = this.selectChange.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSingleShow = this.handleSingleShow.bind(this);
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
      }})
   }
   resetData(){
     const {initData} = this.state;
     this.setState({
       data: initData
     })
   }
   handleData(){
    const _digitalClockData = this.state.data;
    if(!_digitalClockData.playTime){
      this.setState({
        options:{
          time_noticeShow: true
        }
      })
    } else if(!_digitalClockData.textContent){
      this.setState({
        options:{
          text_noticeShow: true
          }
        })
      } else {
        console.table(_digitalClockData);
      }
   }
   handleTextChange(e){
    const _textContent = e.target.value;
    if(!_textContent){
      this.setState({
        options:{
          ...this.state.options,
          text_noticeShow: true
        }
      })
    } else {
      this.setState({
        data: {
          ...this.state.data,
          textContent: _textContent
        },
        options: {
          ...this.state.options,
          text_noticeShow: false
        }
      })
    }

   }
   handleTimeChange(e){
     const _playTime = e.target.value;
     if(_playTime < 0 || !e){
      this.setState({
        options:{
          ...this.state.options,
          time_noticeShow: true
        }
      })
     } else {
      this.setState({
        data: {
          ...this.state.data,
          playTime: _playTime
        },
        options:{
          ...this.state.options,
          time_noticeShow: false
        }
       })
     }
   }
   handleColorPicker(item){
     const id = item;
     this.setState({
      colorPicker: {
        [id]: !this.state.colorPicker[id]
      }
     })
   }
  handleColorChange(item, color){
    const colorPicker_id = item;
    this.setState({
      data:{
        ...this.state.data,
        [colorPicker_id]: color.hex
      }
    });
  }
  handleSingleShow(){
    const _data = this.state.data;
    const _show = this.state.data.singleShow;
    this.setState({
      data:{
        ..._data,
        singleShow: !_show
      }
    })
  }
   renderOptions(_propertyArray) {
     const { config } = this.state;
     const { data } = this.state;
     return _propertyArray.map((item, index) => {
       return <div>
                <select className='form-control' key={index} onChange={this.selectChange} name={item} value={data[item]}>{config[item].map((_item, _index) => {
                  for(let k in _item){
                    return <option value={_item[k]} key={_index}>{k}</option>
                  }
                })}
                </select>
              </div>
            })
   }
   render() {
     const { config, data, colorPicker, options } = this.state;
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
              <input className='form-control' type='text' value={data.name} disabled/>
            </div>
          </li>
          <li>
            <div>
              <div>时区</div>
                {timeZone}
            </div>
            <div>
              <div>播放时长</div>
              <div>
                <input className='form-control' type='number' placeholder='秒' onChange={this.handleTimeChange} value={data.playTime}/>
                <div className='notice'><span className={`${options.time_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
              </div>
            </div>
            <div>
              <div>背景颜色</div>
              <div className='color-picker' id='bgColor' onClick={() => {this.handleColorPicker('bgColor')}} style={{backgroundColor:data.bgColor,borderColor:data.bgColor}}>
                  {colorPicker.bgColor ? <SketchPicker color={data.bgColor} onChange={(color) => {this.handleColorChange('bgColor', color)} }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>文字内容</div>
            <div className='input_form'>
              <input className='form-control' type='text' value={data.textContent} onChange={this.handleTextChange}/>
              <div className='notice'><span className={`${options.text_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
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
              <div className='color-picker' id='fontColor' onClick={() => {this.handleColorPicker('fontColor')}} style={{backgroundColor:data.fontColor,borderColor:data.fontColor}}>
                  {colorPicker.fontColor ? <SketchPicker color={data.fontColor} onChange={color => {this.handleColorChange('fontColor', color)} }/> : null}
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
              <div><input type='checkbox' checked={data.singleShow} onClick={this.handleSingleShow}/></div>
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
