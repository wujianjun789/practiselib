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

 export default class VirtualClock extends Component {
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
         scale_width: '',
         scale_height: '',
         split_width: '',
         split_height: '',
         singleShow: false
       },
       data: this.props.data ? this.props.data :{
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
        scale_width: '',
        scale_height: '',
        split_width: '',
        split_height: '',
        singleShow: false
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
    this.handleData = this.handleData.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.selectChange = this.selectChange.bind(this);
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
      }}, ()=>{console.log(this.state.data)})
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
          noticeShow: true
        }
      })
    } else {
      console.log('模拟时钟的设置:', _digitalClockData);
    }
   }
   handleTextChange(e, _id, _property){
    const _options = this.state.options;
    const _textContent = e.target.value;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    const _show =`${__id}${_property}_noticeShow`;
    console.log(_name);
    if(!_textContent){
      this.setState({
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
   handleTimeChange(e){
     const _playTime = e.target.value;
     if(_playTime < 0 || !e){
      this.setState({
        options:{
          noticeShow: true
        }
      })
     } else {
      this.setState({
        data: {
          ...this.state.data,
          playTime: _playTime
        },
        options:{
          playTime_noticeShow: false,
          scale_width_noticeShow: false,
          scale_height_noticeShow: false,
          split_width_noticeShow: false,
          split_height_noticeShow: false,
          textContent_noticeShow: false
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
  renderOptions(_property, _id) {
    const { config, data } = this.state;
    const __id = _id ? `${_id}_` : '';
    const _name = `${__id}${_property}`;
    return (<select name={_name} onChange={this.selectChange} value={data[_name]}>{config[_property].map((item, index) => {
      for(let k in item) {
      return <option value={item[k]} key={index}>{k}</option>
    }})}</select>)
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

     return(
       <div className='pro-container virtualClock' id='virtualClock'>
        <ul>
          <li>
            <div>素材名称</div>
            <div className='input_form'>
              <input type='text' value={data.name} disabled/>
            </div>
          </li>
          <li>
            <div>
              <div>时区</div>
              {this.renderOptions('timeZone')}
            </div>
            <div>
              <div>播放时长</div>
              <div>
                <input type='number' placeholder='秒' onChange={this.handleTimeChange} value={data.playTime}/>
                <div className='notice'><span className={`${options.playTime_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
              </div>
            </div>
            <div>
              <div>背景颜色</div>
              <div className='color-picker' id='bg_color' onClick={() => {this.handleColorPicker('bg_color')}} style={{backgroundColor:data.bg_color,borderColor:data.bg_color}}>
                  {colorPicker.bg_color ? <SketchPicker color={data.bg_color} onChange={(color) => {this.handleColorChange('bg_color', color)} }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>标题内容</div>
            <div className='input_form'>
              <input type='text' value={data.textContent_textContent} onChange={(e) => {this.handleTextChange(e, '', 'textContent')}}/>
              <div className='notice'><span className={`${options.textContent_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
            </div>
          </li>
          <li>
            <div>
              <div>标题字体</div>
              {this.renderOptions('fontFamily', 'title')}
            </div>
            <div>
              <div>标题大小</div>
              {this.renderOptions('fontSize', 'title')}
            </div>
            <div>
              <div>标题颜色</div>
              <div className='color-picker' onClick={() => {this.handleColorPicker('title_color')}} style={{backgroundColor:data.title_color,borderColor:data.title_color}}>
                  {colorPicker.title_color ? <SketchPicker color={data.title_color} onChange={color => {this.handleColorChange('title_color', color)} }/> : null}
              </div>
            </div>
          </li>
          <li>
            <div>
              <div>时标类型</div>
              {this.renderOptions('type', 'scale')}
            </div>
            <div>
              <div>时标宽度</div>
              <div>
              <input type='text' value={data.scale_width} onChange={(e) => {this.handleTextChange(e, 'scale', 'width')}}/>
              <div className='notice'><span className={`${options.scale_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
            </div>
            </div>
            <div>
              <div>时标高度</div>
              <div>
              <input type='text' value={data.scale_height} onChange={(e) => {this.handleTextChange(e, 'scale', 'height')}}/>
              <div className='notice'><span className={`${options.scale_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
            </div>
            </div>
          </li>
          <li>
            <div>
              <div>时标字体</div>
              {this.renderOptions('fontFamily', 'scale')}
            </div>
            <div>
              <div>时标大小</div>
              {this.renderOptions('fontSize', 'scale')}
            </div>
            <div>
              <div>时标颜色</div>
              <div className='color-picker' onClick={() => {this.handleColorPicker('scale_color')}} style={{backgroundColor:data.scale_color,borderColor:data.scale_color}}>
                  {colorPicker.scale_color ? <SketchPicker color={data.scale_color} onChange={color => {this.handleColorChange('scale_color', color)} }/> : null}
              </div>
            </div>
          </li>
            <li>
              <div>
                <div>分标类型</div>
                {this.renderOptions('type', 'split')}
              </div>
              <div>
                <div>分标宽度</div>
                <div>
                <input type='text' value={data.split_width} onChange={(e) => {this.handleTextChange(e, 'split', 'width')}}/>
                <div className='notice'><span className={`${options.split_width_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
              </div>
              </div>
              <div>
                <div>分标高度</div>
                <div>
                <input type='text' value={data.split_height} onChange={(e) => {this.handleTextChange(e, 'split', 'height')}}/>
                <div className='notice'><span className={`${options.split_height_noticeShow === true ? 'show' : 'hidden'}`}>请输入播放时间</span></div>
              </div>
              </div>
            </li>
            <li>
              <div>
                <div>分标字体</div>
                {this.renderOptions('fontFamily', 'split')}
              </div>
              <div>
                <div>分标大小</div>
                {this.renderOptions('fontSize', 'split')}
              </div>
              <div>
                <div>分标颜色</div>
                <div className='color-picker' onClick={() => {this.handleColorPicker('split_color')}} style={{backgroundColor:data.split_color,borderColor:data.split_color}}>
                    {colorPicker.split_color ? <SketchPicker color={data.split_color} onChange={color => {this.handleColorChange('split_color', color)} }/> : null}
                </div>
              </div>
          </li>
          <li>
            <div>
              <div>区域设置</div>
              {this.renderOptions('location')}
            </div>
            <div>
              <div>日期格式</div>
              {this.renderOptions('dateFormat')}
            </div>
        </li>
          <li>
            <div>
              <div>日期字体</div>
              {this.renderOptions('fontFamily', 'date')}
            </div>
            <div>
              <div>日期大小</div>
              {this.renderOptions('fontSize', 'date')}
            </div>
            <div>
              <div>日期颜色</div>
              <div className='color-picker' onClick={() => {this.handleColorPicker('date_color')}} style={{backgroundColor:data.date_color,borderColor:data.date_color}}>
                  {colorPicker.date_color ? <SketchPicker color={data.date_color} onChange={color => {this.handleColorChange('date_color', color)} }/> : null}
              </div>
            </div>
        </li>
        <li>
          <div>
            <div>星期字体</div>
            {this.renderOptions('fontFamily', 'weekend')}
          </div>
          <div>
            <div>星期大小</div>
            {this.renderOptions('fontSize', 'weekend')}
          </div>
          <div>
            <div>星期颜色</div>
            <div className='color-picker' onClick={() => {this.handleColorPicker('weekend_color')}} style={{backgroundColor:data.weekend_color,borderColor:data.weekend_color}}>
                {colorPicker.weekend_color ? <SketchPicker color={data.weekend_color} onChange={color => {this.handleColorChange('weekend_color', color)} }/> : null}
            </div>
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
