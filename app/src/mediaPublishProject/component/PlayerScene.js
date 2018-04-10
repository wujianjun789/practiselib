/**
 * Created by a on 2017/11/20.
 */
import React, { PureComponent } from 'react';

import {getSceneById} from '../../api/mediaPublish';

import lodash from 'lodash';
import { NameValid, numbersValid } from '../../util/index';

import {FormattedMessage, injectIntl, FormattedDate} from 'react-intl';

class PlayerScene extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      property: {
        //场景名称
        sceneName: { key: 'assetName', title: this.props.intl.formatMessage({id:'name'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.materialName'}), defaultValue:name ? name : '', value: '' },
        playMode: { key: 'playMode', title: this.props.intl.formatMessage({id:'mediaPublish.playingMode'}),
          list: [{ id: 1, name: this.props.intl.formatMessage({id:'mediaPublish.times.play'}), type:0 },
            { id: 2, name: this.props.intl.formatMessage({id:'mediaPublish.time.play'}), type:1 },
            { id: 3, name: this.props.intl.formatMessage({id:'mediaPublish.loop.play'}), type:2 }], defaultIndex: 2, index: 2, name: this.props.intl.formatMessage({id:'mediaPublish.loop.play'}) },
        playModeCount: { key: 'playModeCount', title: this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'}), placeholder: this.props.intl.formatMessage({id:'mediaPublish.number'}), active: false,
          defaultValue: 1, value: 1,
          defaultValue2: 0, value2: 0},
      },
      prompt: {
        //场景
        sceneName: false, /*playMode: playMode?false:true,*/ playModeCount: false,
      },
    };

    this.onChange = this.onChange.bind(this);
    this.playerSceneClick = this.playerSceneClick.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
    this.applyHandler = this.applyHandler.bind(this);
    this.updatePlayMode = this.updatePlayMode.bind(this);
    this.init = this.init.bind(this);
    this.initProperty = this.initProperty.bind(this);
  }

  componentWillMount() {
    this.mounted = true;
    this.init();
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  init() {
    const {projectId, parentId, data} = this.props;
    if (!data || !data.id || data.id == this.state.id) {
      return false;
    }

    if (projectId && parentId && data.id && (typeof data.id == 'number' || data.id.indexOf('scene&&') < 0)) {
      getSceneById(projectId, parentId, data.id, data => {this.mounted && this.initProperty(data);});
    } else if (typeof data.id == 'string' && data.id.indexOf('scene&&') > -1) {
      this.state.property.sceneName.defaultValue = this.state.property.sceneName.value = data.name;
      this.setState({id:data.id, property: Object.assign({}, this.state.property),
        prompt: {sceneName:!data.name}});
    }
  }

  initProperty(data) {
    const modeList = this.state.property.playMode.list;
    const modeIndex = lodash.findIndex(modeList, item => {
      return item.type == data.playMode;
    });
    this.state.property.sceneName.defaultValue = this.state.property.sceneName.value = data.name;
    // this.state.property.playMode.defaultIndex = this.state.property.playMode.index = modeIndex;
    // this.state.property.playMode.name = modeList[modeIndex].name;
    this.updatePlayMode(modeIndex);
    this.state.property.playModeCount.defaultValue = this.state.property.playModeCount.value = data.playTimes;
    this.state.property.playModeCount.defaultValue2 = this.state.property.playModeCount.value2 = data.playDuration;

    this.setState({id: data.id, property: Object.assign({}, this.state.property),
      prompt: {sceneName: !data.name,  playModeCount: !((modeIndex == 0 && numbersValid(data.playTimes) || modeIndex == 1 && numbersValid(data.playDuration))) }});
  }

  updatePlayMode(playMode) {
    const playModeList = this.state.property.playMode.list;
    if (playMode != undefined && playMode > -1 && playMode < playModeList.length) {
      this.state.property.playMode.defaultIndex = playMode;
      this.state.property.playMode.index = playMode;
      this.state.property.playMode.name = playModeList[playMode].name;
      if (playMode == 2) {
        this.state.property.playModeCount.active = false;
      } else {
        this.state.property.playModeCount.active = true;
      }
      this.setState({property:Object.assign({}, this.state.property)});
    }
  }

  applyHandler() {
    const {property,prompt} = this.state;
    if(prompt.sceneName){
      return false;
    }

    let sceneId = this.props.data.id;
    let data = {
      name: property.sceneName.value,
      type: 0,
      playMode: property.playMode.list[property.playMode.index].type,
      playDuration: isNaN(parseInt(property.playModeCount.value2)) ?  0 : parseInt(property.playModeCount.value2),
      playTimes: isNaN(parseInt(property.playModeCount.value)) ? 0 : parseInt(property.playModeCount.value),
    };

    if (sceneId && (typeof sceneId == 'number' || sceneId.indexOf('scene&&') < 0)) {
      data = Object.assign({}, data, {id:sceneId});
    }
    this.props.applyClick && this.props.applyClick(data);
  }

  resetHandler() {
    for (let key in this.state.property) {
      if (key == 'playMode') {
        this.updatePlayMode(this.state.property[key].defaultIndex);
      }
      const defaultValue = this.state.property[key].defaultValue;
      this.state.property[key].value = defaultValue;
    }

    for (let key in this.state.prompt) {
      const defaultValue2 = this.state.property[key].defaultValue;
      this.state.prompt[key] = !defaultValue2;
    }
    this.setState({property: Object.assign({}, this.state.property)});
  }

  playerSceneClick(id) {
    console.log(id);
    switch (id) {
    case 'apply':
      this.applyHandler();
      break;
    case 'reset':
      this.resetHandler();
      break;
    default:
      break;
    }
  }

  onChange(id, value) {
    console.log('id:', id);
    if ( id == 'playMode') {
      const curIndex = value.target.selectedIndex;
      console.log('correct', curIndex);
      let title = this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'});
      let placeholder = this.props.intl.formatMessage({id:'mediaPublish.number'});
      let active = true;
      let updateId = 'playModeCount';
      let prompt = false;
      switch (curIndex) {
      case 0:
        title = this.props.intl.formatMessage({id:'mediaPublish.repeatTimes'});
        placeholder = this.props.intl.formatMessage({id:'mediaPublish.number'});
        if (!numbersValid(this.state.property.playModeCount.value)) {
          prompt = true;
        }
        break;
      case 1:
        title = this.props.intl.formatMessage({id:'mediaPublish.time'});
        placeholder = this.props.intl.formatMessage({id:'app.second'});
        if (!numbersValid(this.state.property.playModeCount.value2)) {
          prompt = true;
        }
        break;
      case 2:
        active = false;
        break;
      default:
        break;
      }
      this.setState({
        property: Object.assign({}, this.state.property,
          { [id]: Object.assign({}, this.state.property[id], { index: curIndex, name: this.state.property[id].list[curIndex].name }) },
          { [updateId]: Object.assign({}, this.state.property[updateId], { title: title, placeholder: placeholder, active: active }) }),
        prompt: Object.assign({}, this.state.prompt, {playModeCount: prompt}),
      });
    } else {
      let prompt = false;

      const val = value.target.value;
      if (id == 'sceneName') {
        if (!NameValid(val)) {
          prompt = true;
        }
      } else {
        if (!numbersValid(val)) {
          prompt = true;
        }
      }
      let valueKey = {};
      if (id == 'playModeCount' && this.state.property.playMode.index == 1) {
        valueKey = {value2: val};
      } else {
        valueKey = {value: val};
      }
      this.setState({
        property: Object.assign({}, this.state.property, { [id]: Object.assign({}, this.state.property[id], valueKey) }),
        prompt: Object.assign({}, this.state.prompt, { [id]: prompt }),
      });
    }
  }

  render() {
    const {property, prompt} = this.state;
    const Invalid = prompt.sceneName;
    return <div className={'pro-container playerScene '}>
      <div className="row">
        <div className="form-group  scene-name">
          <label className="control-label"
            htmlFor={property.sceneName.key}>{property.sceneName.title}</label>
          <div className="input-container input-w-1">
            <input type="text" className={'form-control '}
              placeholder={property.sceneName.placeholder} maxLength="8"
              value={property.sceneName.value}
              onChange={event => this.onChange('sceneName', event)} />
            <span className={prompt.sceneName ? 'prompt ' : 'prompt hidden'}><FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="form-group">
          <label className="control-label"
            htmlFor={property.playMode.key}>{property.playMode.title}</label>
          <div className="input-container input-w-2">
            <select className={'form-control'} value={property.playMode.name} onChange={event => this.onChange('playMode', event)}>
              {
                property.playMode.list.map((option, index) => {
                  let value = option.name;
                  return <option key={index} value={value}>
                    {value}
                  </option>;
                })}
            </select>
            {/*<span className={prompt.playMode?"prompt ": "prompt hidden"}>{"请输入正确参数"}</span>*/}
          </div>
        </div>
        <div className={'form-group pull-right ' + (property.playModeCount.active ? '' : 'hidden')}>
          <label className="control-label">{property.playModeCount.title}</label>
          <div className={'input-container input-w-2 '}>
            <input type="text" className={'form-control '} htmlFor={property.playModeCount.key} placeholder={property.playModeCount.placeholder} maxLength="8"
              value={property.playMode.index == 0 ? property.playModeCount.value : property.playModeCount.value2} onChange={event => this.onChange('playModeCount', event)} />
            <span className={prompt.playModeCount ? 'prompt ' : 'prompt hidden'}><FormattedMessage id="mediaPublish.check"/></span>
          </div>
        </div>
      </div>
      <div className="row line"/>
      <div className="row">
        <button className={"btn btn-primary pull-right "+(Invalid?'disabled':'')} onClick={() => { this.playerSceneClick('apply'); }}><FormattedMessage id="mediaPublish.apply"/></button>
        <button className="btn btn-gray margin-right-1 pull-right" onClick={() => { this.playerSceneClick('reset'); }}><FormattedMessage id="mediaPublish.reset"/></button>
      </div>
    </div>;
  }
}

export default injectIntl(PlayerScene);