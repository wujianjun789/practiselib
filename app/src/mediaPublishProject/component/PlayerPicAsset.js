import React, { PureComponent } from 'react';
import { numbersValid } from '../../util/index';

import {FormattedMessage, injectIntl} from 'react-intl';
import {getItembyId} from '../../api/mediaPublish';
class PlayerPicAsset extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      //计划
      property:{
        //图片素材
        assetName:'',
        displayMode:'',
        animation: '',
        playDuration: '',
        playSpeed: '',
      },
      prompt:{
        //计划
        playDuration: false, playSpeed: false,
      },
    };
    this.data = {};
    this.animationList = [
      { value: 0, title: '立即显示' }, { value: 1, title: '闪烁' }, { value: 2, title: '长串左移' },
      { value: 3, title: '上移' }, { value: 4, title: '下移' }, { value: 5, title: '左移' },
      { value: 6, title: '右移' }, { value: 7, title: '自上而下展现' }, { value: 8, title: '自下而上展现' },
      { value: 9, title: '自右而左展现' }, { value: 10, title: '自左而右展现' }, { value: 11, title: '自上而下百叶窗' },
      { value: 12, title: '自下而上百叶窗' }, { value: 13, title: '自右而左百叶窗' }, { value: 14, title: '自左而右百叶窗' },
      { value: 15, title: '自上而下棋盘格' }, { value: 16, title: '自下而上棋盘格' }, { value: 17, title: '自右而左棋盘格' },
      { value: 18, title: '自左而右棋盘格' }, { value: 19, title: '上下向中间合拢' }, { value: 20, title: '中间向上下展开' },
      { value: 21, title: '左右向中间合拢' }, { value: 22, title: '中间向左右展开' }, { value: 23, title: '矩形自四周向中心合拢' },
      { value: 24, title: '矩形自中心向四周展开' }, { value: 25, title: '向左拉幕' }, { value: 26, title: '向右拉幕' },
      { value: 27, title: '向上拉幕' }, { value: 28, title: '向下拉幕' }, { value: 29, title: '矩形自左下向右上展现' },
      { value: 30, title: '矩形自左上向右下展现' }, { value: 31, title: '矩形自右下向左上展现' }, { value: 32, title: '矩形自右上向左下展现' },
      { value: 33, title: '斜线自左上向右下展现' }, { value: 34, title: '斜线自右下向左上展现' }, { value: 35, title: '随机' },
    ];
    this.displayModeList = [{ value: 0, title: '平铺' }, { value: 1, title: '拉伸' }, { value: 2, title: '缩放' }];
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
    getItembyId(projectId, planId, sceneId, areaId, data.id, 3, (res) => {
      this.data = res;
      property.displayMode = res.scale ? res.scale : this.displayModeList[0].value;
      property.animation = res.inTransition ? res.inTransition.transition : this.animationList[0].value;
      property.playDuration = res.baseInfo ? res.baseInfo.playDuration/1000 : null;
      property.playSpeed = res.inTransition ? res.inTransition.speed : null;
      this.mounted && this.setState({property:Object.assign({}, property)});
    });
  }

  onChange=(id, e) => {
    let prompt = false;
    const val = e.target.value;
    if (id == 'playDuration' || id == 'playSpeed') {
      if (!numbersValid(val)) {
        prompt = true;
      }
      this.setState({prompt: Object.assign({}, this.state.prompt, { [id]: prompt })});      
    }
    this.setState({property: Object.assign({}, this.state.property, {[id]: val})});
  }

  playerPicAssetClick=(id) => {
    const { displayMode, animation, playDuration, playSpeed } = this.state.property;
    switch (id) {
    case 'apply': {
      this.data.baseInfo.playDuration = playDuration*1000;
      this.data.scale = displayMode;
      this.data.inTransition = {
        transition: animation,
        speed: playSpeed,
      };
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
    return <div className="pro-container playerPicAsset">
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
        <div className="form-group">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.displayMethod'})}</label>
          <div className="input-container input-w-2">
            <select className="form-control" value={property.displayMode}
              onChange={event => this.onChange('displayMode', event)}>
              {
                this.displayModeList.map((option, index) => {
                  return <option key={index} value={option.value}>
                    {option.title}
                  </option>;
                })}
            </select>
          </div>
        </div>
        <div className="form-group pull-right">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.animation2'})}</label>
          <div className="input-container">
            <select className="form-control input-w-2" value={property.animation}
              onChange={event => this.onChange('animation', event)}>
              {
                this.animationList.map((option, index) => {
                  return <option key={index} value={option.value}>
                    {option.title}
                  </option>;
                })}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label className="control-label">{this.props.intl.formatMessage({id:'mediaPublish.playDuration'})}</label>
          <div className="input-container input-w-2">
            <input type="text" className="form-control" maxLength="8" value={property.playDuration}
              onChange={event => this.onChange('playDuration', event)} />
            <span className={prompt.playDuration ? 'prompt ' : 'prompt hidden'}>
              <FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div>
        <div className="form-group pull-right">
          <label className="col-sm-3 control-label">
            {this.props.intl.formatMessage({id:'mediaPublish.playSpeed'})}</label>
          <div className="input-container input-w-2">
            <input type="text" className="form-control" maxLength="8" value={property.playSpeed}
              onChange={event => this.onChange('playSpeed', event)} />
            <span className={prompt.playSpeed ? 'prompt ' : 'prompt hidden'}>
              <FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div>
      </div>
      <div className="row line"/>
      <div className="row">
        <button className="btn btn-primary pull-right" onClick={() => { this.playerPicAssetClick('apply'); }}>
          <FormattedMessage id="mediaPublish.apply"/></button>
        <button className="btn btn-gray margin-right-1 pull-right" 
          onClick={() => { this.playerPicAssetClick('reset'); }}><FormattedMessage id="mediaPublish.reset"/></button>
      </div>
    </div>;
  }
}

export default injectIntl(PlayerPicAsset);