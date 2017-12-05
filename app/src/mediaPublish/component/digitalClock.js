/** Created By ChrisWen
 *  17/11/17
 *  数字时钟
 */

import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import _digitalClock from '../config/digitalClock.js';
import { SketchPicker, BlockPicker } from 'react-color';
import '../../../public/styles/digitalClock.less';

import {FormattedMessage,injectIntl, FormattedDate} from 'react-intl';

class DigitalClock extends Component {
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
        playTime_noticeShow: false,
        textContent_noticeShow: false
      }
     }

    this.selectChange = this.selectChange.bind(this);
    this.resetData = this.resetData.bind(this);
    this.handleDataChange = this.handleDataChange.bind(this);
    this.handleSingleShow = this.handleSingleShow.bind(this);
    this.submitData = this.submitData.bind(this);
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
   handleDataChange(e, _id, _property){
    const _options = this.state.options;
    const _textContent = e.target.value;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    const _show =`${__id}${_property}_noticeShow`;
    if(!_textContent){
      this.setState({
        data: {
          ...this.state.data,
          [_name]: _textContent
        },
        options: {
          ..._options,
          [_show]: true
        }
      })
    }else {
      this.setState({
        data: {
          ...this.state.data,
          [_name]: _textContent
        },
        options: {
          ..._options,
          [_show]: false
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
  submitData(){
    const _digitalClockData = this.state.data;
    let _options = null;
    for(let k in _digitalClockData) {
      if(!_digitalClockData[k] && k !== 'singleShow') {
        const warnTarget = `${k}_noticeShow`;
        _options = {
          ..._options,
          [warnTarget]: true
        }
      }
    }
    if(_options){
      this.setState({
        options: _options
      })
    } else {
      console.table(_digitalClockData);
    }
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
     const {property} = config;

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
            <div>{this.props.intl.formatMessage({id:property.materialName})}</div>
            <div className='input_form'>
              <input className='form-control' type='text' value={data.name} disabled/>
            </div>
          </li>
          <li>
            <div>
              <div>{this.props.intl.formatMessage({id:property.timeZone})}</div>
                {timeZone}
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.playTime})}</div>
              <div>
                <input className='form-control' type='number' placeholder='s' onChange={(e) => {this.handleDataChange(e, '', 'playTime')}} value={data.playTime}/>
                <div className='notice'><span className={`${options.playTime_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
              </div>
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.bgColor})}</div>
              <div className='color-picker' id='bgColor' onClick={() => {this.handleColorPicker('bgColor')}} style={{backgroundColor:data.bgColor,borderColor:data.bgColor}}>
                  {colorPicker.bgColor ? <SketchPicker color={data.bgColor} onChange={(color) => {this.handleColorChange('bgColor', color)} }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>{this.props.intl.formatMessage({id:property.textContent})}</div>
            <div className='input_form'>
              <input className='form-control' type='text' onChange={(e) => {this.handleDataChange(e, '', 'textContent')}} value={data.textContent}/>
              <div className='notice'><span className={`${options.textContent_noticeShow === true ? 'show' : 'hidden'}`}>请输入文字内容</span></div>
            </div>
          </li>
          <li>
            <div>
              <div>{this.props.intl.formatMessage({id:property.fontFamily})}</div>
                {fontFamily}
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.fontSize})}</div>
                {fontSize}
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.fontColor})}</div>
              <div className='color-picker' id='fontColor' onClick={() => {this.handleColorPicker('fontColor')}} style={{backgroundColor:data.fontColor,borderColor:data.fontColor}}>
                  {colorPicker.fontColor ? <SketchPicker color={data.fontColor} onChange={color => {this.handleColorChange('fontColor', color)} }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>
              <div>{this.props.intl.formatMessage({id:property.locationSet})}</div>
                {location}
            </div>
          </li>
          <li>
            <div>
              <div>{this.props.intl.formatMessage({id:property.dateFormat})}</div>
                {dateFormat}
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.timeFormat})}</div>
                {timeFormat}
            </div>
            <div>
              <div>{this.props.intl.formatMessage({id:property.singleShow})}</div>
              <div><input type='checkbox' checked={data.singleShow} onClick={this.handleSingleShow}/></div>
            </div>
          </li>
          <li>
            <div>
              <button className='btn btn-primary' onClick={this.resetData}>{this.props.intl.formatMessage({id:property.resetBtn})}</button>
              <button className='btn btn-primary' onClick={this.submitData}>{this.props.intl.formatMessage({id:property.confirmBtn})}</button>
            </div>
          </li>
        </ul>
       </div>
     )
   }
 }

 export default injectIntl(DigitalClock);