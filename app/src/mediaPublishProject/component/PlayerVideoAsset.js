import React, { PureComponent } from 'react';
import { numbersValid } from '../../util/index';
import moment from 'moment';
import { TimePicker } from 'antd';
import {FormattedMessage, injectIntl} from 'react-intl';
import {getItembyId} from '../../api/mediaPublish';

class PlayerPicAsset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //计划
      property:{
        //视频素材
        assetName: '',
        // playTimes: '',
        playType: '',
        playTimeBegin: moment.utc(moment(0)),
        playTimeEnd: moment.utc(moment(0)),
        scale: '',
        // volume: '',
      },
      prompt:{
        //计划
        playTimes: false, clipsRage: false,
      },
    };
    this.data = {};
    this.playTypeList = [
      { value: 1, title: '片段播放' }, { value: 0, title: '完整播放' },
    ];
    this.scaleList = [
      { value: 0, title: '铺满' }, { value: 1, title: '原始比例' }, { value: 2, title: '4:3' },
      { value: 3, title: '5:4' }, { value: 4, title: '16:9' },
    ];
    // this.volumeList = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  }

  componentWillMount() {
    this.mounted = true;
    this.requestItem();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate() {
    const {data} = this.props;
    if (data.id !== this.state.id) {
      this.setState({id: data.id}, () => {this.requestItem();});
    }
  }

  requestItem=() => {
    const {projectId, planId, sceneId, areaId, data} = this.props;
    let {property} = this.state;
    property.assetName = data.name;
    getItembyId(projectId, planId, sceneId, areaId, data.id, 4, (res) => {
      this.data = res;
      // property.playTimes = res.playTimes ? res.playTimes : '';
      property.playType = res.playType ? res.playType : this.playTypeList[0].value;
      property.playTimeBegin = res.playTimeBegin  ? this.initTime(res.playTimeBegin) : this.initTime(0);
      property.playTimeEnd = res.playTimeEnd  ? this.initTime(res.playTimeEnd) : this.initTime(0);
      property.scale = res.scale ? res.scale : this.scaleList[0].value;
      // property.volume = res.volume ? res.volume : this.volumeList[0];
      const prompt = !(property.playTimeBegin && property.playTimeEnd && !property.playTimeEnd.isBefore(property.playTimeBegin));
      console.log('init:',prompt);
      this.mounted && this.setState({property:Object.assign({}, property), prompt:Object.assign({}, this.state.prompt, {clipsRage:prompt})});
    });
  }

  initTime=(data) => {
    return moment.utc(moment(data));
  }

  getTime=(data) => {
    return data.hour() * 60 * 60 * 1000 + data.minute() * 60 * 1000 + data.second() * 1000;
  }

  onChange=(id, e) => {
    // let prompt = false;
    const val = e.target.value;
    // if (id == 'playTimes') {
    //   if (!numbersValid(val)) {
    //     prompt = true;
    //     this.setState({prompt: Object.assign({}, this.state.prompt, { [id]: prompt })});
    //   }
    // }
    this.setState({property: Object.assign({}, this.state.property, {[id]: val})});
  }

  timeChange=(id, value) => {
    this.setState({property: Object.assign({}, this.state.property, {[id]: value})}, () => {
      const {playTimeBegin, playTimeEnd} = this.state.property;
      let prompt = !(playTimeBegin && playTimeEnd && !playTimeEnd.isBefore(playTimeBegin));
      this.setState({prompt:Object.assign({}, this.state.prompt, {clipsRage:prompt})});
    });
  }

  playerVideoAssetClick=(id) => {
    const { playType, playTimeBegin, playTimeEnd, scale} = this.state.property;
    switch (id) {
    case 'apply': {
      this.data.playType = playType;
      // this.data.playTimes = playTimes;
      this.data.playTimeBegin = this.getTime(playTimeBegin);
      this.data.playTimeEnd = this.getTime(playTimeEnd);
      this.data.scale = scale;
      this.props.applyClick && this.props.applyClick(this.data);
      break;
    }
    case 'reset': 
      this.requestItem();
      break;
    default:
      break;
    }
  }


  render() {
    const {property, prompt} = this.state;
    const Invalid = prompt.clipsRage;
    return <div className="pro-container playerVideoAsset">
      <div className="row">
        <div className="form-group">
          <label className="control-label">{this.props.intl.formatMessage({id:'name'})}</label>
          <div className="input-container input-w-1">
            <input type="text" className="form-control" disabled="disabled"
              value={property.assetName} />
          </div>
        </div>
      </div>          
      <div className="row">
        {/* <div className="form-group"> 
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'})}</label>
          <div className="input-container input-w-2">
            <input type="text" className="form-control" maxLength="8"
              value={property.playTimes} onChange={event => this.onChange('playTimes', event)} />
            <span className={prompt.playTimes ? 'prompt ' : 'prompt hidden'}>
              <FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div> */}
        <div className="form-group">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.scalingRatio'})}</label>
          <div className="input-container input-w-2">
            <select className="form-control" value={property.scale}
              onChange={event => this.onChange('scale', event)}>
              {
                this.scaleList.map((option, index) => {
                  return <option key={index} value={option.value}>
                    {option.title}
                  </option>;
                })}
            </select>
          </div>
        </div>
        <div className="form-group pull-right">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.playType2'})}</label>
          <div className="input-container input-w-2">
            <select className="form-control" value={property.playType}
              onChange={event => this.onChange('playType', event)}>
              {
                this.playTypeList.map((option, index) => {
                  return <option key={index} value={option.value}>
                    {option.title}
                  </option>;
                })}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        {/* <div className="form-group">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.playType'})}</label>
          <div className="input-container input-w-2">
            <select className="form-control" value={property.playType}
              onChange={event => this.onChange('playType', event)}>
              {
                this.playTypeList.map((option, index) => {
                  return <option key={index} value={option.value}>
                    {option.title}
                  </option>;
                })}
            </select>
          </div>
        </div> */}
        <div className="form-group pull-right clipsRage">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.fragmentRange'})}</label>
          <div className="input-container input-w-2">
            <TimePicker disabled={property.playType == '0'} size="large" style={{ width: '88px' }}
              onChange={value => this.timeChange('playTimeBegin', value)} value={property.playTimeBegin} />
            <span className="text" style={{display: "inline-block", width: '34px', "textAlign": "center"}}><FormattedMessage id="mediaPublish.to"/></span>
            <TimePicker disabled={property.playType == '0'} size="large" style={{ width: '88px' }}
              onChange={value => this.timeChange('playTimeEnd', value)} value={property.playTimeEnd} />
            <span className={prompt.clipsRage ? 'prompt ' : 'prompt hidden'}>
              <FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div>
      </div> 
      {/* <div className="row">
        <div className="form-group pull-right">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.volume'})}</label>
          <div className="input-container input-w-2">
            <select className="form-control" value={property.volume}
              onChange={event => this.onChange('volume', event)}>
              {
                this.volumeList.map((option, index) => {
                  return <option key={index} value={option}>
                    {option}
                  </option>;
                })}
            </select>
          </div>
        </div>
      </div> */}
      <div className="row line"/>
      <div className="row">
        <button className={"btn btn-primary pull-right "+(Invalid?"disabled":"")} onClick={() => { this.playerVideoAssetClick('apply'); }}>
          <FormattedMessage id="mediaPublish.apply"/></button>
        <button className="btn btn-gray margin-right-1 pull-right" 
          onClick={() => { this.playerVideoAssetClick('reset'); }}>
          <FormattedMessage id="mediaPublish.reset"/></button>
      </div>
    </div>;
  }
}

export default injectIntl(PlayerPicAsset);