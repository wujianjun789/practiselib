/** 魔法，勿动！
  * Created By ChrisWen
  * 17/11/22
  * VirtualClock
  */
import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import _virtualClock from '../config/virtualClock.js';
import { SketchPicker, BlockPicker } from 'react-color';
import '../../../public/styles/virtualClock.less';

import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';

class VirtualClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: _virtualClock,
      initData: {
        name: '模拟时钟',
        playTime: '',
        textContent: '',
        timeZone: 'ShangHai',
        title_fontFamily: 'Microsoft YaHei',
        scale_fontFamily: 'Microsoft YaHei',
        split_fontFamily: 'Microsoft YaHei',
        date_fontFamily: 'Microsoft YaHei',
        weekend_fontFamily: 'Microsoft YaHei',
        title_fontSize: 'Large',
        scale_fontSize: 'Middle',
        split_fontSize: 'Middle',
        date_fontSize: 'Middle',
        weekend_fontSize: 'Small',
        fontFamily: 'Microsoft YaHei',
        fontSize: 'Middle',
        location: 'ShangHai',
        dateFormat: 'Lunar + YMD',
        title_color: '#342534',
        fontColor: 'red',
        bg_color: 'pink',
        scale_color: 'yellow',
        split_color: '#778899',
        date_color: '#228877',
        weekend_color: '#445533',
        weekend_color: '#445533',
        hour_color: '#0C80F3',
        minute_color: '#29E629',
        second_color: '#E207E2',
        scale_width: '',
        scale_height: '',
        split_width: '',
        split_height: ''
      },
      data: {
        name: '模拟时钟',
        playTime: '',
        textContent: '',
        timeZone: 'BeiJing',
        title_fontFamily: 'Microsoft YaHei',
        scale_fontFamily: 'Microsoft YaHei',
        split_fontFamily: 'Microsoft YaHei',
        date_fontFamily: 'Microsoft YaHei',
        weekend_fontFamily: 'Microsoft YaHei',
        title_fontSize: 'Large',
        scale_fontSize: 'Middle',
        split_fontSize: 'Middle',
        date_fontSize: 'Middle',
        weekend_fontSize: 'Small',
        fontFamily: 'Microsoft YaHei',
        fontSize: 'Middle',
        location: 'ShangHai',
        dateFormat: 'Lunar + YMD',
        title_color: '#342534',
        fontColor: 'red',
        bg_color: 'pink',
        scale_color: 'yellow',
        split_color: '#778899',
        date_color: '#228877',
        weekend_color: '#445533',
        hour_color: '#0C80F3',
        minute_color: '#29E629',
        second_color: '#E207E2',
        scale_width: '',
        scale_height: '',
        split_width: '',
        split_height: ''
      },
      colorPicker: {
        bg_color: false,
        fontColor: false
      },
      options: {
        playTime_noticeShow: false,
        scale_width_noticeShow: false,
        scale_height_noticeShow: false,
        split_width_noticeShow: false,
        split_height_noticeShow: false,
        textContent_noticeShow: false
      }
    }

    this.selectChange = this.selectChange.bind(this);
    this.resetData = this.resetData.bind(this);
    this.submitData = this.submitData.bind(this);
    // this.handleTimeChange = this.handleTimeChange.bind(this);
    this.submitDataChange = this.submitDataChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.selectChange = this.selectChange.bind(this);
  }
  componentDidMount() {
    const { config } = this.state;
  }
  selectChange(e) {
    const _key = e.target.name;
    const _value = e.target.value;
    const _data = this.state.data;
    this.setState({
      data: {
        ..._data,
        [_key]: _value
      }
    }, () => { console.log(this.state.data) })
  }
  resetData() {
    const { initData } = this.state;
    this.setState({
      data: initData
    })
  }
  submitData() {
    const _virtualClock = this.state.data;
    let _options = null;
    for (let k in _virtualClock) {
      if (!_virtualClock[k]) {
        const warnTarget = `${k}_noticeShow`;
        _options = {
          ..._options,
          [warnTarget]: true
        }
      }
    }
    if (_options) {
      this.setState({
        options: _options
      })
    } else {
      console.table(_virtualClock);
    }
    // if(!_digitalClockData.playTime){
    //   this.setState({
    //     options:{
    //       noticeShow: true
    //     }
    //   })
    // } else {
    //   console.log('模拟时钟的设置:', _digitalClockData);
    // }
  }
  submitDataChange(e, _id, _property) {
    const _options = this.state.options;
    const _textContent = e.target.value;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    const _show = `${__id}${_property}_noticeShow`;
    if (!_textContent) {
      this.setState({
        options: {
          ..._options,
          [_show]: true
        }
      })
    } else {
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
  // }
  handleColorPicker(item) {
    const id = item;
    this.setState({
      colorPicker: {
        [id]: !this.state.colorPicker[id]
      }
    })
  }
  handleColorChange(item, color) {
    const colorPicker_id = item;
    this.setState({
      data: {
        ...this.state.data,
        [colorPicker_id]: color.hex
      }
    });
  }
  renderOptions(_property, _id) {
    const { config, data } = this.state;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    return (<select className='form-control' name={_name} onChange={this.selectChange} value={data[_name]}>{config[_property].map((item, index) => {
      for (let k in item) {
        return <option value={item[k]} key={index}>{k}</option>
      }
    })}</select>)
  }
  // 这是一段绝妙的代码
  // renderSelect(_idArray, _propertyArray){
  //   const {config, data} = this.state;
  //   return _idArray.map((item, index) => {
  //     return _propertyArray.map((_item, _index) => {
  //       return <select key={_index} name={`${item}_${_item}`}>{config[_item].map(($item, $index) => {
  //         for(let k in $item){
  //           return <option value={$item[k]} key={$index}>{k}</option>
  //         }
  //       })}</select>
  //     })
  //   })
  // }
  render() {
    const { config, data, colorPicker, options } = this.state;
    // Get basic OptionComponent, ready to add for <select />
    // const _propertyArray = ['timeZone', 'fontFamily', 'fontSize'];
    //Render all select components
    // const _idArray = ['title', 'scale', 'split', 'weekend'];
    // const selectComponentArray = this.renderSelect(_propertyOptions, _fontFmailyIdArray);
    // const selectComponentArray = this.renderSelect(_idArray, _propertyArray);
    // console.log(this.renderSelect(_idArray, _propertyArray));

    return (
      <div className='pro-container virtualClock' id='virtualClock'>
        <div className='row'>
          <div className='form-group'>
            <label class="control-label" for="virtualClock">
              <FormattedMessage id='mediaPublish.materialName' />
            </label>
            <div className='input-container input-s-w-1'>
              <input className='form-control' type='text' value={data.name} disabled />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='form-group margin-right-1'>
            <label class="control-label" for="virtualClock">
              <FormattedMessage id='mediaPublish.timeZone' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('timeZone')}
            </div>
          </div>
          <div className='form-group margin-right-1'>
            <label class="control-label">
              <FormattedMessage id='mediaPublish.playDuration' />
            </label>
            <div className='input-container input-s-w-3'>
              <input className='form-control' type='number' placeholder='s' onChange={(e) => { this.submitDataChange(e, '', 'playTime') }} value={data.playTime} />
              <span className='promot'>
                <span className={`${options.playTime_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span>
              </span>
            </div>
          </div>
          <div className='form-group'>
            <label class="control-label">
              <FormattedMessage id='mediaPublish.bgColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' id='bg_color' onClick={() => { this.handleColorPicker('bg_color') }} style={{ backgroundColor: data.bg_color, borderColor: data.bg_color }}>
              {colorPicker.bg_color ? <SketchPicker color={data.bg_color} onChange={(color) => { this.handleColorChange('bg_color', color) }} /> : null}
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group'>
            <label className="control-label">
              <FormattedMessage id='mediaPublish.titleContent' />
            </label>
            <div className='input-container input-s-w-1'>
              <input className='form-control' type='text' value={data.textContent} onChange={(e) => { this.submitDataChange(e, '', 'textContent') }} />
              <span className='promot'>
                <span className={`${options.textContent_noticeShow === true ? 'show' : 'hidden'}`}>请输入标题内容</span>
              </span>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleType' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('type', 'scale')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleWidth' />
            </label>
            <div className='input-container input-s-w-3'>
              <input className='form-control' type='number' value={data.scale_width} onChange={(e) => { this.submitDataChange(e, 'scale', 'width') }} />
              <span className='promot'>
                <span className={`${options.scale_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入时标宽度</span>
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleHeight' />
            </label>
            <div className='input-container input-s-w-3'>
              <input className='form-control' type='number' value={data.scale_height} onChange={(e) => { this.submitDataChange(e, 'scale', 'height') }} />
              <span className='promot'>
                <span className={`${options.scale_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入时标高度</span>
              </span>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleFont' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontFamily', 'scale')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleSize' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontSize', 'scale')}
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.timeScaleColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('scale_color') }} style={{ backgroundColor: data.scale_color, borderColor: data.scale_color }}>
              {colorPicker.scale_color ? <SketchPicker color={data.scale_color} onChange={color => { this.handleColorChange('scale_color', color) }} /> : null}
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.markingType' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('type', 'split')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.markingWidth' />
            </label>
            <div className='input-container input-s-w-3'>
              <input className='form-control' type='number' value={data.split_width} onChange={(e) => { this.submitDataChange(e, 'split', 'width') }} />
              <span className='promot'>
                <span className={`${options.split_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入分标宽度</span>
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label className='control-label'>
              <FormattedMessage id='mediaPublish.markingHeight' />
            </label>
            <div className='input-container input-s-w-3'>
              <input className='form-control' type='number' value={data.split_height} onChange={(e) => { this.submitDataChange(e, 'split', 'height') }} />
              <span className='promot'>
                <span className={`${options.split_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入分标高度</span>
              </span>
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.markingFont' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontFamily', 'split')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='form-label'><FormattedMessage id='mediaPublish.markingSize' /></label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontSize', 'split')}
            </div>
          </div>

          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.markingColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('split_color') }} style={{ backgroundColor: data.split_color, borderColor: data.split_color }}>
              {colorPicker.split_color ? <SketchPicker color={data.split_color} onChange={color => { this.handleColorChange('split_color', color) }} /> : null}
            </div>
          </div>

        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.areaSet' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('location')}
            </div>
          </div>
          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.dateFormat' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('dateFormat')}
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.dateFont' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontFamily', 'date')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.dateSize' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontSize', 'date')}
            </div>
          </div>

          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.dateColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('date_color') }} style={{ backgroundColor: data.date_color, borderColor: data.date_color }}>
              {colorPicker.date_color ? <SketchPicker color={data.date_color} onChange={color => { this.handleColorChange('date_color', color) }} /> : null}
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.weekFont' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontFamily', 'weekend')}
            </div>
          </div>

          <div className='form-group margin-right-1'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.weekSize' />
            </label>
            <div className='input-container input-s-w-3'>
              {this.renderOptions('fontSize', 'weekend')}
            </div>
          </div>

          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.weekColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('weekend_color') }} style={{ backgroundColor: data.weekend_color, borderColor: data.weekend_color }}>
              {colorPicker.weekend_color ? <SketchPicker color={data.weekend_color} onChange={color => { this.handleColorChange('weekend_color', color) }} /> : null}
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.hourHandColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('hour_color') }} style={{ backgroundColor: data.hour_color, borderColor: data.hour_color }}>
              {colorPicker.hour_color ? <SketchPicker color={data.hour_color} onChange={color => { this.handleColorChange('hour_color', color) }} /> : null}
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.minuteHandColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('minute_color') }} style={{ backgroundColor: data.minute_color, borderColor: data.minute_color }}>
              {colorPicker.minute_color ? <SketchPicker color={data.minute_color} onChange={color => { this.handleColorChange('minute_color', color) }} /> : null}
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label'>
              <FormattedMessage id='mediaPublish.secondHandColor' />
            </label>
            <div className='color-picker input-container input-s-w-3' onClick={() => { this.handleColorPicker('second_color') }} style={{ backgroundColor: data.second_color, borderColor: data.second_color }}>
              {colorPicker.second_color ? <SketchPicker color={data.second_color} onChange={color => { this.handleColorChange('second_color', color) }} /> : null}
            </div>
          </div>
        </div>
        <footer>
          <div>
            <button id='reset-btn' className='btn btn-primary' onClick={this.resetData}><FormattedMessage id='mediaPublish.reset' /></button>
            <button id='confirm-btn' className='btn btn-primary' onClick={this.submitData}><FormattedMessage id='mediaPublish.apply' /></button>
          </div>
        </footer>
      </div>
    )
  }
}

export default injectIntl(VirtualClock);