/** 魔法，勿动！
  * Created By ChrisWen
  * 17/11/22
  * VirtualClock
  */
import React, { Component } from 'react';
import PanelFooter from '../../components/PanelFooter.js';
import _virtualClock from '../config/virtualClock.js';
import { SketchPicker, BlockPicker } from 'react-color';
import ColorPicker from '../../components/ColorPicker';
import '../../../public/styles/virtualClock.less';

import { FormattedMessage, injectIntl, FormattedDate } from 'react-intl';

class VirtualClock extends Component {
  constructor(props) {
    super(props);

    this.resetData(0);
    this.state.config = _virtualClock;
    this.selectChange = this.selectChange.bind(this);
    this.resetData = this.resetData.bind(this);
    this.submitData = this.submitData.bind(this);
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
    this.setState({
      [_key]: _value,
    }, () => { console.log(this.state); });
  }

  resetData(type) {
    const {initData} = _virtualClock;
    const {defaultValue = {}} = this.props;
    for (let _k in initData) {
      if (defaultValue[_k] !== null && defaultValue[_k] !== undefined) {
        initData[_k] = defaultValue[_k];
      }
    }
    if (type === 0) {
      this.state = initData;
    } else {
      this.setState({
        ...initData,
      });
    }
  }
  submitData() {
    const _virtualClock = this.state;
    let _options = null;
    for (let k in _virtualClock) {
      if (!_virtualClock[k] && k !== 'config' && k !== 'options') {
        const warnTarget = `${k}_noticeShow`;
        _options = {
          ..._options,
          [warnTarget]: true,
        };
      }
    }
    if (_options) {
      this.setState({
        options: _options,
      });
    } else {
      const {options, config, ...data} = _virtualClock;
      console.table(data);
    }
  }
  submitDataChange(e, _id, _property) {
    const _options = this.state.options;
    const _textContent = e.target.value;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    const _show = `${__id}${_property}_noticeShow`;
    if (!_textContent) {
      this.setState({
        [_name]: _textContent,
        options: {
          ..._options,
          [_show]: true,
        },
      });
    } else {
      this.setState({
        [_name]: _textContent,
        options: {
          ..._options,
          [_show]: false,
        },
      });
    }
  }
  // }
  handleColorPicker(item) {
    const id = item;
    this.setState({
      colorPicker: {
        [id]: !this.state.colorPicker[id],
      },
    });
  }
  handleColorChange(item, color) {
    // console.log('item', item);
    // console.log('color',color);
    // const colorPicker_id = item;
    this.setState({
      [item]: color,
    });
  }
  renderOptions(_property, _id) {
    const { config, data } = this.state;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    return (<select className="form-control" name={_name} onChange={this.selectChange} value={this.state[_name]}>{config[_property].map((item, index) => {
      for (let k in item) {
        return <option value={item[k]} key={index}>{k}</option>;
      }
    })}</select>);
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
    const { config, colorPicker, options } = this.state;
    return (
      <div className="pro-container virtualClock" id="virtualClock">
        <div className="row">
          <div className="form-group">
            <label class="control-label" for="virtualClock">
              <FormattedMessage id="mediaPublish.materialName" />
            </label>
            <div className="input-container input-s-w-1">
              <input className="form-control" type="text" value={this.state.name} disabled />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group margin-right-1">
            <label class="control-label" for="virtualClock">
              <FormattedMessage id="mediaPublish.timeZone" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('timeZone')}
            </div>
          </div>
          <div className="form-group margin-right-1">
            <label class="control-label">
              <FormattedMessage id="mediaPublish.playDuration" />
            </label>
            <div className="input-container input-s-w-3">
              <input className="form-control" type="number" placeholder="s" onChange={(e) => { this.submitDataChange(e, '', 'playTime'); }} value={this.state.playTime} />
              <span className="prompt">
                <span className={`${options.playTime_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span>
              </span>
            </div>
          </div>
          <div className="form-group">
            <label class="control-label">
              <FormattedMessage id="mediaPublish.bgColor" />
            </label>
            <div className="input-container input-s-w-3" id="bg_color">
              <ColorPicker value={this.state.bg_color} onChange={(color) => { this.handleColorChange('bg_color', color); }}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.titleContent" />
            </label>
            <div className="input-container input-s-w-1">
              <input className="form-control" type="text" value={this.state.textContent} onChange={(e) => { this.submitDataChange(e, '', 'textContent'); }} />
              <span className="prompt">
                <span className={`${options.textContent_noticeShow === true ? 'show' : 'hidden'}`}>请输入标题内容</span>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleType" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('type', 'scale')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleWidth" />
            </label>
            <div className="input-container input-s-w-3">
              <input className="form-control" type="number" value={this.state.scale_width} onChange={(e) => { this.submitDataChange(e, 'scale', 'width'); }} />
              <span className="prompt">
                <span className={`${options.scale_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入时标宽度</span>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleHeight" />
            </label>
            <div className="input-container input-s-w-3">
              <input className="form-control" type="number" value={this.state.scale_height} onChange={(e) => { this.submitDataChange(e, 'scale', 'height'); }} />
              <span className="prompt">
                <span className={`${options.scale_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入时标高度</span>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleFont" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontFamily', 'scale')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleSize" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontSize', 'scale')}
            </div>
          </div>

          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.timeScaleColor" />
            </label>
            <div className="color-picker input-container input-s-w-3">
              <ColorPicker value={this.state.scale_color} onChange={(color) => { this.handleColorChange('scale_color', color); }}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.markingType" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('type', 'split')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.markingWidth" />
            </label>
            <div className="input-container input-s-w-3">
              <input className="form-control" type="number" value={this.state.split_width} onChange={(e) => { this.submitDataChange(e, 'split', 'width'); }} />
              <span className="prompt">
                <span className={`${options.split_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入分标宽度</span>
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="control-label">
              <FormattedMessage id="mediaPublish.markingHeight" />
            </label>
            <div className="input-container input-s-w-3">
              <input className="form-control" type="number" value={this.state.split_height} onChange={(e) => { this.submitDataChange(e, 'split', 'height'); }} />
              <span className="prompt">
                <span className={`${options.split_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入分标高度</span>
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.markingFont" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontFamily', 'split')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="form-label"><FormattedMessage id="mediaPublish.markingSize" /></label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontSize', 'split')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.markingColor" />
            </label>
            <div className="color-picker input-container input-s-w-3">
              <ColorPicker value={this.state.split_color} onChange={(color) => { this.handleColorChange('split_color', color); }}/>
            </div>
          </div>

        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.areaSet" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('location')}
            </div>
          </div>
          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.dateFormat" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('dateFormat')}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.dateFont" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontFamily', 'date')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.dateSize" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontSize', 'date')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.dateColor" />
            </label>
            <div className="color-picker input-container input-s-w-3" >
              <ColorPicker value={this.state.date_color} onChange={(color) => { this.handleColorChange('date_color', color); }}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.weekFont" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontFamily', 'weekend')}
            </div>
          </div>

          <div className="form-group margin-right-1">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.weekSize" />
            </label>
            <div className="input-container input-s-w-3">
              {this.renderOptions('fontSize', 'weekend')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.weekColor" />
            </label>
            <div className="color-picker input-container input-s-w-3" >
              <ColorPicker value={this.state.weekend_color} onChange={(color) => { this.handleColorChange('weekend_color', color); }}/>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.hourHandColor" />
            </label>
            <div className="color-picker input-container input-s-w-3" id="hour_color">
              <ColorPicker value={this.state.hour_color} onChange={(color) => { this.handleColorChange('hour_color', color); }}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.minuteHandColor" />
            </label>
            <div className="color-picker input-container input-s-w-3" id="minute_color">
              <ColorPicker value={this.state.minute_color} onChange={(color) => { this.handleColorChange('minute_color', color); }}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">
              <FormattedMessage id="mediaPublish.secondHandColor" />
            </label>
            <div className="color-picker input-container input-s-w-3" id="second_color">
              <ColorPicker value={this.state.second_color} onChange={(color) => { this.handleColorChange('second_color', color); }}/>
            </div>
          </div>
        </div>
        <footer>
          <div>
            <button id="reset-btn" className="btn btn-primary" onClick={this.resetData}><FormattedMessage id="mediaPublish.reset" /></button>
            <button id="confirm-btn" className="btn btn-primary" onClick={this.submitData}><FormattedMessage id="mediaPublish.apply" /></button>
          </div>
        </footer>
      </div>
    );
  }
}

export default injectIntl(VirtualClock);